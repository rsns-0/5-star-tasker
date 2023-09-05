import { ClientUser, Guild, GuildBasedChannel } from 'discord.js';

import { TransactionException } from '../errors/transactionException';
import { WebhookChannel } from 'types/channelTypes';
import { container } from '@sapphire/pieces';

type CreateWebhookInChannelOptions = {
	name?: string;
	avatar?: string;
	reason?: string;
};
export default class WebhookService {
	public async createWebHooksInAllChannelsOfGuild(guild: Guild) {
		if (!guild) {
			return new TransactionException({
				message:
					"The guild in question wasn't located on the container cache, either because of cache clearing or because the bot has not visited the guild in question yet."
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

	public async createWebhookInChannel(channel: GuildBasedChannel, { name = 'Webhook', avatar, reason }: CreateWebhookInChannelOptions = {}) {
		const { logger } = container;
		const { user } = container.client;

		if (!user) {
			throw new Error('Cannot create webhook. The attached user on the client was null. Was this called on a non user interaction event?');
		}
		if (isWebhookChannel(channel) && clientUserHasWebhookPermission(channel, user)) {
			try {
				const res = await channel.createWebhook({
					name,
					avatar,
					reason
				});
				return res;
			} catch (err) {
				logger.error(err);
				throw new Error('Failed to create webhook at network layer with discord. Unknown what happened.', { cause: err });
			}
		}
		throw new Error(
			'Invalid channel type was passed as argument for creating a webhook. Were you passing in an any type or ignored the type check?'
		);
	}
}

function clientUserHasWebhookPermission(channel: WebhookChannel, clientUser: ClientUser) {
	return channel.permissionsFor(clientUser)?.has('ManageWebhooks') || false;
}

function isWebhookChannel(channel: GuildBasedChannel): channel is WebhookChannel {
	if (channel.isTextBased() && !channel.isThread()) {
		return true;
	}

	return false;
}
