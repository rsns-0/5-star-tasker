import z from "zod"
import { APIEmbedSchema } from "../pagination/embedAPI"

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
		embeds: APIEmbedSchema.passthrough().array().optional(),
	})
	.passthrough()
