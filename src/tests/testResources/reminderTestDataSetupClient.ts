import { Prisma } from "@prisma/client"
import prisma from "../../db/prismaInstance"

export class ReminderTestDataSetupClient {
	constructor(
		public users: Prisma.discord_userCreateManyInput[],
		public sampleData: Prisma.remindersCreateManyInput[]
	) {}

	async setupUserData() {
		return prisma.discord_user.createMany({
			data: this.users,
		})
	}

	async setupReminderData() {
		return prisma.reminders.createMany({
			data: this.sampleData,
		})
	}

	async teardownReminders() {
		await prisma.reminders.deleteMany({
			where: {
				user_id: {
					in: this.users.map((user) => user.id),
				},
			},
		})
		return true as const
	}

	async teardownUsers() {
		await prisma.discord_user.deleteMany({
			where: {
				id: {
					in: this.users.map((user) => user.id),
				},
			},
		})
		return true as const
	}

	async teardownUsersAndReminders() {
		await this.teardownReminders()
		await this.teardownUsers()
	}
}
