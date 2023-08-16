import { describe, expect, it } from 'vitest';

import { TranslationPrototype } from '../prototype/translationPrototype';
import dotenv from "dotenv"

dotenv.config()
describe("translation prototype", () => {

    it("should translate text", async () => {
        const expected = { detected_source_language: 'EN', text: 'hola mundo' }
        const res = await TranslationPrototype.main()
        console.log(res)
    })
})