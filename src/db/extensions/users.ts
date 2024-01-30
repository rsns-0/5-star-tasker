import { err, ok } from "@sapphire/framework"

import { Prisma } from "@prisma/client"
import { GuildMember } from "discord.js"
import { timeToDayjs } from "../../services/timezoneService"
import { db2 } from "../kyselyInstance"

export default Prisma.defineExtension((db) => {
	return db.$extends({
		name: "userExtension",
		model: {
			discord_user: {
				async registerUserWithTimezone(
					user: { id: string; username: string },
					timezoneId: number | bigint | string
				) {
					if (typeof timezoneId === "string") {
						timezoneId = BigInt(timezoneId)
					}

					return db.discord_user.upsert({
						where: {
							id: user.id,
						},
						update: {
							timezones: {
								connect: {
									id: timezoneId,
								},
							},
						},
						create: {
							id: user.id,
							username: user.username,

							timezones: {
								connect: {
									id: timezoneId,
								},
							},
						},
					})
				},

				async getUserTimezone(user: { id: string }) {
					const result = await db.discord_user.findUnique({
						where: {
							id: user.id,
						},
						select: {
							timezones: {
								select: {
									value: true,
								},
							},
						},
					})
					if (!result) {
						return err("User was not found in database." as const)
					}
					if (!result.timezones) {
						return err("User has not registered their timezone." as const)
					}
					return ok(result.timezones.value)
				},

				async getUserTimezoneById(userId: string) {
					const result = await db.discord_user.findUnique({
						where: {
							id: userId,
						},
						select: {
							timezones: {
								select: {
									value: true,
								},
							},
						},
					})
					if (!result) {
						return err("User was not found in database." as const)
					}
					if (!result.timezones) {
						return err("User has not registered their timezone." as const)
					}
					return ok(result.timezones.value)
				},

				async localizedParseTimeInput(userInput: string, userId: string) {
					const result = await this.getUserTimezoneById(userId)
					return result.map((s) => timeToDayjs(userInput, s))
				},

				unsafeRegister(member: GuildMember) {
					const update = {
						username: member.user.username,
						discord_guilds_joined: {
							connect: {
								id: member.guild.id,
							},
						},
					}

					return db.discord_user.upsert({
						select: { id: true },
						where: { id: member.id },
						create: {
							id: member.id,
							...update,
						},
						update,
					})
				},

				async upsertMany(members: GuildMember[]) {
					const values = R.pipe(
						members,
						R.map((s) => ({
							id: s.id,
							username: s.user.username,
						})),
						R.uniqBy((s) => s.id)
					)

					return await db2
						.insertInto("discord_user")
						.values(values)
						.onConflict((s) =>
							s
								.column("id")
								.doUpdateSet((s) => ({ username: s.ref("excluded.username") }))
						)
						.returning("id")
						.execute()
				},

				async connectManyToGuilds(members: GuildMember[]) {
					const edges = members.map((mem) => ({ A: mem.guild.id, B: mem.id }) as const)
					return db2
						.insertInto("_discord_guilds_members")
						.values(edges)
						.onConflict((s) => s.doNothing())
						.returning(["A", "B"])
						.execute()
				},
			},
		},
	})
})
