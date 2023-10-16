import * as z from "zod"
import { Completediscord_guilds, relateddiscord_guildsSchema } from "./index"

export const discord_channels_duplicateSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date(),
  discord_guild_id: z.string(),
})

export interface Completediscord_channels_duplicate extends z.infer<typeof discord_channels_duplicateSchema> {
  discord_guilds: Completediscord_guilds
}

/**
 * relateddiscord_channels_duplicateSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateddiscord_channels_duplicateSchema: z.ZodSchema<Completediscord_channels_duplicate> = z.lazy(() => discord_channels_duplicateSchema.extend({
  discord_guilds: relateddiscord_guildsSchema,
}))
