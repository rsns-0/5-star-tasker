import { Guild, GuildBasedChannel } from "discord.js"

import { Prisma } from "@prisma/client"
import { createDiscordChannelArg } from "../argUtils/discordChannels"
import { db2 } from "../kyselyInstance"

export default Prisma.defineExtension((db) => {
	return db.$extends({
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
					const channelArg = createDiscordChannelArg(channel)

					return db.discord_channels.upsert({
						where: {
							id: channel.id,
						},
						create: channelArg,
						update: {
							name: channel.name,
							discord_guilds: {
								connectOrCreate: {
									where: {
										id: channel.guild.id,
									},
									create: channelArg,
								},
							},
						},
					})
				},

				unsafeRegister(channel: GuildBasedChannel) {
					return db.discord_channels.upsert({
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

				unsafeUpsertMany(channels: GuildBasedChannel[]) {
					return db2
						.insertInto("discord_channels")
						.values(
							channels.map((s) => ({
								id: s.id,
								name: s.name,
								discord_guild_id: s.guildId,
							}))
						)
						.onConflict((s) =>
							s.column("id").doUpdateSet((s) => ({
								discord_guild_id: s.ref("excluded.discord_guild_id"),
								name: s.ref("excluded.name"),
							}))
						)
						.returning("id")
						.execute()
				},

				upsertFromDiscord(channel: GuildBasedChannel) {
					return db.discord_channels.upsert({
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
				async discordGuildToDbGuild(guild: Guild) {
					const channels = guild.channels.cache.map(
						channelTodiscord_channelsCreateOrConnectWithoutDiscord_guildsInput
					)
					const owner = await guild.fetchOwner()
					const ownerInfo = {
						id: owner.id,
						username: owner.user.username,
					} as const satisfies Prisma.discord_userCreateInput

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
					} as const satisfies Prisma.discord_guildsCreateInput
				},

				unsafeUpsertMany(guilds: Guild[]) {
					return db2
						.insertInto("discord_guilds")
						.values(
							guilds.map((s) => ({ id: s.id, name: s.name, owner_id: s.ownerId }))
						)
						.onConflict((s) =>
							s.column("id").doUpdateSet((s) => ({
								name: s.ref("excluded.name"),
								owner_id: s.ref("excluded.owner_id"),
							}))
						)
						.returning("id")
						.execute()
				},

				registerGuild(guild: Prisma.discord_guildsCreateInput) {
					return db.discord_guilds.upsert({
						where: {
							id: guild.id,
						},
						create: guild,
						update: guild,
						select: {
							id: true,
						},
					})
				},

				async getGuildsAndTextBasedChannelsOfUser(userId: string) {
					return await db.discord_guilds.findMany({
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

function channelTodiscord_channelsCreateOrConnectWithoutDiscord_guildsInput({
	id,
	name,
}: GuildBasedChannel) {
	const res: Prisma.discord_channelsCreateOrConnectWithoutDiscord_guildsInput = {
		where: {
			id,
		},
		create: {
			id,
			name,
		},
	}
	return res
}
