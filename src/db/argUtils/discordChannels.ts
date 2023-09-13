import { GuildBasedChannel } from "discord.js";

export function createDiscordChannelArg(channel: GuildBasedChannel) {
	const channelId = channel.id;
	const guildId = channel.id;
	const ownerId = channel.id;
	const res = {
		id: channelId,
		name: channel.name,
		discord_guilds: {
			connectOrCreate: {
				where: {
					id: guildId,
				},
				create: {
					id: guildId,
					name: channel.guild.name,
					discord_user: {
						connectOrCreate: {
							where: {
								id: ownerId,
							},
							create: {
								id: ownerId,
							},
						},
					},
				},
			},
		},
	};
	return res;
}
