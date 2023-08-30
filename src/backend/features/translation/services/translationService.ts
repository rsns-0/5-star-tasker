import { DeepLService } from "./deepLService";
import { Logger } from "@/backend/logger/logger";
import { TranslationServiceErrorFactory } from "../models/translationServiceError";
import { ValidateTranslateTextArgs } from "../types/types";

export class TranslationService {
	
	constructor(private deepLService = new DeepLService(), private logger = new Logger()) {}

	/**
	 * Validates the input text and language code, then translates the text using the DeepL API.
	 * @param props - The arguments for validating and translating the text.
	 * @returns A Promise that resolves to the translated text.
	 */
	public async translateText(props: ValidateTranslateTextArgs){
		const res = await this.deepLService.validateThenTranslate(props)
		if(res instanceof Error){
			this.logger.logError(res)
			return TranslationServiceErrorFactory.fromError(res)
		}
		return res
	}

}

