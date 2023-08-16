import axios, { AxiosInstance } from "axios";

import { deepLResponseSchema } from "../schemas/deepL";
import { DeepLData } from "../schemas/types";

import { Logger } from "@/backend/logger/logger";
import { validLangSchema, validTextSchema } from "../schemas/validTextArg";
import { O } from "ts-toolbelt";

type TranslateTextArgs = {
	text: string[];
	targetLanguage: string;
	
};

type ValidateTranslateTextArgs = O.Overwrite<TranslateTextArgs, { text: string | string[] }>;

function overwrite(originalObject:any, replacementObject:any){
	for (const key in replacementObject){
		const replacementObjectValue = replacementObject[key]
		originalObject[key] = replacementObjectValue
	}
	return originalObject
}

const person1 = {
	name: "john",
	age: 20,
	job: "programmer",
}

const replacementObject = {
	name: "jane",
	age: 44,
}

const res = overwrite(person1, replacementObject)
console.log(res)

export class DeepLService {
	private apiEndpoint = "https://api-free.deepl.com/v2/translate";
	private axiosConfig = { // test fails with static scope
		headers: {
			Authorization: `DeepL-Auth-Key ${process.env.DEEPL_KEY}`,
			"Content-Type": "application/json",
		},
	};
	private client: AxiosInstance = axios.create(this.axiosConfig);

	constructor(private logger: Logger = new Logger()) {}

	public validateThenTranslate({ text, targetLanguage }: ValidateTranslateTextArgs) {
		if(!this.client.defaults.headers.Authorization){
			throw new ReferenceError("Missing deepL API key")
		}
		const cleanText = DeepLService.cleanText(text);
		const cleanLanguage = validLangSchema.parse(targetLanguage);
		return this.sendTranslationDataToAPI({
			text: cleanText,
			targetLanguage: cleanLanguage,
		});
	}

	public async sendTranslationDataToAPI({ text, targetLanguage }: TranslateTextArgs) {
		const body = DeepLService.makeBody(text, targetLanguage);
		try {
			const { data } = await this.client.post<DeepLData>(this.apiEndpoint, body);

			return deepLResponseSchema.parse(data) satisfies DeepLData;
		} catch (e) {
			this.logger.logError(e);
			throw e;
		}
	}

	private static cleanText(textStrOrTextArr: string | string[]) {
		
		const textArr = typeof textStrOrTextArr === "string"
			? [textStrOrTextArr]
			: textStrOrTextArr
		return textArr.map(text => validTextSchema.parse(text));
	}

	private static makeBody(text: string[], targetLanguage: string) {
		return {
			text,
			target_lang: targetLanguage,
		};
	}
}
