import { PaginatedMessageAction } from "@sapphire/discord.js-utilities";
import { Collection, EmbedField } from "discord.js";

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
}
