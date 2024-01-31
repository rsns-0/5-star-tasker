import { Prisma } from "@prisma/client"
import { User } from "discord.js"

import { container } from "@sapphire/framework"

import { AsyncReturnType, SetOptional } from "type-fest"
import { db2 } from "../kyselyInstance"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { sql } from "kysely"
import { reminderToReminderUserMessage } from "../../models/reminders/reminderMessage"
import { isNotUndefined, mergeMap, then, thenMergeMap } from "../../utils/utils"
import { map, partition, pipe } from "remeda"
export default Prisma.defineExtension((db) => {
	return db.$extends({
		name: "reminderExtension",
		model: {
			reminders: {
				async getUserReminders(
					user: SetOptional<Pick<User, "id" | "globalName">, "globalName">
				) {
					container.dbLogger.info(
						`Retrieving reminders for user:\nID: ${user.id}\nGlobal Name: ${user.globalName}`
					)

					return createGetUserRemindersByIdQuery(user.id)
						.executeTakeFirstOrThrow()
						.then(adjustGetUserRemindersByIdOutput)
				},

				async getExpiredReminders() {
					return await db.reminders.findMany({
						select: {
							id: true,
							webhook_id: true,
							reminder_message: true,
							user_id: true,
							time: true,
						},
						where: {
							time: {
								lte: new Date(),
							},
							webhook: {
								token: {
									not: null,
								},
							},
						},
					})
				},
				/**
				 * Deletes a reminder by its ID.
				 *
				 * @param id - The ID of the reminder to delete.
				 * @returns A promise that resolves to the deleted reminder.
				 */
				async deleteReminderById(id: number) {
					return db.reminders.delete({
						where: {
							id,
						},
					})
				},

				async sendDueReminders() {
					container.dbLogger.info("Checking for expired reminders...")
					return await db2
						.transaction()
						.setIsolationLevel("repeatable read")
						.execute(async (tx) => {
							return await pipe(
								await createGetExpiredRemindersQuery(tx).execute(),
								map(reminderToReminderUserMessage),
								mergeMap((s) => container.userService.sendReminder(s)),
								thenMergeMap(({ state, id }) => {
									if (state === "failed") {
										container.dbLogger.error(`Failed to send reminder ${id}`)
										return
									}
									return createDeleteReminderByIdQuery(tx, id)
										.executeTakeFirstOrThrow()
										.catch((e) => {
											container.dbLogger.error(e)
										})
								}),
								then(partition(isNotUndefined)),
								then(([successes, failures]) => {
									container.dbLogger.info("Finished processing reminders.")
									container.dbLogger.info(
										`Deleted ${successes.length} reminders.`
									)
									failures.length &&
										container.dbLogger.error(
											`Failed to delete ${failures.length} reminders.`
										)
									return successes
								})
							)
						})
				},
			},
		},
	})
})

const createGetExpiredRemindersQuery = (db: typeof db2) => {
	return db
		.selectFrom("reminders")
		.where("time", "<=", new Date())
		.select([
			"reminders.id",
			"reminders.user_id",
			"time",
			"reminders.reminder_message",
			"webhook_id",
		])
		.limit(10_000)
}

const createDeleteReminderByIdQuery = (db: typeof db2, id: number) => {
	return db.deleteFrom("reminders").where("id", "=", id).returning("id")
}

const createGetUserRemindersByIdQuery = (id: string) => {
	const reminders = jsonArrayFrom(
		db2
			.selectFrom("discord_user")
			.innerJoin("reminders", "discord_user.id", "reminders.user_id")
			.where("discord_user.id", "=", id)
			.where("reminders.time", ">", new Date())
			.select([
				"reminders.id",
				sql<string>`reminders.time`.as("time"),
				"reminders.reminder_message",
			])
			.orderBy("reminders.time", "asc")
			.limit(100)
	).as("reminders")

	return db2
		.selectFrom("reminders")
		.where("reminders.user_id", "=", id)
		.select([(eb) => eb.fn.count("reminders.id").as("count"), reminders])
}

const adjustGetUserRemindersByIdOutput = (
	result: AsyncReturnType<
		ReturnType<typeof createGetUserRemindersByIdQuery>["executeTakeFirstOrThrow"]
	>
) => {
	return {
		reminders: result.reminders.map((s) => {
			// https://github.com/kysely-org/kysely/issues/482
			return {
				...s,
				time: new Date(s.time),
			}
		}),
		count: Number(result.count),
	}
}
