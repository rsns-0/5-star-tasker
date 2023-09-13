import z from "zod";
import { reminderAPIEmbedSchema } from "./embedAPI";

export const paginatedMessageActionSchema = z.object({
	customId: z.string(),
	style: z.number().optional(),
	type: z.number(),
});

export const paginatedMessageMessageOptionsSchema = z.object({
	actions: paginatedMessageActionSchema.array().optional(),
	content: z.string().optional(),
	embeds: reminderAPIEmbedSchema.array().optional(),
});
