import { z } from "zod";

export const defaultValidTextSchema = z.string().trim().min(1,{
  message: "Text cannot be empty."
}).max(500,"Text cannot be more than 500 characters.")


export const deepLLanguages = [
  'BG',
  'CS',
  'DA',
  'DE',
  'EL',
  'EN',
  'EN-GB',
  'EN-US',
  'ES',
  'ET',
  'FI',
  'FR',
  'HU',
  'ID',
  'IT',
  'JA',
  'KO',
  'LT',
  'LV',
  'NB',
  'NL',
  'PL',
  'PT',
  'PT-BR',
  'PT-PT',
  'RO',
  'RU',
  'SK',
  'SL',
  'SV',
  'TR',
  'UK',
  'ZH',
] as const

export const validLangSchema = z.enum(deepLLanguages);

export const validTextArgSchema = z.object({
    text:defaultValidTextSchema.array(),
    target_lang: validLangSchema
})

