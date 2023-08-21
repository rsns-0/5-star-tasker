import axios, { AxiosInstance } from "axios";
import { validLangSchema, validTextSchema } from "../schemas/validTextArg";

import { DeepLDataCollection } from "../types/types";
import { Logger } from "@/backend/logger/logger";
import { TranslateTextArgs } from "../types/types";
import { TranslationData } from "../models/translationData";
import { ValidateTranslateTextArgs } from "../types/types";
import { deepLResponseSchema } from "../schemas/deepL";

export class DeepLService {
	private apiEndpoint = "https://api-free.deepl.com/v2/translate";
	private axiosConfig = {
		// test fails with static scope
		headers: {
			Authorization: `DeepL-Auth-Key ${process.env.DEEPL_KEY}`,
			"Content-Type": "application/json",
		},
	};
	private client: AxiosInstance = axios.create(this.axiosConfig);

	constructor(private logger: Logger = new Logger()) {}

	public validateThenTranslate({ text, targetLanguage, textValidationSchema }: ValidateTranslateTextArgs) {
		if (!this.client.defaults.headers.Authorization) {
			throw new ReferenceError("Missing deepL API key");
		}
		const cleanText = DeepLService.cleanText(text, textValidationSchema);
		const cleanLanguage = validLangSchema.parse(targetLanguage);
		return this.sendTranslationDataToAPI({
			text: cleanText,
			targetLanguage: cleanLanguage,
		});
	}

	public async sendTranslationDataToAPI({ text, targetLanguage }: TranslateTextArgs) {
		const body = DeepLService.makeBody(text, targetLanguage);
		try {
			const { data } = await this.client.post<DeepLDataCollection>(this.apiEndpoint, body);

			return deepLResponseSchema
				.parse(data)
				.translations.map((translationData) => new TranslationData(translationData, targetLanguage));
		} catch (e) {
			this.logger.logError(e);
			throw e;
		}
	}

	private static cleanText(textStrOrTextArr: string | string[], textValidationSchema = validTextSchema) {
		const textArr = typeof textStrOrTextArr === "string" ? [textStrOrTextArr] : textStrOrTextArr;
		return textArr.map((text) => textValidationSchema.parse(text));
	}

	private static makeBody(text: string[], targetLanguage: string) {
		return {
			text,
			target_lang: targetLanguage,
		};
	}
}
