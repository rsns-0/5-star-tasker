import axios, { AxiosError, AxiosInstance } from "axios";
import { defaultValidTextSchema, validLangSchema } from "../schemas/validTextArg";

import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { EnvVarError } from "../../../errors/EnvVarError";
import { UnexpectedAPISchemaError } from "../../../errors/UnexpectedAPISchemaError";
import { TranslationData } from "../models/translationData";
import { deepLResponseSchema } from "../schemas/deepL";
import { DeepLDataCollection, TranslateTextArgs, ValidateTranslateTextArgs } from "../types/types";

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

	public async validateThenTranslate({
		text,
		targetLanguage,
		textValidationSchema,
	}: ValidateTranslateTextArgs) {
		if (!this.client.defaults.headers.Authorization) {
			throw new EnvVarError("DeepL API key not found.");
		}
		const maybeText = DeepLService.cleanText(text, textValidationSchema);
		const maybeTargetLanguage = validLangSchema.safeParse(targetLanguage);
		if (!maybeText.success) {
			return maybeText.error;
		}
		if (!maybeTargetLanguage.success) {
			return maybeTargetLanguage.error;
		}
		const res = await this.sendTranslationDataToAPI({
			text: maybeText.data,
			targetLanguage: maybeTargetLanguage.data,
		});
		return res;
	}

	public async sendTranslationDataToAPI({ text, targetLanguage }: TranslateTextArgs) {
		const body = DeepLService.makeBody(text, targetLanguage);
		let data: DeepLDataCollection;
		try {
			const { data: res } = await this.client.post<DeepLDataCollection>(
				this.apiEndpoint,
				body
			);
			data = res;
		} catch (e) {
			if (e instanceof AxiosError) {
				return e;
			}
			throw e;
		}
		const res = deepLResponseSchema.safeParse(data);
		if (!res.success) {
			throw new UnexpectedAPISchemaError(fromZodError(res.error).message);
		}
		return res.data.translations.map(
			(translationData) => new TranslationData(translationData, targetLanguage)
		);
	}

	private static cleanText(
		textStrOrTextArr: string | string[],
		textValidationSchema = defaultValidTextSchema
	) {
		const textArr =
			typeof textStrOrTextArr === "string" ? [textStrOrTextArr] : textStrOrTextArr;

		return z.array(textValidationSchema).safeParse(textArr);
	}

	private static makeBody(text: string[], targetLanguage: string) {
		return {
			text,
			target_lang: targetLanguage,
		};
	}
}
