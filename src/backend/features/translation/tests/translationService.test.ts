import { ZodError, z } from "zod";
import {describe, expect, it} from "vitest"

import { TranslationService } from "../services/translationService";
import dotenv from "dotenv"

dotenv.config() 

const service = new TranslationService()


describe("translateText", () => {

    it("should return 'hola mundo' when translating 'hello world' to ES", async () => {
        // test may be flaky given that deepL is an AI service, check returned text if it fails
        const expected = { detectedSourceLanguage: 'EN', text: 'hola mundo' }
        
        const res = await service.translateTextWithValidation({
            text: ["hello world"],
            targetLanguage: "ES"
        })
        if(res instanceof Error){
            throw res
        }
        const {detectedSourceLanguage, text} = res[0]
        expect(detectedSourceLanguage).toBe(expected.detectedSourceLanguage)
        expect(text).toBe(expected.text)
        
    })

    it("should return error on unaccepted languages", async () => {
        const res = await service.translateTextWithValidation({
            text: ["hello world"],
            targetLanguage: "XX"
        })
        expect(res instanceof Error).toBe(true)
    })

    it("should return error when char length >500 by default", async() => {
        const res = await service.translateTextWithValidation({
            text: "a".repeat(501),
            targetLanguage: "ES"
        })
        expect(res instanceof Error).toBe(true)
    })

    it("should return error on text > 250 characters with new schema passed in.", async () => {
        
        const res = await service.translateTextWithValidation({
            text: "a".repeat(251),
            targetLanguage: "ES",
            textValidationSchema: z.string().min(1).max(250)
        })
        expect(res instanceof Error).toBe(true)
    })
})