import { describe, expect, it } from "vitest"
import { TranslationService, TranslationServiceError } from "../../features/translation"
import "../../lib/setup.js"
describe("TranslationService", () => {
	it("should return hola mundo when translating hello world", async () => {
		const translator = new TranslationService()

		const msg = await translator.translate({
			text: "hello world",
			targetLanguage: "es",
			sourceLanguage: "en",
			throwOnError: false,
		})

		if (msg instanceof Error) {
			expect.fail(msg.message)
		}
		expect(msg.text).toBe("hola mundo")
	})

	it("should have an error when passing in invalid languages", async () => {
		const translator = new TranslationService()
		const input = {
			text: "hello world",
			targetLanguage: "qxzcv",
			sourceLanguage: "wercv",
			throwOnError: false,
		}

		const err = await translator.translate(input)
		expect(err).toBeInstanceOf(TranslationServiceError)
	})

	it("should be able to infer language without providing source language", async () => {
		const translator = new TranslationService()
		const input = {
			text: "hello world",
			targetLanguage: "es",
			sourceLanguage: "en",
			throwOnError: false,
		}

		const res = await translator.translate(input)
		if (res instanceof Error) {
			expect.fail(res.message)
		}
		expect(res.sourceLanguage).toBe("en")
		expect(res.text).toBe("hola mundo")
	})
})
