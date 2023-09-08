import { Guild, GuildBasedChannel } from 'discord.js';

import { Prisma } from '@prisma/client';

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: 'channelGuildExtension',
		model: {
			discord_channels: {
				/**
				 * Registers a channel in the database.
				 * @param channel - The channel to register.
				 * @returns A promise that resolves to the registered channel.
				 */
				async registerChannel(channel: GuildBasedChannel) {
					const channelId = parseInt(channel.id);
					const guildId = parseInt(channel.guild.id);
					const ownerId = parseInt(channel.guild.ownerId);

					return await prisma.discord_channels.upsert({
						where: {
							id: channelId
						},
						create: {
							id: channelId,
							name: channel.name
						},
						update: {
							name: channel.name,
							discord_guilds: {
								connectOrCreate: {
									where: {
										id: guildId
									},
									create: {
										id: guildId,
										name: channel.guild.name,
										discord_user: {
											connectOrCreate: {
												where: {
													id: ownerId
												},
												create: {
													id: ownerId,
													username: (await channel.guild.fetchOwner()).user.username // if there are performance bottlenecks later remove
												}
											}
										}
									}
								}
							}
						}
					});
				}
			},
			discord_guilds: {
				/**
				 * Registers a guild in the database.
				 * @param guild The guild to register.
				 * @returns A promise that resolves to the registered guild.
				 */
				async registerGuild(guild: Guild) {
					const guildId = parseInt(guild.id);
					const ownerId = parseInt(guild.ownerId);
					const channels = guild.channels.cache.map((channel) => {
						const id = parseInt(channel.id);
						const res: Prisma.discord_channelsCreateOrConnectWithoutDiscord_guildsInput = {
							where: {
								id
							},
							create: {
								id,
								name: channel.name
							}
						};
						return res;
					});

					return await prisma.discord_guilds.upsert({
						where: {
							id: guildId
						},
						create: {
							id: guildId,
							name: guild.name,
							discord_channels: {
								connectOrCreate: channels
							},
							discord_user: {
								connectOrCreate: {
									where: {
										id: ownerId
									},
									create: {
										id: ownerId,
										username: (await guild.fetchOwner()).user.username // if there are performance bottlenecks later remove
									}
								}
							}
						},
						update: {
							name: guild.name
						}
					});
				}
			}
		}
	});
});
