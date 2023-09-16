import { Channel, Collection, Guild, GuildBasedChannel } from "discord.js";

import { isGuildBasedChannel } from "@sapphire/discord.js-utilities";
import { container } from "@sapphire/framework";

export class ChannelService {
	async getChannelById(id: string) {
		return container.client.channels.cache.get(id);
	}

	async getChannelsInGuild(guild: Guild) {
		return guild.channels.cache;
	}

	async getChannels(channelFilter: (channel: Channel) => boolean) {
		return container.client.channels.cache.filter((channel) => {
			return channelFilter(channel);
		});
	}

	getGuildBasedChannels() {
		return container.client.channels.cache.filter(isGuildBasedChannel) as Collection<
			string,
			GuildBasedChannel
		>;
	}
}
