import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ModalSubmitInteraction } from "discord.js";
import z from "zod";
import { timeStringToDayjsObj } from "../features/reminders/services/stringToDayjsObj";
import { stringToBigIntPipeline } from "../transforms/timeUtils/bigIntHelpers";

const reminderModalIdPipeline = z
	.string()
	.transform((res) => JSON.parse(res))
	.pipe(
		z.object({
			type: z.literal("reminder"),
			reminderId: stringToBigIntPipeline,
		})
	);

const formDataSchema = z.object({
	reminder_message: z.string(),
	time: z.string(),
});

function getFormData(interaction: ModalSubmitInteraction) {
	const { fields } = interaction;

	const result = Object.keys(formDataSchema.shape).reduce(
		(acc, curr) => {
			acc[curr] = fields.getField(curr);
			return acc;
		},
		{} as Record<string, any>
	);
	return formDataSchema.parse(result);
}

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class ModalHandler extends InteractionHandler {
	public async run(interaction: ModalSubmitInteraction, reminderId: bigint) {
		const data = getFormData(interaction);
		const timezone = await this.container.prisma.discord_user.getUserTimezone(interaction.user);
		if (timezone.isErr()) {
			// TODO: Handle user error
			throw timezone;
		}

		const date = timeStringToDayjsObj(data.time, timezone.unwrap());
		await this.container.prisma.reminders.update({
			where: {
				id: reminderId,
			},
			data: { ...data, time: date.toDate() },
		});

		await interaction.reply({
			content: "Success!",
			ephemeral: true,
		});
	}

	public override parse(interaction: ModalSubmitInteraction) {
		const parsed = reminderModalIdPipeline.safeParse(interaction.customId);
		if (!parsed.success) return this.none();

		return this.some(parsed.data.reminderId);
	}
}
