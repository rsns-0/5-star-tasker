import { Prisma } from "@prisma/client"
import { User } from "discord.js"

import { container } from "@sapphire/framework"

import { AsyncReturnType, SetOptional } from "type-fest"
import { db2 } from "../kyselyInstance"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { sql } from "kysely"
import { reminderToReminderUserMessage } from "../../models/reminders/reminderMessage"
import { isNotUndefined, mergeMap, andThen } from "../../utils/utils"
import * as R from "remeda"

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
					return await R.pipe(
						await createGetExpiredRemindersQuery().execute(),
						R.tap((s) => {
							if (s.length === 0) {
								container.dbLogger.info("No expired reminders found.")
							}
						}),
						R.map(reminderToReminderUserMessage),
						R.map(container.userService.sendReminder.bind(container.userService)),
						mergeMap(andThen(deleteReminder)),
						andThen(R.groupBy((s) => s.state)),
						andThen(R.toPairs),
						andThen(
							R.flatMap(([state, reminders]) => {
								const message = {
									state,
									count: reminders.length,
									ids: reminders.map((s) => s.id),
								}
								if (message.state.includes("fail")) {
									container.dbLogger.error(message)
									return
								}
								container.dbLogger.info(message)
								return message.ids
							})
						),
						R.tap(() => container.dbLogger.info("Finished processing reminders.")),
						andThen(R.filter(isNotUndefined))
					)
				},
			},
		},
	})
})

function deleteReminder({ state, id }: AsyncReturnType<typeof container.userService.sendReminder>) {
	if (state === "failed") {
		container.dbLogger.error(`Failed to send reminder ${id}`)
		return {
			id,
			state,
		} as const
	}
	return createDeleteReminderByIdQuery(id)
		.execute()
		.then((s) => {
			const first = s[0]
			if (!first) {
				return {
					id,
					state: "alreadyDeleted",
				} as const
			}
			return {
				...first,
				state: "success",
			} as const
		})
		.catch((e) => {
			container.dbLogger.error(e)
			return {
				id,
				state: "failedToDelete",
			} as const
		})
}

const createGetExpiredRemindersQuery = (db = db2) => {
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

const createDeleteReminderByIdQuery = (id: number, db = db2) => {
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
