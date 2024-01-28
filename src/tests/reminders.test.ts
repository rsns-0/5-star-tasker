import { config } from "dotenv"
import prisma from "../db/prismaInstance"

config()
describe("getUserReminders", () => {
	it("should deserialize dates", async () => {
		const res = await prisma.reminders.getUserReminders({
			id: process.env.TEST_USER_ID!,
		})

		expect(res.reminders.length).toBeGreaterThan(0)
		res.reminders.forEach((s) => {
			expect(s.time).toBeInstanceOf(Date)
		})
	})
})
