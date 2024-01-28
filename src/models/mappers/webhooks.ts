import { Prisma } from "@prisma/client"

export interface WebhookData {
	id: string
	name: string
	createdAt: Date
	token: string
	url: string
}

export function webhookToPrismaConnectOrCreate(
	webhook: WebhookData,
	discord_channels: Prisma.discord_channelsCreateNestedOneWithoutRemindersInput
) {
	return {
		connectOrCreate: {
			where: {
				id: webhook.id,
			},
			create: {
				id: webhook.id,
				name: webhook.name,
				created_at: webhook.createdAt,
				token: webhook.token,
				url: webhook.url,
				discord_channels,
			},
		},
	} as const satisfies Prisma.webhooksCreateNestedOneWithoutRemindersInput
}
