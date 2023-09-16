import { AvailableLanguages, DeepLData } from "../types/types";

export class TranslationData {
	private data: DeepLData;
	private targetLang: AvailableLanguages;
	constructor(data: DeepLData, targetLang: AvailableLanguages) {
		this.data = data;
		this.targetLang = targetLang;
	}

	public get text() {
		return this.data.text;
	}

	public get sourceLanguage() {
		return this.data.detected_source_language;
	}

	public get targetLanguage() {
		return this.targetLang;
	}
}
