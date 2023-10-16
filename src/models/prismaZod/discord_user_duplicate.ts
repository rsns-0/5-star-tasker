import * as z from "zod"
import { Completetimezones, relatedtimezonesSchema } from "./index"

export const discord_user_duplicateSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  username: z.string().nullish(),
  timezone_id: z.bigint().nullish(),
})

export interface Completediscord_user_duplicate extends z.infer<typeof discord_user_duplicateSchema> {
  timezones?: Completetimezones | null
}

/**
 * relateddiscord_user_duplicateSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateddiscord_user_duplicateSchema: z.ZodSchema<Completediscord_user_duplicate> = z.lazy(() => discord_user_duplicateSchema.extend({
  timezones: relatedtimezonesSchema.nullish(),
}))
