import { AvailableLanguages, DeepLData } from "../types/types";

export class TranslationData{
    
    constructor(
        private data:DeepLData,
        private targetLang:AvailableLanguages
    ){}
    
    public get text(){
        return this.data.text
    }

    public get detectedSourceLanguage(){
        return this.data.detected_source_language
    }

    public get targetLanguage(){
        return this.targetLang
    }

}