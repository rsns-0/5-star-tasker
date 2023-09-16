import z from "zod"
import { reminderAPIEmbedSchema } from "../pagination/embedAPI"

export const paginatedMessageActionSchema = z
	.object({
		customId: z.string(),
		style: z.number().optional(),
		type: z.number(),
	})
	.passthrough()

export const paginatedMessageMessageOptionsSchema = z
	.object({
		actions: paginatedMessageActionSchema.passthrough().array().optional(),
		content: z.string().optional(),
		embeds: reminderAPIEmbedSchema.passthrough().array().optional(),
	})
	.passthrough()
