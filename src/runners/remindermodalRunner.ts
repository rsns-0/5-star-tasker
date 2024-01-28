import { formDataSchema } from "../models/reminders/reminderModalInput"
import { ModalSubmitInteraction } from "discord.js"
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

		if (date.isErr()) {
			return await this.rejectResponse(
				"You have not yet registered your timezone. Please set your timezone first." as const
			)
		}

		return await date.match({
			err: async () => {
				return await this.rejectResponse(
					"You have not yet registered your timezone. Please set your timezone first." as const
				)
			},
			ok: async (date) => {
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
					content: "Success!",
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
