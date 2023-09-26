import { container } from "@sapphire/framework";
import { Channel, Guild } from "discord.js"

export class GuildService {
	async getBotGuildById(id: string) {
		return container.client.guilds.cache.get(id)
	}

	async getBotGuilds(filter: (guild: Guild) => boolean) {
		return container.client.guilds.cache.filter(filter)
	}

	async findChannelInGuilds(channelId: string): Promise<Channel | null> {
		const guilds = await this.getBotGuilds((guild) => {
			const channel = guild.channels.cache.get(channelId)
			return channel !== undefined
		})
		let channel: Channel | null = null
		for (const guild of guilds.values()) {
			const maybeChannel = guild.channels.cache.get(channelId)
			if (maybeChannel !== undefined) {
				channel = maybeChannel
				break
			}
		}
		return channel
	}
}
