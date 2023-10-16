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
				async register(channel: GuildBasedChannel) {
					return prisma.discord_channels.upsert({
						where: {
							id: channel.id,
						},
						create: createDiscordChannelArg(channel),
						update: {
							name: channel.name,
							discord_guilds: {
								connectOrCreate: {
									where: {
										id: channel.guild.id,
									},
									create: createDiscordChannelArg(channel),
								},
							},
						},
					})
				},

				unsafeRegister(channel: GuildBasedChannel) {
					return prisma.discord_channels.upsert({
						where: {
							id: channel.id,
						},
						select: {
							id: true,
						},
						create: createDiscordChannelArg(channel),
						update: {
							name: channel.name,
							discord_guilds: {
								connect: {
									id: channel.guild.id,
								},
							},
						},
					})
				},

				upsertFromDiscord(channel: GuildBasedChannel) {
					return prisma.discord_channels.upsert({
						select: {
							id: true,
						},
						where: {
							id: channel.id,
						},
						create: {
							id: channel.id,
							name: channel.name,
							discord_guilds: {
								connectOrCreate: {
									where: {
										id: channel.guild.id,
									},
									create: {
										id: channel.guild.id,
										name: channel.guild.name,
										owner_id: channel.guild.ownerId,
									},
								},
							},
						},

						update: {
							id: channel.id,
							name: channel.name,
							discord_guilds: {
								connectOrCreate: {
									where: {
										id: channel.guild.id,
									},
									create: {
										id: channel.guild.id,
										name: channel.guild.name,
										owner_id: channel.guild.ownerId,
									},
								},
							},
						},
					})
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
					const createArgs = await createGuild(guild)
					return prisma.discord_guilds.upsert({
						where: {
							id: guild.id,
						},
						create: createArgs,
						update: createArgs,
						select: {
							id: true,
						},
					})
				},

				async createRegisterGuildArgs(guild: Guild) {
					const createArgs = await createGuild(guild)
					return {
						where: {
							id: guild.id,
						},
						create: createArgs,
						update: createArgs,
					}
				},

				async getGuildsAndTextBasedChannelsOfUser(userId: string) {
					return await prisma.discord_guilds.findMany({
						where: {
							members: {
								some: {
									id: userId,
								},
							},
						},
						select: {
							discord_channels: {
								select: {
									id: true,
									name: true,
								},
							},
							id: true,
							name: true,
							_count: {
								select: {
									discord_channels: true,
								},
							},
						},
					})
				},
			},
		},
	})
})

async function createGuild(guild: Guild) {
	const channels = guild.channels.cache.map(createChannel)
	const owner = await guild.fetchOwner()

	const ownerInfo = {
		id: owner.id,
		username: owner.user.username,
	}

	return {
		id: guild.id,
		iconURL: guild.iconURL(),

		name: guild.name,
		discord_channels: {
			connectOrCreate: channels,
		},
		discord_user: {
			connectOrCreate: {
				where: {
					id: ownerInfo.id,
				},
				create: ownerInfo,
			},
		},
	}
}

function createChannel(channel: GuildBasedChannel) {
	const id = channel.id
	const res: Prisma.discord_channelsCreateOrConnectWithoutDiscord_guildsInput = {
		where: {
			id,
		},
		create: {
			id,
			name: channel.name,
		},
	}
	return res
}