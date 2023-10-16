import { Channel, Collection, Guild, GuildBasedChannel } from "discord.js";

import { isGuildBasedChannel } from "@sapphire/discord.js-utilities";
import { container } from "@sapphire/framework";

export class ChannelService {
	getChannelById(id: string) {
		return container.client.channels.cache.get(id)
	}

	getChannelsInGuild(guild: Guild) {
		return guild.channels.cache
	}

	getChannels(channelFilter: (channel: Channel) => boolean) {
		return container.client.channels.cache.filter((channel) => {
			return channelFilter(channel)
		})
	}

	getGuildBasedChannels() {
		return container.client.channels.cache.filter(isGuildBasedChannel) as Collection<
			string,
			GuildBasedChannel
		>
	}

	getTextGuildBasedChannels() {
		return this.getGuildBasedChannels().filter((channel) => channel.isTextBased())
	}
}
