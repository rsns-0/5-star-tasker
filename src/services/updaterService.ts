import { isTextBasedChannel } from "@sapphire/discord.js-utilities"
import { container } from "@sapphire/framework"
import { mapValues, pipe } from "remeda"
import { AsyncReturnType } from "type-fest"

export class UpdaterService {
	async updateDb() {
		container.dbLogger.info("Updating database...")
		const guilds = container.guildService.getGuilds()
		const channels = this.getChannels(guilds)

		// upsert implementations are dependent on topological order
		const members = await this.getMembers(guilds)
		const updatedMembers = await this.updateMembers(members)
		const updatedGuilds = await this.updateGuilds(guilds)
		const updatedChannels = await this.updateChannels(channels)
		const updatedGuildsToMembers = await this.updateGuildsToMembers(members)
		const createdWebhooks = await this.createWebhooksIfNotExists()
		const ownedWebhooks = await this.getOwnedWebhooks()
		const updatedWebhooks = await this.updateWebhooks(ownedWebhooks)
		const deletedWebhooks = await this.clearWebhooks(ownedWebhooks)

		const results = {
			members,
			guilds: guilds.toJSON(),
			channels: channels.toJSON(),
			ownedWebhooks,
			updatedMembers,
			updatedChannels,
			updatedGuilds,
			updatedGuildsToMembers,
			createdWebhooks,
			updatedWebhooks,
			deletedWebhooks,
		}

		pipe(
			results,
			mapValues((s) => s.length),
			container.dbLogger.info
		)
		container.dbLogger.info("Finished updating database.")

		return results
	}

	private async getMembers(guilds: ReturnType<typeof container.guildService.getGuilds>) {
		const guildMemberPromises = guilds.map((guild) => guild.members.fetch())
		return Promise.all(guildMemberPromises).then((s) =>
			s.flatMap((guild) => [...guild.values()])
		)
	}

	private async updateGuildsToMembers(members: AsyncReturnType<typeof this.getMembers>) {
		return container.prisma.discord_user.connectManyToGuilds(members)
	}

	private async updateMembers(members: AsyncReturnType<typeof this.getMembers>) {
		return container.prisma.discord_user.upsertMany(members)
	}

	private getChannels(guilds: ReturnType<typeof container.guildService.getGuilds>) {
		return guilds.flatMap((guild) => guild.channels.cache.filter(isTextBasedChannel))
	}

	private async updateChannels(channels: ReturnType<typeof this.getChannels>) {
		return container.prisma.discord_channels.unsafeUpsertMany(channels.toJSON())
	}

	private async updateGuilds(guilds: ReturnType<typeof container.guildService.getGuilds>) {
		return container.prisma.discord_guilds.unsafeUpsertMany(guilds.toJSON())
	}

	private async clearWebhooks(webhooks: AsyncReturnType<typeof this.getOwnedWebhooks>) {
		return await container.prisma.webhooks.deleteWebhooksExcept(webhooks.map((s) => s.id))
	}

	private async getOwnedWebhooks() {
		return await container.webhookService.getAllOwnedWebhooks().then((s) => s.toJSON())
	}

	private async updateWebhooks(webhooks: AsyncReturnType<typeof this.getOwnedWebhooks>) {
		return await container.prisma.webhooks.upsertMany(webhooks)
	}

	private async createWebhooksIfNotExists() {
		return await container.webhookService.createWebhooksInAllGuildsIfNotExists()
	}
}
