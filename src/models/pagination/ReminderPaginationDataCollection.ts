import {
	PaginatedMessageAction,
	PaginatedMessageActionContext,
} from "@sapphire/discord.js-utilities";
import { ButtonStyle, Collection, ComponentType, ModalBuilder } from "discord.js";
import { ReminderComponentData, ReminderPage } from "models/pagination/reminderComponentData";

import { reminders } from "@prisma/client";
import { paginateArrays } from "../../utils/paginateArrays";
import { CustomId } from "./CustomId";
import { createReminderRowComponent } from "./paginationRowData";

/**
 * This class paginates the reminder data and maps their index to data required for building the embeds and their page actions.
 *
 */
export class ReminderPages extends Collection<number, ReminderPage> {
	private constructor() {
		super();
	}

	/**
	 * Creates a paginated reminder collection from an array of reminders.
	 * @param reminders - The array of reminders.
	 * @param options - The options for pagination.
	 * @returns The paginated reminder collection.
	 */
	public static fromReminders(reminders: reminders[], { pageSize = 5 }) {
		const remindersPaginated = paginateArrays(reminders, pageSize);
		const reminderData = new this();
		remindersPaginated.forEach((reminders, pageIndex) => {
			reminderData.set(pageIndex, createReminderEmbedDataCollection(reminders));
		});
		return reminderData;
	}
}

/**
 * Creates a collection of ReminderPaginationData objects from an array of reminders.
 * @param reminders An array of reminders.
 * @returns A Collection of ReminderPaginationData objects.
 */
function createReminderEmbedDataCollection(reminders: reminders[]) {
	const collection = new ReminderPage();
	reminders.forEach((reminder, entryIndex) => {
		collection.set(reminder.id, convertReminder(reminder, entryIndex));
	});
	return collection;
}

/**
 * Converts a reminder object to a ReminderPaginationData object.
 * @param reminder - The reminder object to convert.
 * @param entryIndex - The index of the entry.
 * @returns The converted ReminderPaginationData object.
 */
function convertReminder(reminder: reminders, entryIndex: number): ReminderComponentData {
	const data: ReminderComponentData = new ReminderComponentData({
		id: reminder.id,
		message: reminder.reminder_message,
		time: reminder.time,
		button: createButton(entryIndex, reminder),
	});
	return data;
}

function createButton(entryIndex: number, reminder: reminders): PaginatedMessageAction {
	const row = createReminderRowComponent(reminder.reminder_message, "");
	return {
		style: ButtonStyle.Primary,
		type: ComponentType.Button,
		label: `Option ${entryIndex}`,
		customId: "@sapphire/paginated-messages.stop",
		run(context: PaginatedMessageActionContext) {
			const modal = new ModalBuilder()
				.setCustomId(
					new CustomId({
						type: "reminder",
						reminderId: reminder.id.toString(),
					}).toString()
				)
				.setTitle("Edit Reminder")
				.setComponents([row]);
			context.interaction.showModal(modal);
		},
	};
}
