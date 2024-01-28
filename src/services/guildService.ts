import { container } from "@sapphire/framework";
import { Channel } from "discord.js"

export class GuildService {
	getGuildById(id: string) {
		return container.client.guilds.cache.get(id)
	}

	getGuilds() {
		return container.client.guilds.cache
	}

	findChannelInGuilds(channelId: string) {
		const guilds = this.getGuilds().filter((guild) => {
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
