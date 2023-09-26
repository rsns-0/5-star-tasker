import { CreateReminderFactoryFn } from "./../../types/types"
import { Prisma, webhooks } from "@prisma/client"
import { Channel, User, time, userMention } from "discord.js"

import { container } from "@sapphire/framework"

import extension from "prisma-paginate"
import { logger } from "../../logger/logger"
import { CreateReminderDTOFactory } from "../../models/reminders/create-reminder-dto"

export default Prisma.defineExtension((prisma) => {
	const paginatePrisma = prisma.$extends(extension)
	return prisma.$extends({
		name: "reminderExtension",
		model: {
			reminders: {
				async createReminder(props: CreateReminderFactoryFn) {
					const dto = await props(new CreateReminderDTOFactory())

					return prisma.reminders.create(dto.generateCreateReminderInput())
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
					return paginatePrisma.reminders.paginate({
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
				 * @returns A promise that resolves to an array of expired reminders.
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
				 * Retrieves expired reminders from the database and deletes them.
				 *
				 * @returns {Promise<Reminder[]>} A promise that resolves to an array of expired
				 *   reminders.
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
						${userMention(res.user_id)}\nTIME: ${time(res.time)}\nREMINDER: ${res.reminder_message}
						`
						return webhookClient.send(message)
					})
					return await Promise.all(promises)
				},
			},
		},
	})
})

export function resolveChannelName(channel: Channel): string {
	if (!("name" in channel) || !channel.name) {
		return ""
	}
	return channel.name
}
