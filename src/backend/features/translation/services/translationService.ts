import { AxiosError } from 'axios';
import { DeepLService } from './deepLService';
import { ZodError } from 'zod';

type TranslateTextArgs = {
    text:string|string[],
    targetLanguage:string,
    sourceLanguage?:string
}


export class TranslationService{
    
    constructor(
        private deepLService:DeepLService = new DeepLService()
    ){}
    
    /**
     * For each text, validates text length (<= 500) and whether or not target language is in deepL API available types.
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

   
}