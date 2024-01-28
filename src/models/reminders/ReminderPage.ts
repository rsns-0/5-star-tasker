import { Prisma, reminders } from "@prisma/client"
import {
	AnyComponentBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	ModalBuilder,
} from "discord.js"
import { ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { ReminderComponentData, createReminderEmbedField } from "./reminderComponentData"

import * as R from "remeda"

import {
	PaginatedMessageActionButton,
	PaginatedMessageActionContext,
} from "@sapphire/discord.js-utilities"
import { createCustomIdString } from "../pagination/CustomId"

type RenameKeys<
	T extends Record<string, unknown>,
	T2 extends Partial<Record<keyof T, string>>,
> = Omit<T, keyof T2> & {
	[K in keyof T2 as K extends keyof T
		? T2[K] extends string
			? T2[K]
			: never
		: never]: K extends keyof T ? T[K] : never
}

export type ReminderData = Pick<reminders, "id" | "reminder_message" | "time">

export class ReminderPage {
	constructor(
		public data: ReminderComponentData[],
		public index: number
	) {}

	public getActions() {
		return this.data.map(({ button }) => button)
	}

	/**
	 * @param indexStart Number to start the index at. Changes what number is displayed in the
	 *   embed. Starting index is 1 by default.
	 * @returns
	 */
	public toEmbedBuilder() {
		return new EmbedBuilder({
			title: "Reminder List",
			description: "Edit your reminders.",
			fields: this.data.map(({ index, ...rest }) =>
				createReminderEmbedField({ ...rest, index })
			),
		})
	}
}

export function createPaginatedReminders(reminders: ReminderData[], { pageSize = 5 }) {
	return R.chunk(reminders, pageSize).map(
		(reminders, pageNumber) =>
			new ReminderPage(reminders.map(reminderToReminderComponentData), pageNumber)
	)
}

// index is the index of the reminder in relation to all the other reminders on the page
function reminderToReminderComponentData(
	{ id, reminder_message: message, time }: ReminderData,
	index: number
): ReminderComponentData {
	const adjustedIndex = index + 1
	return R.pipe(
		createReminderModal({
			id,
			message,
		}),
		(modal) => createReminderModalButton(adjustedIndex, modal),
		(button) => ({
			index: adjustedIndex,
			id,
			message,
			time,
			button,
		})
	)
}

function createReminderModalButton(
	index: number,
	modal: ModalBuilder,
	paginatedMessageActionButtonProps?: Partial<PaginatedMessageActionButton>
) {
	return {
		style: ButtonStyle.Primary,
		type: ComponentType.Button,
		label: `Option ${index}`,
		customId: `reminder-${modal.data.custom_id}`,
		...paginatedMessageActionButtonProps,
		run(context: PaginatedMessageActionContext) {
			context.interaction.showModal(modal)
			context.interaction.replied = true
			context.collector.stop("stopped")
			return this
		},
	} as const satisfies PaginatedMessageActionButton
}

type ReminderModalProps = RenameKeys<
	Omit<ReminderData, "time">,
	{
		reminder_message: "message"
	}
>

const reminderDateTime = new TextInputBuilder({
	custom_id: Prisma.RemindersScalarFieldEnum.time,
	label: "Time",
	style: TextInputStyle.Short,
	placeholder: 'Enter any date format. Send "0" (zero) to delete reminder',
})
function createSingleActionRow<T extends AnyComponentBuilder>(props: T) {
	return new ActionRowBuilder<T>({
		components: [props],
	})
}

const reminderDateTimeActionRow = createSingleActionRow(reminderDateTime)

function createReminderModal({ id, message }: ReminderModalProps) {
	return new ModalBuilder({
		custom_id: createCustomIdString({
			type: "reminder",
			reminderId: id.toString(),
		}),
		title: "Edit Reminder",
		components: [createReminderMessageActionRow(message), reminderDateTimeActionRow],
	})
}

function createReminderMessageActionRow(descriptionValue: string) {
	const reminderMessageInput = new TextInputBuilder({
		custom_id: "reminder_message",
		label: "Reminder Message",
		style: TextInputStyle.Short,
		value: descriptionValue,
	})

	return createSingleActionRow(reminderMessageInput)
}
