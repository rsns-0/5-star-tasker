import { reminders } from "@prisma/client"
import { time, userMention } from "discord.js"

export type ReminderMessage = Pick<
	reminders,
	"time" | "reminder_message" | "id" | "user_id" | "webhook_id"
>

export type ReminderUserMessage = ReturnType<typeof reminderToReminderUserMessage>

function createReminderMessage({
	reminder_message,
	user_id,
	time: reminderTime,
}: Omit<ReminderMessage, "id">) {
	return `${userMention(user_id)}\nTIME: ${time(
		reminderTime
	)}\nREMINDER: ${reminder_message}` as const
}

export function reminderToReminderUserMessage(reminder: ReminderMessage) {
	return {
		...reminder,
		textMessage: createReminderMessage(reminder),
	}
}
