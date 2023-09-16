import {
ENTRY_1_NAME,
ENTRY_1_VALUE,
ENTRY_2_NAME,
ENTRY_2_VALUE,
} from "./testResources/reminderPaginationModelResources/constants"

import { ReminderPaginatedResponseBuilder } from "../models/reminders/paginatedReminderResponseBuilder"
import { premadePageData } from "./testResources/reminderPaginationModelResources/premadePageData"
import { sampleReminderTestData } from "./testResources/reminderPaginationModelResources/sampleReminderTestData"


describe("page data generation", () => {
	const msgWithoutReminderData = () => {
		const msg = ReminderPaginatedResponseBuilder.fromReminderData([])
		msg.addPages(premadePageData)
		return msg
	}
	const msgWithReminderData = () => {
		const msg = ReminderPaginatedResponseBuilder.fromReminderData(sampleReminderTestData)
		msg.generatePages()
		return msg
	}
	it("getPageOptions should return a non empty result", async () => {
		const msg = msgWithoutReminderData()

		const options = await msg.getPageOptions(0)
		const res = options?.embeds?.map((embed) => {
			return (embed as any).fields
		})
		expect(res?.length).toBeTruthy()
	})

	it("getEmbedFieldsOfFirstPage retrieves object containing embed result", async () => {
		const msg = msgWithoutReminderData()

		const res = msg.getEmbedFieldsOfFirstPage()
		// The array contains an object that has the "name" key at an arbitrary depth and the value for it includes "Entry".
		const matcher = expect.arrayContaining([
			expect.objectContaining({
				name: expect.stringContaining("Entry"),
			}),
		])

		expect(res).toEqual(matcher)
		expect(res.length).toBeTruthy()
		expect(res.every((field) => field.name.includes("Entry"))).toBeTruthy()
	})

	it.only(`
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

		const embedData = msg.getEmbedFieldsOfFirstPage()
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
