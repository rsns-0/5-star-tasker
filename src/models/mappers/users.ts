import { Prisma } from "@prisma/client"

export interface UserData {
	id: string
	username?: string
}

export function userToPrismaConnectOrCreate(user: UserData) {
	return {
		connectOrCreate: {
			where: {
				id: user.id,
			},
			create: {
				id: user.id,
				username: user.username,
			},
		},
	} as const satisfies Prisma.discord_userCreateNestedOneWithoutRemindersInput
}
