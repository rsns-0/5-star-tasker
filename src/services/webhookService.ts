import { APIInteractionDataResolvedChannel, Channel, type Guild, type Webhook } from "discord.js"
import * as R from "remeda"
import { container } from "@sapphire/pieces"
import { type WebhookChannel } from "types/channelTypes"
import { OwnedWebhook } from "../types/webhookTypes"
import { mergeMap, andThen, thenMergeMap } from "../utils/utils"

function defaultWebhookName() {
	return `5StarWebhook-${new Date().getTime()}`
}

export class WebhookService {
	public async createWebhooksForGuildChannelsIfNotExists(
		guild: Guild
	): Promise<(Webhook & { token: string })[]> {
		return R.pipe(
			guild.channels.cache.toJSON(),
			R.filter(isWebhookChannel),
			mergeMap(async (channel) => {
				return {
					channel,
					webhooks: await channel.fetchWebhooks().then((s) => s.filter(isOwnedWebhook)),
				}
			}),
			andThen(R.filter(({ webhooks }) => webhooks.size === 0)),
			thenMergeMap(({ channel }) => this.createWebhookInChannel(channel))
		)
	}

	public async createWebhooksInAllGuildsIfNotExists() {
		const results = container.client.guilds.cache.map((guild) =>
			this.createWebhooksForGuildChannelsIfNotExists(guild)
		)
		return await Promise.all(results).then((s) => s.flat())
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
		{
			name = defaultWebhookName(),
			avatar,
			reason,
		}: Partial<Parameters<typeof channel.createWebhook>[0]> = {}
	) {
		const webhook = await channel.createWebhook({
			name,
			avatar,
			reason,
		})
		assertOwnedWebhook(webhook)
		return webhook
	}

	/**
	 * Retrieves or creates an owned webhook in the specified channel. If there are any owned
	 * webhooks in the channel, the first one is returned. Otherwise, a new webhook is created in
	 * the channel and returned.
	 *
	 * @param channel The channel to retrieve or create the webhook in.
	 * @returns The owned webhook in the channel, or a newly created one.
	 */
	public async getOrCreateAnyOwnedWebhookInChannel(channel: WebhookChannel) {
		container.dbLogger.info(`Fetching webhooks for channel ${channel.id}...`)
		const webhooks = await channel.fetchWebhooks()
		const maybeWebhook = webhooks.filter(isOwnedWebhook).first()
		if (!maybeWebhook) {
			container.dbLogger.info(`No webhooks found for channel ${channel.id}. Creating one...`)
			return this.createWebhookInChannel(channel)
		}
		container.dbLogger.info(`Found webhook ${maybeWebhook.id} for channel ${channel.id}.`)
		return maybeWebhook
	}

	/**
	 * Retrieves all webhooks from all guilds.
	 *
	 * @returns A Promise that resolves to an array of webhooks.
	 */
	public async getAllWebhooksOfAllGuilds() {
		const promises = container.client.guilds.cache
			.flatMap((guild) => guild.channels.cache.filter(isWebhookChannel))
			.map((channel) => channel.fetchWebhooks())
		return Promise.all(promises).then((webhooks) =>
			webhooks.reduce((acc, curr) => acc.concat(curr))
		)
	}

	/**
	 * Retrieves all owned webhooks.
	 *
	 * @returns An array of owned webhooks.
	 */
	public async getAllOwnedWebhooks() {
		const webhooks = await this.getAllWebhooksOfAllGuilds()
		return webhooks.filter(isOwnedWebhook)
	}

	/**
	 * Deletes a webhook by its ID.
	 *
	 * @param id The ID of the webhook to delete.
	 */
	public async deleteWebhookById(id: string) {
		return container.client.fetchWebhook(id).then((s) => s.delete())
	}

	public getWebhooks({
		guild,
		channelFilter = () => true,
		webhookFilter = () => true,
	}: {
		guild: Guild
		channelFilter?: (channel: WebhookChannel) => boolean
		webhookFilter?: (webhook: Webhook) => boolean
	}) {
		const promises = guild.channels.cache
			.filter(isWebhookChannel)
			.filter(channelFilter)
			.map((channel) =>
				channel.fetchWebhooks().then((webhooks) => webhooks.filter(webhookFilter).toJSON())
			)

		return Promise.all(promises).then((s) => s.flat())
	}
}

/**
 * Filters a webhook to check if it is owned. Any webhooks that don't have a token are not owned by
 * the bot.
 *
 * @param webhook - The webhook to filter.
 * @returns True if the webhook is owned, false otherwise.
 */
export function isOwnedWebhook(webhook: Webhook): webhook is OwnedWebhook {
	return webhook.token !== null
}

/**
 * Asserts that a webhook is owned by the bot. Throws an error if the webhook is not owned.
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
		)
	}
}

type UnknownChannel = APIInteractionDataResolvedChannel | null | Channel

/**
 * Checks if a channel is a webhook channel.
 *
 * @param channel - The channel to check.
 * @returns True if the channel is a webhook channel, false otherwise.
 */
export function isWebhookChannel(channel: UnknownChannel): channel is WebhookChannel {
	return !!channel && "isTextBased" in channel && channel.isTextBased() && !channel.isThread()
}

/**
 * Asserts that the given channel is a webhook channel. If the channel is not a webhook channel, an
 * error is thrown.
 *
 * @param channel The channel to assert as a webhook channel.
 * @throws {Error} If the channel is not a webhook channel.
 */
export function assertWebhookChannel(channel: UnknownChannel): asserts channel is WebhookChannel {
	if (!isWebhookChannel(channel)) {
		throw new Error(`Channel is not a webhook channel: ${JSON.stringify(channel)}`)
	}
}

export function createWebhookEntry(webhook: OwnedWebhook) {
	return {
		...R.pick(webhook, ["id", "name", "token", "url"]),
		created_at: webhook.createdAt,
	}
}
