import { err, ok } from "@sapphire/framework";

import { Prisma } from "@prisma/client";
import { GuildMember, User } from "discord.js"

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: "userExtension",
		model: {
			discord_user: {
				async registerUserWithTimezone(user: User, timezoneId: number | bigint | string) {
					if (typeof timezoneId === "string") {
						timezoneId = BigInt(timezoneId)
					}

					return prisma.discord_user.upsert({
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

				async getUserTimezone(user: User) {
					const result = await prisma.discord_user.findUnique({
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
					const result = await prisma.discord_user.findUnique({
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

				unsafeRegister(member: GuildMember) {
					return prisma.discord_user.upsert({
						select: { id: true },
						where: { id: member.id },
						create: {
							id: member.id,
							username: member.user.username,
							discord_guilds_joined: {
								connect: {
									id: member.guild.id,
								},
							},
						},
						update: {
							username: member.user.username,
							discord_guilds_joined: {
								connect: {
									id: member.guild.id,
								},
							},
						},
					})
				},
			},
		},
	})
})
