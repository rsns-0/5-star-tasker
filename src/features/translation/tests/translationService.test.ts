import { TRANSLATION_MAX_USER_INPUT_CHARS } from '../configs/languageConfig';
import { TranslationService } from '../services/translationService';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const service = new TranslationService();

describe('translateText', () => {
	it("should return 'hola mundo' when translating 'hello world' to ES", async () => {
		// test may be flaky given that deepL is an AI service, check returned text if it fails
		const expected = { detectedSourceLanguage: 'EN', text: 'hola mundo' };

		const res = await service.translateText({
			text: ['hello world'],
			targetLanguage: 'ES'
		});
		if (res instanceof Error) {
			throw res;
		}
		const { sourceLanguage: detectedSourceLanguage, text } = res[0];
		expect(detectedSourceLanguage).toBe(expected.detectedSourceLanguage);
		expect(text).toBe(expected.text);
	});

	it('should return error on unaccepted languages', async () => {
		const res = await service.translateText({
			text: ['hello world'],
			targetLanguage: 'XX'
		});
		expect(res instanceof Error).toBe(true);
	});

	it(`should return error when char length >${TRANSLATION_MAX_USER_INPUT_CHARS} by default`, async () => {
		const res = await service.translateText({
			text: 'a'.repeat(TRANSLATION_MAX_USER_INPUT_CHARS + 1),
			targetLanguage: 'ES'
		});
		expect(res instanceof Error).toBe(true);
	});

	it('should return error on text > 250 characters with new schema passed in.', async () => {
		const res = await service.translateText({
			text: 'a'.repeat(251),
			targetLanguage: 'ES',
			textValidationSchema: z.string().min(1).max(250)
		});
		expect(res instanceof Error).toBe(true);
	});
});
