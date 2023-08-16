import { z } from "zod";

export const validTextSchema = z.string().min(1).max(500)

export const validLangSchema = z.union([
    z.literal('BG'),
    z.literal('CS'),
    z.literal('DA'),
    z.literal('DE'),
    z.literal('EL'),
    z.literal('EN'),
    z.literal('EN-GB'),
    z.literal('EN-US'),
    z.literal('ES'),
    z.literal('ET'),
    z.literal('FI'),
    z.literal('FR'),
    z.literal('HU'),
    z.literal('ID'),
    z.literal('IT'),
    z.literal('JA'),
    z.literal('KO'),
    z.literal('LT'),
    z.literal('LV'),
    z.literal('NB'),
    z.literal('NL'),
    z.literal('PL'),
    z.literal('PT'),
    z.literal('PT-BR'),
    z.literal('PT-PT'),
    z.literal('RO'),
    z.literal('RU'),
    z.literal('SK'),
    z.literal('SL'),
    z.literal('SV'),
    z.literal('TR'),
    z.literal('UK'),
    z.literal('ZH'),
])

export const validTextArgSchema = z.object({
    text:validTextSchema.array(),
    target_lang: validLangSchema
})
