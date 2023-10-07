import { container } from "@sapphire/framework"

import { CreateReminderDTOFactory } from "../../models/reminders/create-reminder-dto"
import { WebhookService } from "../../services/webhookService"
import { Channel } from "discord.js"

const reminderMessage = "testremindermessage"
const userId = "userid123"
const channelId = "channelid123"
const webhookId = "webhookid123"
const webhookName = "webhookname"
const date = new Date("December 17, 2000 03:24:00")

const dummyChannelInfo = {
	channelId: channelId,
	reminder_message: reminderMessage,
	time: date,
	userId,
}

const expected = {
	data: {
		reminder_message: reminderMessage,
		time: date,
		discord_user: {
			connectOrCreate: {
				where: {
					id: userId,
				},
				create: {
					id: userId,
				},
			},
		},
		discord_channels: {
			connectOrCreate: {
				where: {
					id: channelId,
				},
				create: {
					id: channelId,
				},
			},
		},
		webhook: {
			connectOrCreate: {
				where: {
					id: webhookId,
				},
				create: {
					id: webhookId,
					name: webhookName,
					discord_channels: {
						connectOrCreate: {
							where: {
								id: channelId,
							},
							create: {
								id: channelId,
							},
						},
					},
				},
			},
		},
	},
}

export const testCreateReminderDTOFactory = describe.skipIf(!process.env.RUN_BOT_TESTS)(
	"fromGeneral",
	() => {
		
		let factory: CreateReminderDTOFactory

		beforeAll(() => {
			const spy1 = vi.spyOn(container.client.channels, "fetch")
			spy1.mockImplementation(async () => {
				return {
					...dummyChannelInfo,
					isDMBased() {
						return false
					},
					isTextBased() {
						return true
					},
					isThread() {
						return false
					},
				} as any satisfies Channel
			})
			const mockService = new WebhookService()
			mockService.getOrCreateAnyOwnedWebhookInChannel = vi.fn().mockResolvedValue({
				id: webhookId,
				name: webhookName,
			})

			factory = new CreateReminderDTOFactory(mockService)
		})

		afterAll(() => {
			vi.resetAllMocks()
		})

		it("should generate expected prisma create args from arguments", async () => {
			const dto = await factory.fromGeneral(dummyChannelInfo)
			const res = dto.generateCreateReminderInput()
			expect(res).toEqual(expected)
		}, 60000)
	}
)
