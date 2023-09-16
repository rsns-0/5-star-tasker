import { ApplyOptions } from "@sapphire/decorators";
import type { ModalSubmitInteraction } from "discord.js"

import { InteractionHandler, InteractionHandlerTypes, ok } from "@sapphire/framework"
import { localizedParseTimeInput } from "../services/timezoneService"
import { formDataSchema, reminderModalIdPipeline } from "../models/reminders/reminderModalInput"

function getFormData(interaction: ModalSubmitInteraction) {
	const { fields } = interaction

	const result = {
		reminder_message: fields.getField("reminder_message")?.value,
		time: fields.getField("time")?.value,
	}

	return formDataSchema.parse(result)
}

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class ModalHandler extends InteractionHandler {
	public async run(interaction: ModalSubmitInteraction, reminderId: bigint) {
		const result = await ModalHandler.createReminderDataFromInteraction(interaction)
		if (result.isErr()) {
			throw result
		}

		await this.container.prisma.reminders.update({
			where: {
				id: reminderId,
			},
			data: result.unwrap(),
		})

		await interaction.reply({
			content: "Success!",
			ephemeral: true,
		})
	}

	public static async createReminderDataFromInteraction(interaction: ModalSubmitInteraction) {
		const data = getFormData(interaction)
		const date = await localizedParseTimeInput(data.time, interaction.user.id)
		if (date.isErr()) {
			return date
		}
		return ok({
			reminder_message: data.reminder_message,
			time: date.unwrap().toDate(),
		})
	}

	public override parse(interaction: ModalSubmitInteraction) {
		const parsed = reminderModalIdPipeline.safeParse(interaction.customId)
		if (!parsed.success) return this.none()

		return this.some(parsed.data.reminderId)
	}
}
