import * as z from "zod"
import { Completelanguages, relatedlanguagesSchema } from "./index"

export const discord_flag_emojisSchema = z.object({
  id: z.bigint(),
  created_at: z.date(),
  value: z.string(),
  languagesId: z.bigint().nullish(),
})

export interface Completediscord_flag_emojis extends z.infer<typeof discord_flag_emojisSchema> {
  language?: Completelanguages | null
}

/**
 * relateddiscord_flag_emojisSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateddiscord_flag_emojisSchema: z.ZodSchema<Completediscord_flag_emojis> = z.lazy(() => discord_flag_emojisSchema.extend({
  language: relatedlanguagesSchema.nullish(),
}))
