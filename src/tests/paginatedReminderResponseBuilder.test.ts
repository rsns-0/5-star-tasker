import {
	ENTRY_1_NAME,
	ENTRY_1_VALUE,
	ENTRY_2_NAME,
	ENTRY_2_VALUE,
} from "./testResources/reminderPaginationModelResources/constants"

import { ReminderPaginatedMessage } from "../models/reminders/paginatedReminderResponseBuilder"
import { sampleReminderTestData } from "./testResources/reminderPaginationModelResources/sampleReminderTestData"

import { describe, expect, it, beforeEach } from "vitest"
import prisma from "../db/prismaInstance"
import { config } from "dotenv"

config()

describe("page data generation", () => {
	let msg: ReminderPaginatedMessage
	beforeEach(() => {
		msg = ReminderPaginatedMessage.fromReminderData(sampleReminderTestData)
	})

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

		expect(msg.reminderPages.length).toBeTruthy()

		const embedData = msg
			.getEmbedFieldsOfFirstPage()
			.filter(
				(field): field is NonNullable<typeof field> => field !== null && field !== undefined
			)

		expect(embedData.length).toBeTruthy()
		expect(embedData[0].name).toBe(expected[0].name)
		expect(embedData[0].value).toContain(expected[0].value)
		expect(embedData[1].name).toBe(expected[1].name)
		expect(embedData[1].value).toContain(expected[1].value)
	})

	it("The final page should state that the max amount of reminders has been reached when isExcess is true", () => {
		const msg = ReminderPaginatedMessage.fromReminderData(sampleReminderTestData, {
			isExcess: true,
		})

		const description = msg.getParsedPages().at(-1)?.embeds[0].description?.toLowerCase()
		const keywords = ["max", "reminders"]
		keywords.forEach((s) => expect(description).toContain(s))
	})

	it("getUserReminders should return 0 count and 0 reminder length with non existent user", async () => {
		const res = await prisma.reminders.getUserReminders({
			id: "23498jfweimdivj",
			globalName: "test user global name",
		})
		expect(res.count).toBe(0)
		expect(res.reminders.length).toBe(0)
	})

	it("getUserReminders should have a higher count in reminder aggregation compared to reminder returned length", async () => {
		const res = await prisma.reminders.getUserReminders({
			id: process.env.TEST_USER_ID!,
			globalName: "test user global name",
		})
		expect(res.count).toBeGreaterThan(res.reminders.length)
		expect(res.reminders.length).toBe(100)
	})
})




	
	
	
	