import { TranslateTextArgs, ValidateTranslateTextArgs } from "../types/types";

import { DeepLService } from "./deepLService";

export class TranslationService {
	constructor(private deepLService: DeepLService = new DeepLService()) {}

	/**
	 * Validates text length <= 500, whether language is available, then calls API to translate.
	 *
	 * @throws {ZodError, AxiosError, ReferenceError}
	 *
	 * Throws Zod error if validation fails. Throws AxiosError if network fails. Throws ReferenceError in the rare event that the API key happens to be missing.
	 * @returns
	 */
	public translateText({ text, targetLanguage }: ValidateTranslateTextArgs) {
		return this.deepLService.validateThenTranslate({ text, targetLanguage });
	}

	/**
	 * Sends text directly to API without validation for translation.
	 *
	 * @throws {AxiosError}
	 * Throws AxiosError if network fails.
	 * @returns
	 */
	public translateTextWithoutValidation({ text, targetLanguage }: TranslateTextArgs) {
		return this.deepLService.sendTranslationDataToAPI({ text, targetLanguage });
	}
}
