import { err, ok } from "@sapphire/framework"

import { Prisma } from "@prisma/client"
import { Guild, GuildMember } from "discord.js"
import { timeToDayjs } from "../../services/timezoneService"
import { db2 } from "../kyselyInstance"
import * as R from "remeda"
import { AliasedRawBuilder, sql } from "kysely"

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

					return await db2
						.insertInto("_discord_guilds_members")
						.values(edges)
						.onConflict((s) => s.doNothing())
						.returning(["A", "B"])
						.execute()
				},

				async disconnectGuildMembers(guilds: Guild[]) {
					return await createDisconnectGuildMembersQuery(guilds).execute()
				},
			},
		},
	})
})

function createDisconnectGuildMembersQuery(guilds: Guild[]) {
	const res = guilds.flatMap((guild) =>
		guild.members.cache.map((member) => ({ A: guild.id, B: member.id }) as const)
	)

	const data = db2.selectFrom(values(res, "data")).selectAll()

	const toDelete = db2
		.selectFrom("_discord_guilds_members")
		.leftJoin(data.as("data"), (join) =>
			join
				.onRef("data.A", "=", "_discord_guilds_members.A")
				.onRef("data.B", "=", "_discord_guilds_members.B")
		)
		.where("data.A", "is", null)
		.where("_discord_guilds_members.B", "!=", "111111111111111111")
		.select(["_discord_guilds_members.A as A", "_discord_guilds_members.B as B"])

	const deleted = db2
		.deleteFrom("_discord_guilds_members")
		.using(toDelete.as("toDelete"))
		.whereRef("toDelete.A", "=", "_discord_guilds_members.A")
		.whereRef("toDelete.B", "=", "_discord_guilds_members.B")
		.returning(["_discord_guilds_members.A", "_discord_guilds_members.B"])

	return db2
		.with("deleted", () => deleted)
		.insertInto("deleted_discord_user_to_guilds")
		.columns(["discord_guild_id", "discord_user_id"])
		.expression((eb) =>
			eb
				.selectFrom("deleted")
				.select(["deleted.A as discord_guild_id", "deleted.B as discord_user_id"])
		)
		.returning(["discord_guild_id", "discord_user_id"])
}

function values<R extends Record<string, unknown>, A extends string>(
	records: R[],
	alias: A
): AliasedRawBuilder<R, A> {
	// Assume there's at least one record and all records
	// have the same keys.
	const keys = Object.keys(records[0])

	// Transform the records into a list of lists such as
	// ($1, $2, $3), ($4, $5, $6)
	const values = sql.join(records.map((r) => sql`(${sql.join(keys.map((k) => r[k]))})`))

	// Create the alias `v(id, v1, v2)` that specifies the table alias
	// AND a name for each column.
	const wrappedAlias = sql.ref(alias)
	const wrappedColumns = sql.join(keys.map(sql.ref))
	const aliasSql = sql`${wrappedAlias}(${wrappedColumns})`

	// Finally create a single `AliasedRawBuilder` instance of the
	// whole thing. Note that we need to explicitly specify
	// the alias type using `.as<A>` because we are using a
	// raw sql snippet as the alias.
	return sql`(values ${values})`.as<A>(aliasSql) as AliasedRawBuilder<R, A>
}
