import { config } from "dotenv"
import { logger } from "../../../logger/logger"
import { TranslationServiceError } from "../models/translationServiceError"
import {
	TranslateTextProps,
	TranslationData,
	translateTextArgsSchema,
	translationDataSchema,
} from "../schemas/translation"
import { Translator } from "deepl-node"

config()

if (!process.env.DEEPL_KEY) {
	throw new Error("DeepL API key not found.")
}

const translator = new Translator(process.env.DEEPL_KEY)

type TranslationResult<T extends TranslateTextProps> = T extends { throwOnError: true }
	? TranslationData
	: TranslationData | TranslationServiceError

export class TranslationService {
	private deepLService = translator

	public async translate<T extends TranslateTextProps>(props: T): Promise<TranslationResult<T>> {
		try {
			const args = translateTextArgsSchema.parse(props)
			return await this.deepLService
				.translateText(args.text, args.sourceLanguage ?? null, args.targetLanguage)
				.then((s) =>
					translationDataSchema.parse({ ...s, sourceLanguage: s.detectedSourceLang })
				)
		} catch (e) {
			if (e instanceof Error) {
				logger.error(e)
				return TranslationServiceError.fromError(e) as TranslationResult<T>
			}
			throw e
		}
	}
}
