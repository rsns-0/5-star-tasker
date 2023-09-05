import { GuildBasedChannel, User } from 'discord.js';

import { Dayjs } from 'dayjs';
import { Prisma } from '@prisma/client';

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: 'reminderExtension',
		model: {
			reminders: {
				async createReminder(reminderMessage: string, time: Dayjs, user: User, channel: GuildBasedChannel) {
					await prisma.reminders.create({
						data: {
							reminder: reminderMessage,
							discord_user: {
								connectOrCreate: {
									where: {
										id: parseInt(user.id)
									},
									create: {
										id: parseInt(user.id),
										username: user.username
									}
								}
							},
							time: time.unix(),
							discord_channels: {
								connectOrCreate: {
									where: {
										id: parseInt(channel.id)
									},
									create: {
										id: parseInt(channel.id),
										name: channel.name
									}
								}
							}
						}
					});
				},
				async createUser(user: User) {
					return await prisma.discord_user.create({
						data: {
							id: parseInt(user.id),
							username: user.username
						}
					});
				}
			}
		}
	});
});
