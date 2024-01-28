import { container } from "@sapphire/framework"
import { ReminderUserMessage } from "../models/reminders/reminderMessage"
import { retry } from "utils/utils"

export class UserService {
	async sendReminder(reminder: ReminderUserMessage) {
		container.dbLogger.info({
			message: "Sending reminder",
			reminder,
		})
		const task = async () => {
			const webhookClient = await container.client.fetchWebhook(reminder.webhook_id)
			return webhookClient.send(reminder.textMessage)
		}

		return await retry({
			fn: task,
			onError: (e) => container.dbLogger.error(e),
			timeout: 1000 * 5,
		})
			.catch((e) => e as Error)
			.then((res) => {
				if (res instanceof Error) {
					container.dbLogger.error(res)
					return {
						...reminder,
						state: "failed" as const,
					}
				}
				return {
					...reminder,
					state: "success" as const,
				}
			})
	}
}
