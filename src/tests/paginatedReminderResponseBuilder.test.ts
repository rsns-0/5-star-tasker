import {
ENTRY_1_NAME,
ENTRY_1_VALUE,
ENTRY_2_NAME,
ENTRY_2_VALUE,
} from "./testResources/reminderPaginationModelResources/constants"

import { ReminderPaginatedResponseBuilder } from "../models/reminders/paginatedReminderResponseBuilder"
import { sampleReminderTestData } from "./testResources/reminderPaginationModelResources/sampleReminderTestData"

describe("page data generation", () => {
	const msgWithReminderData = () => {
		const msg = ReminderPaginatedResponseBuilder.fromReminderData(sampleReminderTestData)
		return msg
	}

	it(`
	When the reminder model is initialized with the sample reminder test data, it should successfully perform the transformations
	of reminder data required for the base PaginatedMessage class to produce a successful embed message in the correct order.
	This can be checked by accessing the pages of the model and viewing their embed data.`, async () => {
		const expected = [
			{
				name: ENTRY_1_NAME,
				value: ENTRY_1_VALUE,
			},
			{
				name: ENTRY_2_NAME,
				value: ENTRY_2_VALUE,
			},
		]
		const msg = msgWithReminderData()
		expect(msg.reminderPages.length).toBeTruthy()

		const embedData = msg
			.getEmbedFieldsOfFirstPage()
			.filter(
				(field): field is NonNullable<typeof field> => field !== null && field !== undefined
			)
		console.log(embedData[0])
		console.log(embedData[1])
		console.log(expected[0])
		console.log(expected[1])
		expect(embedData.length).toBeTruthy()
		expect(embedData[0].name).toBe(expected[0].name)
		expect(embedData[0].value).toContain(expected[0].value)
		expect(embedData[1].name).toBe(expected[1].name)
		expect(embedData[1].value).toContain(expected[1].value)
	})
})
