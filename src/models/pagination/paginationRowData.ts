import { ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export function createReminderRowComponent(descriptionValue: string, dateValue: string) {
	const reminderDateTime = new TextInputBuilder()
		.setCustomId(`time`)
		.setLabel("Reminder Time")
		.setStyle(TextInputStyle.Short)
		.setValue(dateValue)
		.setMinLength(2)
		.setPlaceholder("Enter any date format.");
	const reminderMessageInput = new TextInputBuilder()
		.setCustomId("message")
		.setLabel("Reminder Message")
		.setStyle(TextInputStyle.Short)
		.setValue(descriptionValue);

	const row = new ActionRowBuilder<TextInputBuilder>().addComponents([
		reminderMessageInput,
		reminderDateTime,
	]);
	return row;
}
