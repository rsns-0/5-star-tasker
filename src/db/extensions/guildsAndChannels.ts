import { Guild, GuildBasedChannel } from "discord.js";

import { Prisma } from "@prisma/client";
import { createDiscordChannelArg } from "../argUtils/discordChannels";

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: "channelGuildExtension",
		model: {
			discord_channels: {
				/**
				 * Registers a channel in the database.
				 *
				 * @param channel - The channel to register.
				 * @returns A promise that resolves to the registered channel.
				 */
				async registerChannel(channel: GuildBasedChannel) {
					const channelId = channel.id;
					const guildId = channel.id;

					return await prisma.discord_channels.upsert({
						where: {
							id: channelId,
						},
						create: createDiscordChannelArg(channel),
						update: {
							name: channel.name,
							discord_guilds: {
								connectOrCreate: {
									where: {
										id: guildId,
									},
									create: createDiscordChannelArg(channel),
								},
							},
						},
					});
				},
			},
			discord_guilds: {
				/**
				 * Registers a guild in the database.
				 *
				 * @param guild The guild to register.
				 * @returns A promise that resolves to the registered guild.
				 */
				async registerGuild(guild: Guild) {
					const guildId = guild.id;
					const ownerId = guild.ownerId;
					const channels = guild.channels.cache.map((channel) => {
						const id = channel.id;
						const res: Prisma.discord_channelsCreateOrConnectWithoutDiscord_guildsInput =
							{
								where: {
									id,
								},
								create: {
									id,
									name: channel.name,
								},
							};
						return res;
					});

					return await prisma.discord_guilds.upsert({
						where: {
							id: guildId,
						},
						create: {
							id: guildId,
							name: guild.name,
							discord_channels: {
								connectOrCreate: channels,
							},
							discord_user: {
								connectOrCreate: {
									where: {
										id: ownerId,
									},
									create: {
										id: ownerId,
										username: (await guild.fetchOwner()).user.username, // if there are performance bottlenecks later remove
									},
								},
							},
						},
						update: {
							name: guild.name,
							discord_channels: {
								connectOrCreate: channels,
							},
							discord_user: {
								connectOrCreate: {
									where: {
										id: ownerId,
									},
									create: {
										id: ownerId,
										username: (await guild.fetchOwner()).user.username, // if there are performance bottlenecks later remove
									},
								},
							},
						},
					});
				},
			},
		},
	});
});
