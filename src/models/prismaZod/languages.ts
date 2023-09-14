import * as z from "zod"
import { Completediscord_flag_emojis, relateddiscord_flag_emojisSchema } from "./index"

export const languagesSchema = z.object({
  id: z.bigint(),
  created_at: z.date(),
  name: z.string(),
  iso_639_1: z.string(),
  iso_639_2: z.string(),
  is_supported_by_deep_l: z.boolean().nullish(),
})

export interface Completelanguages extends z.infer<typeof languagesSchema> {
  discord_flag_emojis: Completediscord_flag_emojis[]
}

/**
 * relatedlanguagesSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedlanguagesSchema: z.ZodSchema<Completelanguages> = z.lazy(() => languagesSchema.extend({
  discord_flag_emojis: relateddiscord_flag_emojisSchema.array(),
}))
