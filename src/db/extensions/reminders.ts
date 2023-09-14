import { Prisma, webhooks } from "@prisma/client"
import { Channel, User, time, userMention } from "discord.js"
import { WebhookService, assertWebhookChannel } from "../../services/webhookService"

import { container } from "@sapphire/framework"
import { Dayjs } from "dayjs"
import extension from "prisma-paginate"
import { logger } from "../../logger/logger"

/**
 * The above type represents the arguments required to create a reminder.
 *
 * @property {string} reminderMessage - A string representing the message or
 *   content of the reminder.
 * @property {Dayjs} time - The `time` property represents the date and time at
 *   which the reminder should be triggered. It is of type `Dayjs`, which is a
 *   popular JavaScript library for manipulating and formatting dates and
 *   times.
 * @property {User} user - The user property represents the user for whom the
 *   reminder is being created. It could be an object containing information
 *   about the user, such as their username, ID, or any other relevant details.
 * @property {Channel} channel - The `channel` property represents a guild-based
 *   channel in a messaging platform. It could be a text channel in a Discord
 *   server or a channel in any other messaging platform that supports guilds or
 *   groups.
 */
type CreateReminderArgs = {
	reminderMessage: string
	time: Dayjs
	user: User
	channel: Channel
}
const webhookService = new WebhookService()
export default Prisma.defineExtension((prisma) => {
	const gPrisma = prisma.$extends(extension)
	return prisma.$extends({
		name: "reminderExtension",
		model: {
			reminders: {
				/**
				 * The function creates a reminder by connecting or creating a
				 * user and channel in the database and saving the reminder
				 * message and time.
				 *
				 * @param {CreateReminderArgs} - - `reminderMessage`: The
				 *   message content of the reminder.
				 * @returns The result of the `prisma.reminders.create` method.
				 */
				async createReminder({ reminderMessage, time, user, channel }: CreateReminderArgs) {
					const userId = user.id
					const channelId = channel.id
					assertWebhookChannel(channel)

					const webhook =
						await webhookService.getOrCreateAnyOwnedWebhookInChannel(channel)

					return prisma.reminders.create({
						data: {
							reminder_message: reminderMessage,
							discord_user: {
								connectOrCreate: {
									where: {
										id: userId,
									},
									create: {
										id: userId,
										username: user.username,
									},
								},
							},
							time: time.toDate(),
							discord_channels: {
								connectOrCreate: {
									where: {
										id: channelId,
									},
									create: {
										id: channelId,
										name: resolveChannelName(channel),
									},
								},
							},
							webhook: {
								connectOrCreate: {
									where: {
										id: webhook.id,
									},
									create: {
										id: webhook.id,
										name: webhook.name,
										created_at: webhook.createdAt,
										token: webhook.token,
										url: webhook.url,
										discord_channel_id: channelId,
									},
								},
							},
						},
					})
				},
				/**
				 * Retrieves reminders of a specific user.
				 *
				 * @param user - The user object.
				 * @returns A promise that resolves to an array of reminders.
				 */
				async getAllRemindersOfUser(user: User) {
					logger.emit(
						"info",
						`Retrieving reminders for user:\nID: ${user.id}\nGlobal Name: ${user.globalName}`
					)
					return prisma.reminders.findMany({
						where: {
							discord_user: {
								id: user.id,
							},
						},
					})
				},

				async getUserRemindersPaginated(user: User) {
					return gPrisma.reminders.paginate({
						where: {
							discord_user: {
								id: user.id,
							},
						},
						limit: 10,
					})
				},
				/**
				 * Retrieves expired reminders from the database.
				 *
				 * @returns A promise that resolves to an array of expired
				 *   reminders.
				 */
				async getExpiredReminders() {
					type _hook = webhooks & { token: string }
					type _res = (typeof res)[0]
					type _reminderWithWebhookWithoutNullToken = _res & {
						webhook: _hook
					}
					const res = await prisma.reminders.findMany({
						where: {
							time: {
								lte: new Date(),
							},
							webhook: {
								token: {
									not: null,
								},
							},
						},
						include: {
							webhook: true,
						},
					})

					return res as _reminderWithWebhookWithoutNullToken[]
				},
				/**
				 * Deletes a reminder by its ID.
				 *
				 * @param id - The ID of the reminder to delete.
				 * @returns A promise that resolves to the deleted reminder.
				 */
				async deleteReminderById(id: number | bigint) {
					return prisma.reminders.delete({
						where: {
							id,
						},
					})
				},

				/**
				 * Retrieves expired reminders from the database and deletes
				 * them.
				 *
				 * @returns {Promise<Reminder[]>} A promise that resolves to an
				 *   array of expired reminders.
				 */
				async getExpiredRemindersAndDelete() {
					const res = await this.getExpiredReminders()

					if (!res.length) {
						return res
					}
					await prisma.reminders.deleteMany({
						where: {
							id: {
								in: res.map((reminder) => reminder.id),
							},
						},
					})
					return res
				},

				async sendDueReminders() {
					const reminders = await this.getExpiredRemindersAndDelete()
					if (!reminders.length) {
						return false
					}
					const promises = reminders.map(async (res) => {
						const webhookClient = await container.client.fetchWebhook(res.webhook.id)
						const message = `
						${userMention(res.user_id)}
						TIME: ${time(res.time)}
						REMINDER: ${res.reminder_message}
						`
						return webhookClient.send(message)
					})
					return await Promise.all(promises)
				},
			},
		},
	})
})

function resolveChannelName(channel: Channel): string {
	if (!("name" in channel) || !channel.name) {
		return ""
	}
	return channel.name
}
