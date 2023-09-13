import { Collection } from "discord.js";
import { ReminderPage } from "models/pagination/reminderComponentData";

import { reminders } from "@prisma/client";
import { paginateArrays } from "../../utils/paginateArrays";

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
			reminderData.set(pageIndex, ReminderPage.fromReminders(reminders));
		});
		return reminderData;
	}
}
