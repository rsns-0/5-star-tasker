import { container } from "@sapphire/framework"
import prisma from "db/prismaInstance"
import { ActionRowBuilder, ChatInputCommandInteraction, StringSelectMenuBuilder } from "discord.js"
import {
	reminderSelectTimezoneEmbed,
	reminderTimezoneRegisteredEmbed,
} from "embeds/createReminderExplanationEmbed"
import { timezonesNegatives, timezonesPositives } from "features/reminders/selectBoxForTimezones"

export async function timezoneSelection(interaction: ChatInputCommandInteraction) {
	const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesNegatives)
	const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesPositives)
	const embedToUpdate = reminderSelectTimezoneEmbed()
	const response = await interaction.editReply({
		embeds: [reminderSelectTimezoneEmbed()],
		components: [row1.toJSON(), row2.toJSON()],
	})
	container.dbLogger.emit("info", "Waiting for user to select timezone.")
	const confirmation = await response.awaitMessageComponent({
		filter: (i): boolean => i.user.id === interaction.user.id,
		time: 60000,
	})
	if (
		confirmation.isStringSelectMenu() &&
		(confirmation.customId === "positives" || confirmation.customId === "negatives")
	) {
		await confirmation.update({
			embeds: [embedToUpdate.setTitle("Saving your timezone...").setDescription(" ")],
			components: [],
		})

		container.dbLogger.emit(
			"info",
			`User ${interaction.user.id} ${interaction.user.globalName} selected timezone ${confirmation.values[0]}`
		)
		const tzinfo = await prisma.timezones.findFirst({
			where: {
				value: confirmation.values[0],
			},
		})
		if (!tzinfo) {
			throw new Error(
				"Assertion error: Timezone not found. Check to make sure the form field options align with the database data."
			)
		}
		await prisma.discord_user.registerUserWithTimezone(interaction.user, tzinfo.id)
		await interaction.followUp({
			embeds: [reminderTimezoneRegisteredEmbed(tzinfo)],
			ephemeral: true,
		})
	}
}
