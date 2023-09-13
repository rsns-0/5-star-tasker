import { reminders } from "@prisma/client";
import {
	PaginatedMessageAction,
	PaginatedMessageActionContext,
} from "@sapphire/discord.js-utilities";
import { ButtonStyle, Collection, ComponentType, EmbedField, ModalBuilder } from "discord.js";
import { CustomId } from "./CustomId";
import { createReminderRowComponent } from "./paginationRowData";

/**
 * This class is a flattened data structure with all the data required to produce one embed entry and one associated page action.
 */
export class ReminderComponentData {
	public id: bigint;
	public message: string;
	public time: Date;
	public button: PaginatedMessageAction;

	constructor({
		id,
		message,
		time,
		button,
	}: {
		id: bigint;
		message: string;
		time: Date;
		button: PaginatedMessageAction;
	}) {
		this.id = id;
		this.message = message;
		this.time = time;
		this.button = button;
	}

	/**
	 *
	 * Retrieves the entries that are relevant for creating an embed, but leaves the original data types intact.
	 */
	public getFieldData() {
		const { id, message, time } = this;
		return {
			id,
			message,
			time,
		};
	}

	/**
	 * Converts the reminder component data into a pair of embed field and button.
	 * @param entryIndex - The index of the entry.
	 * @returns A tuple containing the embed field and button.
	 */
	public asPairOfEmbedAndButton(entryIndex: number) {
		const embedField = {
			name: `Entry ${entryIndex + 1}: ${this.id}`,
			value: `Time: ${this.time}\nMessage: ${this.message}`,
			inline: false,
		} as const satisfies EmbedField;

		return [embedField, this.button] as const;
	}
	/**
	 *
	 */
	public toEmbedField(entryIndex: number) {
		const embedField = {
			name: `Entry ${entryIndex + 1}: ${this.id}`,
			value: `Time: ${this.time}\nMessage: ${this.message}`,
			inline: false,
		} as const satisfies EmbedField;
		return embedField;
	}

	// will review later to see if this format is better
	// public convertReminderMessageToEmbedField(index: number) {
	// 	const messageField = {
	// 		name: "Reminder message",
	// 		value: this.message,
	// 		inline: false,
	// 	} as const satisfies EmbedField;
	// 	const timeField = {
	// 		name: "Reminder Time",
	// 		value: time(this.time),
	// 		inline: false,
	// 	} as const satisfies EmbedField;
	// 	return [messageField, timeField] as const;
	// }
}

/**
 * A collection of reminder component data. Maps reminder ID to the component data.
 */
export class ReminderPage extends Collection<bigint, ReminderComponentData> {
	/**
	 *
	 * Retrieves the button actions only.
	 */
	public getActions() {
		return this.mapValues((component) => {
			return component.button;
		});
	}

	public static fromReminders(reminders: reminders[]) {
		const collection = new ReminderPage();
		reminders.forEach((reminder, entryIndex) => {
			collection.set(reminder.id, convertReminder(reminder, entryIndex));
		});
		return collection;
	}
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
