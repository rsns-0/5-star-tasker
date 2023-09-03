import { DeepLService } from "./deepLService";
import { TranslationServiceErrorFactory } from "../models/translationServiceError";
import { ValidateTranslateTextArgs } from "../types/types";
import { logger } from "../../../logger/logger";

export class TranslationService {
	translationAPI = new DeepLService()
	constructor() {}

	/**
	 * Validates the input text and language code, then translates the text using the DeepL API.
	 * @param props - The arguments for validating and translating the text.
	 * @returns A Promise that resolves to the translated text.
	 */
	public async translateText(props: ValidateTranslateTextArgs){
		const res = await this.translationAPI.validateThenTranslate(props)
		if(res instanceof Error){
			logger.error(res)
			return TranslationServiceErrorFactory.fromError(res)
		}
		return res
	}

}

