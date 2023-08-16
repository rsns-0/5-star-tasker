import {describe, expect, it} from "vitest"

import { TranslationService } from "../services/translationService";
import dotenv from "dotenv"

dotenv.config() 

const service = new TranslationService()


describe("translateText", () => {

    it("should return 'hola mundo' when translating 'hello world' to ES", async () => {
        // test may be flaky given that deepL is an AI service, check returned text if it fails
        const expected = { detected_source_language: 'EN', text: 'hola mundo' }
        
        const res = await service.translateText({
            text: ["hello world"],
            targetLanguage: "ES"
        })
        
        const {detected_source_language, text} = res[0]
        expect(detected_source_language).toBe(expected.detected_source_language)
        expect(text).toBe(expected.text)
        
    })

    it("should throw on unaccepted languages", async () => {
        expect(() => {
            return service.translateText({
                text: ["hello world"],
                targetLanguage: "XX"
            })
        }).toThrow()
    })

    it("should throw on text > 500 chars", () => {
        expect(() => {
            return service.translateText({
                text: "a".repeat(501),
                targetLanguage: "ES"
            })
        }).toThrow()
        
    })
})