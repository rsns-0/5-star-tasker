import { ZodString, z } from 'zod';
import { deepLDataSchema, deepLResponseSchema } from '../schemas/deepL';

import { BuiltIn } from 'ts-toolbelt/out/Misc/BuiltIn';
import { O } from 'ts-toolbelt';
import { validLangSchema } from '../schemas/validTextArg';

export type TranslateTextArgs = {
	text: string[];
	targetLanguage: AvailableLanguages;
};

type ValidateTranslateTextArgsBase = {
	text: string | string[];
	targetLanguage: string;
	textValidationSchema?: ZodString;
};

export type ValidateTranslateTextArgs = O.Merge<TranslateTextArgs, ValidateTranslateTextArgsBase, 'deep', BuiltIn, any>;
export type DeepLDataCollection = z.infer<typeof deepLResponseSchema>;
export type DeepLData = z.infer<typeof deepLDataSchema>;
export type AvailableLanguages = z.infer<typeof validLangSchema>;

export type LanguageAbbreviationStrategy<T, R> = (this: any, input: T) => R;
