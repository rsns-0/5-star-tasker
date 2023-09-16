import { ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js"

export function createReminderRowComponents(descriptionValue: string) {
	const reminderMessageInput = new TextInputBuilder()
		.setCustomId("reminder_message")
		.setLabel("Reminder Message")
		.setStyle(TextInputStyle.Short)
		.setValue(descriptionValue)
	const reminderDateTime = new TextInputBuilder()
		.setCustomId(`time`)
		.setLabel("Reminder Time")
		.setStyle(TextInputStyle.Short)
		.setPlaceholder("Enter any date format.")

	const row = new ActionRowBuilder<TextInputBuilder>().addComponents(reminderMessageInput)
	const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(reminderDateTime)

	return [row, row2]
}
