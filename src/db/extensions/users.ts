import { err, ok } from "@sapphire/framework";

import { Prisma } from "@prisma/client";
import { User } from "discord.js";

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: "userExtension",
		model: {
			discord_user: {
				async registerUser(user: User) {
					return prisma.discord_user.create({
						data: {
							id: user.id,
							username: user.username,
						},
					});
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
					});
					if (!result) {
						return err("User was not found in database." as const);
					}
					if (!result.timezones) {
						return err("User has not registered their timezone." as const);
					}
					return ok(result.timezones.value);
				},
			},
		},
	});
});
