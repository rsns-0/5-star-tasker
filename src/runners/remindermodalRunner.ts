import { formDataSchema } from "../models/reminders/reminderModalInput"
import { ModalSubmitInteraction, time as toTime } from "discord.js"
import { container } from "@sapphire/framework"
import { mapModalToSchema } from "../utils/utils"

export class ReminderModalRunner {
	constructor(
		public interaction: ModalSubmitInteraction,
		public reminderId: number
	) {}

	async run() {
		const { interaction, reminderId } = this
		const { time, reminder_message } = mapModalToSchema(interaction, formDataSchema)
		if (time === "0") {
			return await this.deleteReminder()
		}

		const date = await container.prisma.discord_user.localizedParseTimeInput(
			time,
			interaction.user.id
		)

		return await date.match({
			err: async () => {
				return await this.rejectResponse(
					"You have not yet registered your timezone. Please set your timezone first." as const
				)
			},
			ok: async (date) => {
				const reminder = await container.prisma.reminders.findUnique({
					where: {
						id: reminderId,
					},
				})
				if (!reminder) {
					await interaction.reply({
						content:
							"The reminder you are trying to update does not exist. Did you try to update a reminder that was just sent to you?",
						ephemeral: true,
					})
				}
				await container.prisma.reminders.update({
					select: { id: true },
					where: {
						id: reminderId,
					},
					data: {
						time: date.toDate(),
						reminder_message,
					},
				})
				return await interaction.reply({
					content: `Success! Your reminder will be sent to you at ${toTime(
						date.toDate()
					)} with the message:\n\n\`${reminder_message}\``,
					ephemeral: true,
				})
			},
		})
	}

	async deleteReminder() {
		const { reminderId, interaction } = this
		await container.prisma.reminders.delete({
			select: { id: true },
			where: {
				id: reminderId,
			},
		})
		return await interaction.reply({
			content: "Success!",
			ephemeral: true,
		})
	}

	async rejectResponse(message: string) {
		return await this.interaction.reply({
			content: message,
			ephemeral: true,
		})
	}
}
