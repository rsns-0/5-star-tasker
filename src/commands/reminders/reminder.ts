import { ApplyOptions, RequiresClientPermissions } from "@sapphire/decorators"

import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	DiscordAPIError,
	Message,
	PermissionFlagsBits,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
} from "discord.js"
import {
	reminderExplanationEmbed,
	reminderFinishedEmbed,
	reminderSelectTimezoneEmbed,
	reminderSomethingWrongEmbed,
	reminderTimezoneRegisteredEmbed,
} from "../../embeds/createReminderExplanationEmbed"
import {
	timezonesNegatives,
	timezonesPositives,
} from "../../features/reminders/selectBoxForTimezones"

import { Subcommand } from "@sapphire/plugin-subcommands"

import prisma from "../../db/prismaInstance"
import { timeToDayjs } from "../../services/timezoneService"

import { container } from "@sapphire/framework"
import { ReminderPaginatedMessage } from "../../models/reminders/paginatedReminderResponseBuilder"

import { assertWebhookChannel } from "../../services/webhookService"
import { channelToPrismaConnectOrCreate } from "../../models/mappers/channels"
import { userToPrismaConnectOrCreate } from "../../models/mappers/users"
import { webhookToPrismaConnectOrCreate } from "../../models/mappers/webhooks"
import { Prisma } from "@prisma/client"
import { AsyncReturnType } from "type-fest"

@ApplyOptions<Subcommand.Options>({
	name: "reminder",
	description: "Manage reminders. Use help for more information.",
	subcommands: [
		{
			name: "help",
			chatInputRun: "help",
		},
		{
			name: "set",
			chatInputRun: "set",
		},
		{
			name: "edit",
			chatInputRun: "edit",
		},
	],
})
export class UserCommand extends Subcommand {
	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((b) => {
			return b
				.setName("reminder")
				.setDescription("Create a reminder")
				.addSubcommand((subcommand) =>
					subcommand.setName("edit").setDescription("Edit your reminders")
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("set")
						.setDescription("Info about a user")
						.addStringOption((option) =>
							option
								.setName("time")
								.setDescription(
									"set the time for the reminder, more info in /reminder help"
								)
								.setRequired(true)
								.setMaxLength(25)
						)
						.addStringOption((option) =>
							option
								.setName("message")
								.setDescription(
									"What do you want to be pinged for? (200 chars limit)"
								)
								.setRequired(false)
						)
						.addChannelOption((option) =>
							option
								.setName("channel")
								.setDescription(
									"What channel do you want the reminder to be sent in?"
								)
								.setRequired(false)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand.setName("help").setDescription("Explanation of how to use /reminder")
				)
		})
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public help(interaction: ChatInputCommandInteraction) {
		interaction.reply({
			embeds: [reminderExplanationEmbed()],
		})
	}

	@RequiresClientPermissions([PermissionFlagsBits.Administrator])
	public async set(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ ephemeral: true })
			container.dbLogger.info(`User ${interaction.user.username} is setting a reminder.`)
			const userTimezone = await getUserTimezoneValue(interaction.user.id)
			if (!userTimezone) {
				return await new UserRegistrationRunner(interaction).run()
			}
			const getUserAdjustedTimezone: UserDateGetter = () =>
				timeToDayjs(interaction.options.getString("time")!, userTimezone)
			return await new SetReminderRunner(interaction, getUserAdjustedTimezone).run()
		} catch (e) {
			container.dbLogger.error(e)
			if (!(e instanceof DiscordAPIError)) {
				await interaction.editReply({
					embeds: [reminderSomethingWrongEmbed()],
				})
			}
			throw e
		}
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public async edit(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ ephemeral: true })

			const results = await prisma.reminders.getUserReminders(interaction.user)

			if (!results.reminders.length) {
				await interaction.editReply({
					message: "You have no reminders set.",
				})
				return
			}

			await ReminderPaginatedMessage.fromReminderData(results.reminders!, {
				pageSize: 5,
				isExcess: results.count > 100,
			}).run(interaction, interaction.user)
		} catch (e) {
			container.dbLogger.error(e)
			if (e instanceof DiscordAPIError) {
				throw e
			} else {
				await interaction
					.editReply({
						embeds: [reminderSomethingWrongEmbed()],
					})
					.catch((e) => container.dbLogger.error(e))
			}
		}
	}
}

async function getUserTimezoneValue(id: string) {
	return await prisma.discord_user
		.findUnique({
			select: {
				timezones: {
					select: {
						value: true,
					},
				},
			},
			where: {
				id,
				timezones: {
					isNot: null,
				},
			},
		})
		.then((s) => s?.timezones?.value)
}

type UserDateGetter = () => ReturnType<typeof timeToDayjs>

