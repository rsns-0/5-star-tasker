import z from "zod"
import { stringToBigIntPipeline } from "../time/bigIntTransforms"

export const reminderForm = z.object({
	type: z.literal("reminder"),
	reminderId: stringToBigIntPipeline,
})

export const reminderModalIdPipeline = z
	.string()
	.transform((res, ctx) => {
		try {
			return JSON.parse(res)
		} catch (e) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Invalid JSON",
			})
			return z.NEVER
		}
	})
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
