import * as z from "zod"
import { Completediscord_channels, relateddiscord_channelsSchema, Completediscord_guilds, relateddiscord_guildsSchema, Completediscord_user, relateddiscord_userSchema } from "./index"

export const discord_messagesSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  text: z.string(),
  discord_channel_id: z.string().nullish(),
  discord_guild_id: z.string().nullish(),
  owner_id: z.string().nullish(),
})

export interface Completediscord_messages extends z.infer<typeof discord_messagesSchema> {
  discord_channels?: Completediscord_channels | null
  discord_guilds?: Completediscord_guilds | null
  discord_user?: Completediscord_user | null
}

/**
 * relateddiscord_messagesSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateddiscord_messagesSchema: z.ZodSchema<Completediscord_messages> = z.lazy(() => discord_messagesSchema.extend({
  discord_channels: relateddiscord_channelsSchema.nullish(),
  discord_guilds: relateddiscord_guildsSchema.nullish(),
  discord_user: relateddiscord_userSchema.nullish(),
}))
