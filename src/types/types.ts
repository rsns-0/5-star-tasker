import { User, TextBasedChannel, Guild } from "discord.js"
import { type DateTime } from "luxon"
import {
	CreateReminderDTOBuilder,
	CreateReminderDTOBuilderFactory,
} from "../models/reminders/create-reminder-dto"

export type SupportedDateTypes = Date | DateTime
/** Ex: 12/12/2021 12:01 AM */
export type USStringDateTime =
	`${number}${number}/${number}${number}/${number}${number}${number}${number} ${number}${number}:${number}${number} ${
		| "AM"
		| "PM"}`

export type CreateReminderDTOConstructor = {
	reminder_message: string
	time: Date

	channel: {
		id: string
		name: string
	}
	guild: {
		id: string
		name: string
	}
	user: {
		id: string
	}
	webhook: {
		id: string
		name: string
		created_at: Date
		token: string
		url: string
	}
}
export type CreateReminderArgsDiscord = {
	reminderMessage: string
	time: Date
	user: User
	channel: TextBasedChannel
	guild: Guild

	type?: "discord"
}
export type GeneralCreateReminderArgs = {
	reminder_message: string
	time: Date
	channelId: string
	userId: string
}

export type CreateReminderFactoryFn = (
	factory: CreateReminderDTOBuilderFactory
) => Promise<CreateReminderDTOBuilder>
