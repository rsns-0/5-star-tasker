import { z } from "zod";

export const deepLDataSchema = z.object({
	detected_source_language: z.string(),
	text: z.string(),
});

export const deepLResponseSchema = z.object({
	translations: z.array(deepLDataSchema),
});