class SetReminderRunner {
	constructor(
		public interaction: ChatInputCommandInteraction,
		public getDate: UserDateGetter
	) {}

	async run() {
		const channelData = this.getChannelData()
		const date = this.getDate()
		const webhookClient = await this.getWebhookClient(channelData.channel)
		const data = this.createReminderData(channelData, webhookClient, date.toDate())
		await this.createReminder(data)
		await this.interaction.editReply({
			embeds: [reminderFinishedEmbed(date, this.getMessage(), channelData.channelName)],
		})
	}

	createReminderData(
		channelData: ReturnType<typeof this.getChannelData>,
		webhookClient: AsyncReturnType<typeof this.getWebhookClient>,
		time: Date
	) {
		const discord_channels = channelToPrismaConnectOrCreate({
			id: channelData.channel.id,
			name: channelData.channelName,
			guildId: this.getGuild().id,
		})

		const webhook = webhookToPrismaConnectOrCreate(webhookClient, discord_channels)

		const discord_user = userToPrismaConnectOrCreate({
			id: this.interaction.user.id,
			username: this.interaction.user.username,
		})

		return {
			discord_channels,
			discord_user,
			webhook,
			time,
			reminder_message: this.getMessage(),
		} as const satisfies Prisma.remindersCreateInput
	}

	async createReminder(data: ReturnType<typeof this.createReminderData>) {
		return await prisma.reminders.create({
			select: {
				id: true,
			},
			data,
		})
	}

	async getWebhookClient(channel: ReturnType<typeof this.getChannelData>["channel"]) {
		return await container.webhookService.getOrCreateAnyOwnedWebhookInChannel(channel)
	}

	getMessage() {
		return this.interaction.options.getString("message") ?? "Ping! 🏓"
	}

	getChannelData() {
		const channel = this.interaction.options.getChannel("channel") ?? this.interaction.channel

		if (!channel) {
			throw new Error("Unexpected missing channel")
		}

		assertWebhookChannel(channel)

		const channelName = (() => {
			if (!("name" in channel) || channel.name === null || channel.name === undefined) {
				return ""
			}
			return channel.name
		})()

		return {
			channel,
			channelName,
		}
	}

	getGuild() {
		const guild = this.interaction.guild
		if (!guild) {
			throw new Error("Unexpected missing guild")
		}
		return guild
	}
}

const reminderSelectTimezoneComponent = {
	embeds: [reminderSelectTimezoneEmbed()],
	components: [
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesNegatives),
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesPositives),
	],
}

const savingTimezoneComponent = {
	embeds: [reminderSelectTimezoneEmbed().setTitle("Saving your timezone...").setDescription(" ")],
	components: [],
}

class UserRegistrationRunner {
	timeString
	constructor(public readonly interaction: ChatInputCommandInteraction) {
		this.timeString = interaction.options.getString("time")!
	}

	confirmationIsValid(
		confirmation: Awaited<ReturnType<Message["awaitMessageComponent"]>>
	): confirmation is StringSelectMenuInteraction {
		return (
			confirmation.isStringSelectMenu() &&
			(confirmation.customId === "positives" || confirmation.customId === "negatives")
		)
	}

	async promptTimezone() {
		const { interaction } = this
		const message = await interaction.editReply(reminderSelectTimezoneComponent)

		return await message.awaitMessageComponent({
			filter: (i_1): boolean => i_1.user.id === interaction.user.id,
			time: 60_000,
		})
	}

	getTimezoneData(timezoneValue: string) {
		return prisma.timezones.findFirstOrThrow({
			select: {
				id: true,
				emoji: true,
				description: true,
				label: true,
			},

			where: {
				value: timezoneValue,
			},
		})
	}

	async run() {
		const { interaction } = this
		container.dbLogger.emit(
			"info",
			`Waiting for user ${interaction.user.globalName} to select timezone.`
		)
		const confirmation = await this.promptTimezone()

		if (!this.confirmationIsValid(confirmation)) {
			return
		}
		const timezoneValue = confirmation.values[0]
		container.dbLogger.emit(
			"info",
			`User ${interaction.user.id} ${interaction.user.globalName} selected timezone ${timezoneValue}`
		)
		await confirmation.update(savingTimezoneComponent)

		const timezoneData = await this.getTimezoneData(timezoneValue).catch((e) => {
			container.dbLogger.error({
				message: `User ${interaction.user.id} selected a timezone that does not exist. ${timezoneValue}`,
				errorMessage: e.message,
			})
			throw e
		})

		await prisma.discord_user.registerUserWithTimezone(interaction.user, timezoneData.id)

		await interaction.followUp({
			embeds: [reminderTimezoneRegisteredEmbed(timezoneData, this.timeString)],
			ephemeral: true,
		})
	}
}
