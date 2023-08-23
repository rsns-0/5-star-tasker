import { TranslateTextArgs, ValidateTranslateTextArgs } from "../types/types";

import { DeepLService } from "./deepLService";

export class TranslationService {
	constructor(private deepLService: DeepLService = new DeepLService()) {}

	/**
	 * @description Sends text to DeepL API for translation after validating text against schema.
	 * 
	 * @param {ValidateTranslateTextArgs} props
	 * @param {string | string[]} props.text - Text to be translated
	 * @param {string} props.targetLanguage - Language to translate to
	 * @param {ZodString} props.textValidationSchema - Optional schema to validate text against
	 * 
	 *
	 * @throws {ZodError, AxiosError, ReferenceError}
	 * Throws Zod error if validation fails. Throws AxiosError if network fails. Throws ReferenceError in the rare event that the API key happens to be missing.
	 * @returns {Promise<TranslationData[]>} - Array of TranslationData objects
	 * @example
	 * const translationService = new TranslationService();
	 * const translationData = await translationService.translateText({
	 * 	text: "Hello world",
	 * 	targetLanguage: "DE",
	 * 	textValidationSchema: z.string().min(1).max(5000),
	 * });
	 */
	public translateText(props: ValidateTranslateTextArgs) {
		return this.deepLService.validateThenTranslate(props);
	}

	/**
	 * Sends text directly to API without validation for translation.
	 *
	 * @throws {AxiosError}
	 * Throws AxiosError if network fails.
	 * @returns
	 */
	public translateTextWithoutValidation(props: TranslateTextArgs) {
		return this.deepLService.sendTranslationDataToAPI(props);
	}
}
