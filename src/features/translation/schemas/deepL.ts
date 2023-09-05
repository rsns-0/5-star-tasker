import { z } from 'zod';

export const deepLDataSchema = z.object({
	detected_source_language: z.string(),
	text: z.string().refine(
		(text) => text.trim().length > 0,
		() => {
			return { message: 'DeepL API returned an empty string.', path: ['text'] };
		}
	)
});

export const deepLResponseSchema = z.object({
	translations: z.array(deepLDataSchema)
});
