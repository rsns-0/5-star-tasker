import { ApplyOptions } from "@sapphire/decorators"
import type { ModalSubmitInteraction } from "discord.js"

import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework"
import { ReminderModalRunner } from "../runners/remindermodalRunner"
import { reminderModalIdPipeline } from "../models/reminders/reminderModalInput"

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class ModalHandler extends InteractionHandler {
	public async run(interaction: ModalSubmitInteraction, reminderId: number) {
		await new ReminderModalRunner(interaction, reminderId).run()
	}

	public override parse(interaction: ModalSubmitInteraction) {
		const parsed = reminderModalIdPipeline.safeParse(interaction.customId)
		if (!parsed.success) {
			this.container.dbLogger.debug("Failed to parse reminder modal.")
			this.container.dbLogger.debug(interaction)
			return this.none()
		}

		return this.some(parsed.data.reminderId)
	}
}
