import { reminders } from "@prisma/client"
import { paginateArrays } from "../../utils/paginateArrays"
import { ReminderPage } from "./reminderComponentData"

/**
 * This class paginates the reminder data and maps their index to data required for building the
 * embeds and their page actions.
 */
export class ReminderPages extends Array<ReminderPage> {
	private constructor() {
		super()
	}

	/**
	 * Creates a paginated reminder collection from an array of reminders.
	 *
	 * @param reminders - The array of reminders.
	 * @param options - The options for pagination.
	 * @returns The paginated reminder collection.
	 */
	public static fromReminders(reminders: reminders[], { pageSize = 5 } = {}) {
		const remindersPaginated = paginateArrays(reminders, pageSize)
		const reminderData = new this()
		remindersPaginated.forEach((reminderPageArray, index) => {
			const collection = ReminderPage.fromReminders(reminderPageArray, index)
			reminderData.push(collection)
		})

		return reminderData
	}
}
