import { container } from "@sapphire/framework"
import { resolveChannelName } from "../../db/extensions/reminders"
import { dateConverter } from "../../services/dateService"
import {
	WebhookService,
	assertWebhookChannel,
	createWebhookEntry,
} from "../../services/webhookService"
import {
	CreateReminderDTOConstructor,
	CreateReminderArgsDiscord,
	GeneralCreateReminderArgs,
} from "../../types/types"
import { Prisma } from "@prisma/client"

export class CreateReminderDTOFactory {
	constructor(public webhookService = new WebhookService()) {}

	async fromDiscord(props: CreateReminderArgsDiscord) {
		assertWebhookChannel(props.channel)

		const webhook = await this.webhookService.getOrCreateAnyOwnedWebhookInChannel(props.channel)
		const data: CreateReminderDTOConstructor = {
			reminder_message: props.reminderMessage,
			time: props.time,
			channel: {
				id: props.channel.id,
				name: resolveChannelName(props.channel),
			},
			guild: {
				id: props.guild.id,
				name: props.guild.name,
			},
			user: {
				id: props.user.id,
			},
			webhook: createWebhookEntry(webhook),
		}
		return new CreateReminderDTO(data)
	}

	async fromGeneral(props: GeneralCreateReminderArgs) {
		const channel = await container.client.channels.fetch(props.channelId)
		if (!channel) {
			throw new Error("Channel not found")
		}
		if (channel.isDMBased()) {
			throw new Error("DM channels are not supported")
		}
		assertWebhookChannel(channel)
		const webhook = await this.webhookService.getOrCreateAnyOwnedWebhookInChannel(channel)
		const data: CreateReminderDTOConstructor = {
			reminder_message: props.reminder_message,
			time: dateConverter.resolveDateType(props.time, "js"),
			channel: {
				id: props.channelId,
				name: channel.name,
			},
			guild: {
				id: channel.guild.id,
				name: channel.guild.name,
			},
			user: {
				id: props.userId,
			},
			webhook: createWebhookEntry(webhook),
		}
		return new CreateReminderDTO(data)
	}
}

export class CreateReminderDTO {
	constructor(public data: CreateReminderDTOConstructor) {}

	public generateCreateReminderInput() {
		const { reminder_message, time } = this.data
		const dto = this
		return {
			data: {
				reminder_message,
				time,

				...dto.connectOrCreateUser(),
				...dto.connectOrCreateChannel(),
				...dto.connectOrCreateWebhook(),
			},
		} satisfies Prisma.remindersCreateArgs
	}

	public connectOrCreateChannel() {
		return {
			discord_channels: {
				connectOrCreate: {
					where: {
						id: this.data.channel.id,
					},
					create: {
						id: this.data.channel.id,
						name: this.data.channel.name,
						discord_guilds: {
							connectOrCreate: {
								where: {
									id: this.data.guild.id,
								},
								create: {
									id: this.data.guild.id,
									name: this.data.guild.name,
								},
							},
						},
					},
				},
			} satisfies Prisma.remindersCreateArgs["data"]["discord_channels"],
		}
	}

	public connectOrCreateUser() {
		return {
			discord_user: {
				connectOrCreate: {
					where: {
						id: this.data.user.id,
					},
					create: {
						id: this.data.user.id,
					},
				},
			} satisfies Prisma.remindersCreateArgs["data"]["discord_user"],
		}
	}

	public connectOrCreateWebhook() {
		const webhook = this.data.webhook
		return {
			webhook: {
				connectOrCreate: {
					where: {
						id: webhook.id,
					},
					create: {
						...webhook,
						discord_channels: {
							connectOrCreate: {
								where: {
									id: this.data.channel.id,
								},
								create: {
									id: this.data.channel.id,
									name: this.data.channel.name,
									discord_guilds: {
										connectOrCreate: {
											where: {
												id: this.data.guild.id,
											},
											create: {
												id: this.data.guild.id,
												name: this.data.guild.name,
											},
										},
									},
								},
							},
						},
					},
				},
			} satisfies Prisma.remindersCreateArgs["data"]["webhook"],
		}
	}
}
