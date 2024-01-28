import { err, ok } from "@sapphire/framework"
import { ModalSubmitInteraction } from "discord.js"
import { dayjsInstance } from "../lib/dayjsInstance"
import prisma from "../db/prismaInstance"

import { mapModalToSchema } from "../utils/utils"
import { formDataSchema } from "../models/reminders/reminderModalInput"

describe("ReminderModalInteractionHandler", () => {
	describe("createReminderDataFromInteraction", () => {
		beforeAll(() => {
			const mocked = vi.spyOn(prisma.discord_user, "getUserTimezoneById")

			mocked.mockImplementation(async (userId) => {
				if (userId === "12345") {
					return ok("America/New_York") as any
				}
				return err(true)
			})
		})
		it("should return reminder data with valid input", async () => {
			// Mock the interaction object

			const interaction: ModalSubmitInteraction = {
				customId: "someCustomId",
				user: {
					id: "12345",
				},
				fields: {
					getField: vi
						.fn()
						.mockReturnValueOnce({ value: "Some reminder message" })
						.mockReturnValueOnce({ value: "1h" }),
				},
			} as any
			// Call the createReminderDataFromInteraction method

			const data = mapModalToSchema(interaction, formDataSchema)
			const result = await prisma.discord_user.localizedParseTimeInput(
				data.time,
				interaction.user.id
			)

			const expectedHour = dayjsInstance().utc().add(1, "hour").hour()

			// Assert the result
			expect(result.isOk()).toBe(true)
			const res2 = result.unwrap().toDate()

			expect(data.reminder_message).toBe("Some reminder message")
			const adjustedHour = dayjsInstance(res2).utc().hour()
			expect(adjustedHour).toBe(expectedHour)
		})
	})
})
