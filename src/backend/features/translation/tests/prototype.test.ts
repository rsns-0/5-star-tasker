import { describe, expect, it } from 'vitest';

import { TranslationPrototype } from '../prototype/translationPrototype';
import dotenv from "dotenv"

dotenv.config()
describe("translation prototype", () => {

    it("should translate text", async () => {
        const expected = { detected_source_language: 'EN', text: 'hola mundo' }
        const res = await TranslationPrototype.main()
        const {text, detected_source_language} = res.translations[0]
        expect(text).toEqual(expected.text)
        expect(detected_source_language).toEqual(expected.detected_source_language)
        
        
    })
})