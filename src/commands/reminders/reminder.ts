import { ApplyOptions, RequiresClientPermissions } from "@sapphire/decorators"

import {
	ChatInputCommandInteraction,
	DiscordAPIError,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js"
import {
	givingBackUserInputEmbed,
	reminderExplanationEmbed,
	reminderFinishedEmbed,
	reminderSomethingWrongEmbed,
} from "../../embeds/createReminderExplanationEmbed"

import { Subcommand } from "@sapphire/plugin-subcommands"

import prisma from "../../db/prismaInstance"
import { timeStringToDayjsObj } from "../../services/timezoneService"

import { container } from "@sapphire/framework"
import { ReminderPaginatedResponseBuilder } from "../../models/reminders/paginatedReminderResponseBuilder"
import { timezoneSelection } from "models/reminders/timezoneSelectionFunction"

const reminderData = new SlashCommandBuilder()
	.setName("reminder")
	.setDescription("Create a reminder")
	.addSubcommand((subcommand) => subcommand.setName("edit").setDescription("Edit your reminders"))
	.addSubcommand((subcommand) =>
		subcommand
			.setName("set")
			.setDescription("Info about a user")
			.addStringOption((option) =>
				option
					.setName("time")
					.setDescription("set the time for the reminder, more info in /reminder help")
					.setRequired(true)
					.setMaxLength(25)
			)
			.addStringOption((option) =>
				option
					.setName("message")
					.setDescription("What do you want to be pinged for? (200 chars limit)")
					.setRequired(false)
			)
			.addChannelOption((option) =>
				option
					.setName("channel")
					.setDescription("What channel do you want the reminder to be sent in?")
					.setRequired(false)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("help").setDescription("Explanation of how to use /reminder")
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("timezone").setDescription("Define or change your timezone")
	)

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
		{
			name: "timezone",
			chatInputRun: "timezone",
		},
	],
})
export class UserCommand extends Subcommand {
	public override registerApplicationCommands(registry: Subcommand.Registry) {
		// Register slash command

		registry.registerChatInputCommand(reminderData)
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public help(interaction: ChatInputCommandInteraction) {
		interaction.reply({
			embeds: [reminderExplanationEmbed()],
		})
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public async set(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ ephemeral: true })

			// * Check db for user timezone data
			const result = await prisma.discord_user.findUnique({
				where: {
					id: interaction.user.id,
					timezones: {
						isNot: null,
					},
				},
				include: {
					timezones: {
						select: {
							value: true,
						},
					},
				},
			})
			const timeString = interaction.options.getString("time")!
			const userTimezone = result?.timezones?.value
			//* If user doesn't exist or has no timezone data, prompt user and persist data.
			if (userTimezone === undefined || userTimezone === null) {
				timezoneSelection(interaction)
				await interaction.followUp({
					embeds: [givingBackUserInputEmbed(timeString)],
					ephemeral: true,
				})
			}
			// * Else create reminder for user.
			else {
				const reminder = interaction.options.getString("message") ?? "Pong 🏓"
				if (!interaction.channel) {
					throw new Error("Unexpected missing channel")
				}

				const date = timeStringToDayjsObj(timeString, userTimezone)
				await prisma.reminders.createReminder((factory) => {
					return factory.fromDiscord({
						channel: interaction.channel!,
						user: interaction.user,
						time: date.toDate(),
						guild: interaction.guild!,
						reminderMessage: reminder,
					})
				})

				await interaction.editReply({
					embeds: [reminderFinishedEmbed(date, reminder)],
				})
			}
		} catch (e) {
			container.dbLogger.emit("error", e)
			if (e instanceof DiscordAPIError) {
				throw e
			} else {
				await interaction.editReply({
					embeds: [reminderSomethingWrongEmbed()],
				})
				throw e
			}
		}
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public async edit(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ ephemeral: true })
			const reminders = await prisma.reminders.getAllRemindersOfUser(interaction.user)
			if (!reminders.length) {
				await interaction.editReply({
					message: "You have no reminders set.",
				})
				return
			}

			await ReminderPaginatedResponseBuilder.fromReminderData(reminders).run(
				interaction,
				interaction.user
			)
		} catch (e) {
			container.dbLogger.emit("error", e)
			if (e instanceof DiscordAPIError) {
				throw e
			} else {
				await interaction.editReply({
					embeds: [reminderSomethingWrongEmbed()],
				})
			}
		}
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public async timezone(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ ephemeral: true })
			timezoneSelection(interaction)
		} catch (e) {
			container.dbLogger.emit("error", e)
			if (e instanceof DiscordAPIError) {
				throw e
			} else {
				await interaction.editReply({
					embeds: [reminderSomethingWrongEmbed()],
				})
			}
		}
	}
}
