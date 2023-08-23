import {describe, expect, it} from "vitest"

import { TranslationService } from "../services/translationService";
import dotenv from "dotenv"
import { z } from "zod";

dotenv.config() 

const service = new TranslationService()


describe("translateText", () => {

    it("should return 'hola mundo' when translating 'hello world' to ES", async () => {
        // test may be flaky given that deepL is an AI service, check returned text if it fails
        const expected = { detectedSourceLanguage: 'EN', text: 'hola mundo' }
        
        const res = await service.translateText({
            text: ["hello world"],
            targetLanguage: "ES"
        })
        
        const {detectedSourceLanguage, text} = res[0]
        expect(detectedSourceLanguage).toBe(expected.detectedSourceLanguage)
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

    it("should throw on text > 500 chars by default.", () => {
        expect(() => {
            return service.translateText({
                text: "a".repeat(501),
                targetLanguage: "ES"
            })
        }).toThrow()
        
    })

    it("should throw on text > 250 characters with new schema passed in.", () => {
        
        expect(() => {
            return service.translateText({
                text: "a".repeat(251),
                targetLanguage: "ES",
                textValidationSchema: z.string().min(1).max(250)
            })
        }).toThrow()
        
    })
})