import { err, ok } from "@sapphire/framework"
import { ModalSubmitInteraction } from "discord.js"
import { ModalHandler } from "../interaction-handlers/ReminderModalInteractionHandler"

import { dayjsInstance } from "../lib/dayjsInstance"
import prisma from "../db/prismaInstance"

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
			const result = await ModalHandler.createReminderDataFromInteraction(interaction)

			const expectedHour = dayjsInstance().utc().add(1, "hour").hour()

			// Assert the result
			expect(result.isOk()).toBe(true)
			const res2 = result.unwrap()
			expect(res2.reminder_message).toBe("Some reminder message")
			const adjustedHour = dayjsInstance(res2.time).utc().hour()
			expect(adjustedHour).toBe(expectedHour)
		})

		it("should return an error with invalid time input", async () => {
			// Mock the interaction object
			const interaction: ModalSubmitInteraction = {
				customId: "someCustomId",
				user: {
					id: "someUserId",
				},
				fields: {
					getField: vi
						.fn()
						.mockReturnValueOnce({ value: "Some reminder message" })
						.mockReturnValueOnce({ value: "invalidTime" }),
				},
			} as any

			// Call the createReminderDataFromInteraction method
			const result = await ModalHandler.createReminderDataFromInteraction(interaction)

			// Assert the result
			expect(result.isErr()).toBe(true)
		})
	})
})
