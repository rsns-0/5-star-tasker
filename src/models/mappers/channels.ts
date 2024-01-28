import { Prisma } from "@prisma/client"

export interface ChannelData {
	name: string
	id: string

	guildId: string
}

export function channelToPrismaConnectOrCreate(channel: ChannelData) {
	return {
		connectOrCreate: {
			where: {
				id: channel!.id,
			},
			create: {
				id: channel!.id,
				name: channel.name,
				discord_guilds: {
					connect: {
						id: channel.guildId,
					},
				},
			},
		},
	} as const satisfies Prisma.discord_channelsCreateNestedOneWithoutRemindersInput
}
