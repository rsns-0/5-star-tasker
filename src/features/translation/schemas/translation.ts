import { z } from "zod"
import { LiteralUnion } from "type-fest"
const TRANSLATION_MAX_USER_INPUT_CHARS = 2000

export const defaultValidTextSchema = z
	.string()
	.trim()
	.min(1, {
		message: "Text cannot be empty.",
	})
	.max(
		TRANSLATION_MAX_USER_INPUT_CHARS,
		`Text cannot be more than ${TRANSLATION_MAX_USER_INPUT_CHARS} characters.`
	)

const sourceLanguageSchema = z.enum([
	"it",
	"id",
	"lt",
	"bg",
	"cs",
	"da",
	"nl",
	"fi",
	"fr",
	"de",
	"el",
	"hu",
	"ja",
	"ko",
	"pl",
	"ro",
	"ru",
	"tr",
	"uk",
	"es",
	"et",
	"lv",
	"nb",
	"sk",
	"sl",
	"sv",
	"zh",
	"en",
	"pt",
])

const targetLanguageSchema = z.enum([
	"bg",
	"cs",
	"da",
	"de",
	"el",
	"es",
	"et",
	"fi",
	"fr",
	"hu",
	"id",
	"it",
	"ja",
	"ko",
	"lt",
	"lv",
	"nb",
	"nl",
	"pl",
	"ro",
	"ru",
	"sk",
	"sl",
	"sv",
	"tr",
	"uk",
	"zh",
	"en-GB",
	"en-US",
	"pt-BR",
	"pt-PT",
])

export const translateTextArgsSchema = z.object({
	text: defaultValidTextSchema,
	targetLanguage: targetLanguageSchema,
	sourceLanguage: sourceLanguageSchema.optional(),
})

export type TranslateTextPropsSchema = z.infer<typeof translateTextArgsSchema>

export type TranslateTextProps = {
	[K in keyof TranslateTextPropsSchema]: TranslateTextPropsSchema[K] extends infer U
		? NonNullable<U> extends string
			? LiteralUnion<U, string>
			: U
		: never
} & {
	throwOnError?: boolean
}

export const translationDataSchema = z.object({
	text: z.string(),
	sourceLanguage: translateTextArgsSchema.shape.sourceLanguage.unwrap(),
})

export type TranslationData = z.infer<typeof translationDataSchema>
