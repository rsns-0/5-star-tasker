import { ClientUser, Guild, GuildBasedChannel } from 'discord.js';

import { TransactionException } from '../utils/errors/transactionException';
import { WebhookChannel } from '../utils/types';
import { container } from '@sapphire/pieces';

export class WebhookUtils {
	public async createWebHooksInAllChannelsOfGuild(guild: Guild) {
		if (!guild) {
			return new TransactionException({
				message: 'Guild was not located.'
			});
		}

		const { cache } = container.client.guilds;
		return cache.map(async ({ channels: { cache } }) => {
			// Loop over all channels in the guild
			const webhooks = cache.map(async (channel) => this.createWebhookInChannel(channel));
			return {
				guild,
				webhooks: await Promise.all(webhooks)
			};
		});
	}

	public async createWebhookInChannel(channel: GuildBasedChannel) {
		const { logger } = container;
		const { user } = container.client;

		if (!user) {
			throw new Error('Cannot create webhook. The attached user on the client was null.');
		}
		if (this.channelIsWebhookChannel(channel) && this.clientUserHasWebhookPermission(channel, user)) {
			try {
				const res = await channel.createWebhook({
					name: Math.random().toString()
				});
				return res;
			} catch (err) {
				logger.error(err);
				throw new Error('Failed to create webhook.', { cause: err });
			}
		}
		throw new Error('Invalid channel type was passed as argument for creating a webhook.');
	}

	public clientUserHasWebhookPermission(channel: WebhookChannel, clientUser: ClientUser) {
		return channel.permissionsFor(clientUser)?.has('ManageWebhooks') || false;
	}

	public channelIsWebhookChannel(channel: GuildBasedChannel): channel is WebhookChannel {
		if (channel.isTextBased() && !channel.isThread()) {
			return true;
		}

		return false;
	}
}
