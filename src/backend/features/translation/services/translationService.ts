import { AxiosError } from 'axios';
import { DeepLService } from './deepLService';
import { O } from 'ts-toolbelt';
import { ZodError } from 'zod';

type TranslateTextArgs = {
    text:string|string[],
    targetLanguage:string,
    sourceLanguage?:string
}

type TranslateTextWithoutValidationArgs = O.Overwrite<TranslateTextArgs, { text: string[] }>;


export class TranslationService{
    
    constructor(
        private deepLService:DeepLService = new DeepLService()
    ){}
    
    /**
     * Validates text length <= 500, whether language is available, then calls API to translate.
     * 
     * @throws {ZodError, AxiosError, ReferenceError}
     * 
     * Throws Zod error if validation fails. Throws AxiosError if network fails. Throws ReferenceError in the rare event that the API key happens to be missing.
     * @returns 
     */
    public translateText({text,targetLanguage}:TranslateTextArgs){
        return this.deepLService.validateThenTranslate({text,targetLanguage})
            .then(res => res.translations)
    }


    /**
     * Sends text directly to API without validation for translation.
     * 
     * @throws {AxiosError}
     * Throws AxiosError if network fails.
     * @returns 
     */
    public translateTextWithoutValidation({text,targetLanguage}:TranslateTextWithoutValidationArgs){
        return this.deepLService.sendTranslationDataToAPI({text,targetLanguage})
            .then(res => res.translations)
    }

   
}