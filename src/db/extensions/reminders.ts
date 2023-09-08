import { GuildBasedChannel, User } from 'discord.js';

import { Dayjs } from 'dayjs';
import { Prisma } from '@prisma/client';

/**
 * The above type represents the arguments required to create a reminder.
 * @property {string} reminderMessage - A string representing the message or content of the reminder.
 * @property {Dayjs} time - The `time` property represents the date and time at which the reminder
 * should be triggered. It is of type `Dayjs`, which is a popular JavaScript library for manipulating
 * and formatting dates and times.
 * @property {User} user - The user property represents the user for whom the reminder is being
 * created. It could be an object containing information about the user, such as their username, ID, or
 * any other relevant details.
 * @property {GuildBasedChannel} channel - The `channel` property represents a guild-based channel in a
 * messaging platform. It could be a text channel in a Discord server or a channel in any other
 * messaging platform that supports guilds or groups.
 */
type CreateReminderArgs = {
	reminderMessage: string;
	time: Dayjs;
	user: User;
	channel: GuildBasedChannel;
};

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: 'reminderExtension',
		model: {
			reminders: {
				/**
				 * The function creates a reminder by connecting or creating a user and channel in the database and
				 * saving the reminder message and time.
				 * @param {CreateReminderArgs}  - - `reminderMessage`: The message content of the reminder.
				 * @returns the result of the `prisma.reminders.create` method.
				 */
				async createReminder({ reminderMessage, time, user, channel }: CreateReminderArgs) {
					const userId = parseInt(user.id);
					const channelId = parseInt(channel.id);
					return await prisma.reminders.create({
						data: {
							reminder_message: reminderMessage,
							discord_user: {
								connectOrCreate: {
									where: {
										id: userId
									},
									create: {
										id: userId,
										username: user.username
									}
								}
							},
							time: time.unix(),
							discord_channels: {
								connectOrCreate: {
									where: {
										id: channelId
									},
									create: {
										id: channelId,
										name: channel.name
									}
								}
							}
						}
					});
				}
			}
		}
	});
});
