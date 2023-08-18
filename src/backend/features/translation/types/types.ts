import { deepLDataSchema, deepLResponseSchema } from "../schemas/deepL";

import { O } from "ts-toolbelt";
import { validLangSchema } from "../schemas/validTextArg";
import { z } from "zod";

export type TranslateTextArgs = {
	text: string[];
	targetLanguage: AvailableLanguages;
};
export type ValidateTranslateTextArgs = O.Overwrite<
	TranslateTextArgs,
	{ text: string | string[]; targetLanguage: string }
>;
export type DeepLDataCollection = z.infer<typeof deepLResponseSchema>;
export type DeepLData = z.infer<typeof deepLDataSchema>;
export type AvailableLanguages = z.infer<typeof validLangSchema>;
