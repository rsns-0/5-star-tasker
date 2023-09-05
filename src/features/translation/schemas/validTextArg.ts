import { TRANSLATION_MAX_USER_INPUT_CHARS } from '../configs/languageConfig';
import { z } from 'zod';

export const defaultValidTextSchema = z
	.string()
	.trim()
	.min(1, {
		message: 'Text cannot be empty.'
	})
	.max(TRANSLATION_MAX_USER_INPUT_CHARS, `Text cannot be more than ${TRANSLATION_MAX_USER_INPUT_CHARS} characters.`);

export const deepLLanguages = [
	'BG',
	'CS',
	'DA',
	'DE',
	'EL',
	'EN',
	'EN-GB',
	'EN-US',
	'ES',
	'ET',
	'FI',
	'FR',
	'HU',
	'ID',
	'IT',
	'JA',
	'KO',
	'LT',
	'LV',
	'NB',
	'NL',
	'PL',
	'PT',
	'PT-BR',
	'PT-PT',
	'RO',
	'RU',
	'SK',
	'SL',
	'SV',
	'TR',
	'UK',
	'ZH'
] as const;

export const validLangSchema = z.enum(deepLLanguages).refine(
	() => true,
	(val) => {
		return { message: `${val} is not a valid language.` };
	}
);

export const validTextArgSchema = z.object({
	text: defaultValidTextSchema.array(),
	target_lang: validLangSchema
});
