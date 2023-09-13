import { ButtonStyle, Collection, ComponentType, EmbedField, ModalBuilder, time } from "discord.js";
import { FromRemindersOptions, ReminderComponentData } from "types/paginationTypes";

import { reminders } from "@prisma/client";
import { PaginatedMessageActionContext } from "@sapphire/discord.js-utilities";
import { paginateArrays } from "../../utils/paginateArrays";
import { CustomId } from "./CustomId";
import { createReminderRowComponent } from "./paginationRowData";

class ReminderPaginationDataCollection extends Collection<bigint, ReminderComponentData> {}

/**
 * This class paginates the reminder data and maps their index to data required for building the embeds and their page actions.
 *
 */
export class ReminderDataPaginationCollection extends Collection<
	number,
	ReminderPaginationDataCollection
> {
	private constructor() {
		super();
	}

	/**
	 * Creates a paginated reminder collection from an array of reminders.
	 * @param reminders - The array of reminders.
	 * @param options - The options for pagination.
	 * @returns The paginated reminder collection.
	 */
	public static fromReminders(reminders: reminders[], { pageSize = 5 }: FromRemindersOptions) {
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
	const collection = new ReminderPaginationDataCollection();
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
	const row = createReminderRowComponent(reminder.reminder_message, "");
	const data: ReminderComponentData = {
		id: reminder.id,
		message: reminder.reminder_message,
		time: reminder.time,
		button: {
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
		},
	};
	return data;
}
function create(data: ReminderComponentData, entryIndex: number) {
	const embedField: EmbedField = {
		name: `Entry ${entryIndex + 1}`,
		value: `Time: ${time(data.time)}\nMessage: ${data.message}`,
		inline: false,
	};
	return embedField;
}
