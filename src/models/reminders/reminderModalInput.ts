import z from "zod"
import { stringToBigIntPipeline } from "../time/bigIntTransforms"

export const reminderForm = z.object({
	type: z.literal("reminder"),
	reminderId: stringToBigIntPipeline,
})

export const reminderModalIdPipeline = z
	.string()
	.transform((res) => JSON.parse(res))
	.pipe(
		z.object({
			type: z.literal("reminder"),
			reminderId: stringToBigIntPipeline,
		})
	)

export const formDataSchema = z.object({
	reminder_message: z.string(),
	time: z.string(),
})
