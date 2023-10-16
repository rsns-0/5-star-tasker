import { Channel, Collection, type Guild, type Webhook } from "discord.js";

import { container } from "@sapphire/pieces";
import { type WebhookChannel } from "types/channelTypes";
import { OwnedWebhook } from "../types/webhookTypes";
import { assertExists } from "../utils/assertExists";

function defaultWebhookName() {
	return `5StarWebhook-${Math.random() * 100}`;
}
/**
 * The `CreateWebhookInChannelOptions` type is used to specify optional
 * parameters when creating a webhook in a channel.
 *
 * @property {string} name - The name property is an optional string that
 *   represents the name of the webhook. If provided, it will be used as the
 *   display name for the webhook in the channel.
 * @property {string} avatar - The `avatar` property is an optional string that
 *   represents the URL of the avatar image for the webhook.
 * @property {string} reason - The reason for creating the webhook in the
 *   channel. This can be used to provide a justification or explanation for
 *   creating the webhook.
 */
type CreateWebhookInChannelOptions = {
	name?: string;
	avatar?: string;
	reason?: string;
};

type DeleteWebhooksInAllChannelsOfGuildMeetingCriteriaOptions = {
	webhookFilter: ((webhook: Webhook) => boolean) | true;
	channelFilter: ((channel: WebhookChannel) => boolean) | true;
};
/* The WebhookService class provides methods to create and delete webhooks in all channels of a guild. */
export class WebhookService {
	/**
	 * This function creates webhooks in all channels of a guild.
	 *
	 * @param {Guild} guild - The guild parameter is an object representing a
	 *   Discord guild (server). It contains information about the guild, such
	 *   as its ID, name, members, channels, etc.
	 * @returns An array of objects. Each object contains the guild and an array
	 *   of webhooks created in all channels of that guild.
	 */
	public async createWebHooksInAllChannelsOfGuild(guild: Guild) {
		const guildCache = container.client.guilds.cache;
		return guildCache.map(async ({ channels: { cache: channelCache } }) => {
			const createdWebhooks = channelCache
				.filter(isWebhookChannel)
				.map(async (channel) => this.createWebhookInChannel(channel));
			return {
				guild,
				webhooks: await Promise.all(createdWebhooks),
			};
		});
	}

	/**
	 * Creates a webhook in the specified channel.
	 *
	 * @param channel - The channel in which the webhook will be created.
	 * @param options - Optional parameters for creating the webhook.
	 * @returns A Promise that resolves to the created webhook.
	 * @throws If the webhook creation fails at the network layer with Discord.
	 */
	public async createWebhookInChannel(
		channel: WebhookChannel,
		{ name = defaultWebhookName(), avatar, reason }: CreateWebhookInChannelOptions = {}
	) {
		try {
			const res = await channel.createWebhook({
				name,
				avatar,
				reason,
			});
			assertOwnedWebhook(res);
			return res;
		} catch (err) {
			container.dbLogger.emit("error", err);
			throw new Error(
				`Failed to create webhook at network layer with discord. Unknown what happened. Occurred at channel:${channel.toJSON()}}` as const,
				{ cause: err }
			);
		}
	}

	/**
	 * Deletes webhooks in a channel based on the provided filter function.
	 *
	 * @param channel - The channel from which to delete the webhooks.
	 * @param options - Additional options for filtering the webhooks.
	 * @param options.filter - A function used to filter the webhooks.
	 * @throws If there is an error deleting the webhooks.
	 */
	public async deleteWebhooksInChannel(
		channel: WebhookChannel,
		filter: (webhook: Webhook) => boolean
	) {
		try {
			const webhooks = await channel.fetchWebhooks();

			const filteredWebhooks = webhooks.filter(isOwnedWebhook).filter(filter);
			if (!filteredWebhooks.size) {
				container.dbLogger.emit(
					"warn",
					`No owned webhooks found to delete. Channel info: ${channel.toJSON()}`
				);
				return;
			}
			await Promise.all(filteredWebhooks.map((webhook) => webhook.delete()));
		} catch (err) {
			container.dbLogger.emit("error", err);
			throw new Error(
				"Failed to delete webhook at network layer with discord. Unknown what happened.",
				{
					cause: err,
				}
			);
		}
	}

	/**
	 * Deletes webhooks in all channels of a guild based on meeting criteria.
	 *
	 * @param guild - The guild object.
	 * @param options - The options for meeting criteria.
	 */
	public async deleteWebhooksInAllChannelsOfGuildMeetingCriteria(
		guild: Guild,
		{ webhookFilter, channelFilter }: DeleteWebhooksInAllChannelsOfGuildMeetingCriteriaOptions
	) {
		const webhookData = this.getWebhooksInAllChannelsOfGuild(guild);
		const dataFilteredByChannel =
			channelFilter === true
				? webhookData
				: webhookData.filter(async (data) => {
						const { channel } = await data;
						return channelFilter(channel);
				  });

		const webhookFilter1 = webhookFilter === true ? () => true : webhookFilter;
		const res = dataFilteredByChannel.map(async (data) => {
			const { channel } = await data;
			return this.deleteWebhooksInChannel(channel, webhookFilter1);
		});
		await Promise.all(res);
	}

