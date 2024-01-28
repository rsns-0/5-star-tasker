import { z } from "zod"
import { deepLDataSchema, deepLResponseSchema } from "../schemas/deepL"

export type DeepLDataCollection = z.infer<typeof deepLResponseSchema>
export type DeepLData = z.infer<typeof deepLDataSchema>

export type LanguageAbbreviationStrategy<T, R> = (this: any, input: T) => R
