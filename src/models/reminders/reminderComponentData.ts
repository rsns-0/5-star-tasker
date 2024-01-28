import { PaginatedMessageAction } from "@sapphire/discord.js-utilities"
import { EmbedField, time as toTime } from "discord.js"

export interface ReminderComponentData {
	index: number
	id: number
	message: string
	time: Date
	button: PaginatedMessageAction
}

export interface ReminderEmbedFieldProps {
	index: number
	id: number
	message: string
	time: Date
}

export function createReminderEmbedField({
	id,
	index,
	message,
	time: timeData,
}: ReminderEmbedFieldProps) {
	return {
		name: `Entry ${index}: ID ${id}`,
		value: `Time: ${toTime(timeData)}\nMessage: ${message}`,
		inline: false,
	} as const satisfies EmbedField
}