	/**
	 * Retrieves the webhooks in the specified channel.
	 *
	 * @param channel - The channel to fetch webhooks from.
	 * @returns A promise that resolves to the fetched webhooks.
	 */
	public async getWebhooksInChannel(channel: WebhookChannel) {
		return channel.fetchWebhooks();
	}

	/**
	 * Retrieves or creates an owned webhook in the specified channel. If there
	 * are any owned webhooks in the channel, the first one is returned.
	 * Otherwise, a new webhook is created in the channel and returned.
	 *
	 * @param channel The channel to retrieve or create the webhook in.
	 * @returns The owned webhook in the channel, or a newly created one.
	 */
	public async getOrCreateAnyOwnedWebhookInChannel(channel: WebhookChannel) {
		const webhooks = await this.getWebhooksInChannel(channel);
		const ownedWebhooks = webhooks.filter(isOwnedWebhook);
		if (ownedWebhooks.size) {
			const res = ownedWebhooks.first();
			assertExists(res);
			return res;
		}

		return this.createWebhookInChannel(channel);
	}

	/**
	 * Retrieves all webhooks from all guilds.
	 *
	 * @returns A Promise that resolves to an array of webhooks.
	 */
	public async getAllWebhooksOfAllGuilds() {
		const guilds = container.client.guilds.cache;
		const webhooks: Promise<Collection<string, Webhook>>[] = [];
		for (const guild of guilds.values()) {
			const channels = guild.channels.cache.filter(isWebhookChannel);
			for (const channel of channels.values()) {
				const res = this.getWebhooksInChannel(channel);
				webhooks.push(res);
			}
		}
		const res = await Promise.all(webhooks);
		const reduced = res.reduce((acc, curr) => {
			return acc.concat(curr);
		});
		return reduced;
	}

	/**
	 * Retrieves all owned webhooks.
	 *
	 * @returns An array of owned webhooks.
	 */
	public async getAllOwnedWebhooks() {
		const webhooks = await this.getAllWebhooksOfAllGuilds();
		const ownedWebhooks = webhooks.filter(isOwnedWebhook);
		return ownedWebhooks;
	}

	/**
	 * Retrieves a webhook by its ID.
	 *
	 * @param id The ID of the webhook to retrieve.
	 * @returns The retrieved webhook.
	 */
	public async getWebhookById(id: string) {
		const webhook = await container.client.fetchWebhook(id);
		return webhook;
	}

	/**
	 * Deletes a webhook by its ID.
	 *
	 * @param id The ID of the webhook to delete.
	 */
	public async deleteWebhookById(id: string) {
		const webhook = await container.client.fetchWebhook(id);
		webhook.delete();
	}

	/**
	 * Retrieves all webhooks in all channels of a guild.
	 *
	 * @param guild The guild object.
	 * @returns A map of channels and their corresponding webhooks.
	 */
	public getWebhooksInAllChannelsOfGuild(guild: Guild) {
		const { cache } = guild.channels;
		const webhookChannels = cache.filter(isWebhookChannel);
		return webhookChannels.mapValues(async (channel) => {
			return {
				channel,
				webhooks: await this.getWebhooksInChannel(channel),
			};
		});
	}
}

/**
 * Filters a webhook to check if it is owned. Any webhooks that don't have a
 * token are not owned by the bot.
 *
 * @param webhook - The webhook to filter.
 * @returns True if the webhook is owned, false otherwise.
 */
export function isOwnedWebhook(webhook: Webhook): webhook is OwnedWebhook {
	return webhook.token !== null;
}

/**
 * Asserts that a webhook is owned by the bot. Throws an error if the webhook is
 * not owned.
 *
 * @param webhook - The webhook to assert ownership for.
 * @throws Error - If the webhook is not owned by the bot.
 */
export function assertOwnedWebhook(webhook: Webhook): asserts webhook is OwnedWebhook {
	if (!isOwnedWebhook(webhook)) {
		throw new Error(
			`Webhook ${webhook.name} is not owned by the bot. Webhook info: ${JSON.stringify(
				webhook
			)}`
		);
	}
}

/**
 * Checks if a channel is a webhook channel.
 *
 * @param channel - The channel to check.
 * @returns True if the channel is a webhook channel, false otherwise.
 */
export function isWebhookChannel(channel: Channel): channel is WebhookChannel {
	if (channel.isTextBased() && !channel.isThread()) {
		return true;
	}

	return false;
}

/**
 * Asserts that the given channel is a webhook channel. If the channel is not a
 * webhook channel, an error is thrown.
 *
 * @param channel The channel to assert as a webhook channel.
 * @throws {Error} If the channel is not a webhook channel.
 */
export function assertWebhookChannel(channel: Channel): asserts channel is WebhookChannel {
	if (!isWebhookChannel(channel)) {
		throw new Error(
			`Channel ${channel.id} is not a webhook channel. Channel info: ${channel.toJSON()}`
		);
	}
}

export function createWebhookEntry(webhook: OwnedWebhook) {
	return {
		id: webhook.id,
		name: webhook.name,
		created_at: webhook.createdAt,
		token: webhook.token,
		url: webhook.url,
	}
}