import * as z from "zod"
import { Completediscord_channels, relateddiscord_channelsSchema, Completediscord_channels_duplicate, relateddiscord_channels_duplicateSchema, Completediscord_user, relateddiscord_userSchema, Completediscord_messages, relateddiscord_messagesSchema } from "./index"

export const discord_guildsSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  name: z.string(),
  owner_id: z.string().nullish(),
  iconURL: z.string().nullish(),
})

export interface Completediscord_guilds extends z.infer<typeof discord_guildsSchema> {
  discord_channels: Completediscord_channels[]
  discord_channels_duplicate: Completediscord_channels_duplicate[]
  discord_user?: Completediscord_user | null
  discord_messages: Completediscord_messages[]
  members: Completediscord_user[]
}

/**
 * relateddiscord_guildsSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateddiscord_guildsSchema: z.ZodSchema<Completediscord_guilds> = z.lazy(() => discord_guildsSchema.extend({
  discord_channels: relateddiscord_channelsSchema.array(),
  discord_channels_duplicate: relateddiscord_channels_duplicateSchema.array(),
  discord_user: relateddiscord_userSchema.nullish(),
  discord_messages: relateddiscord_messagesSchema.array(),
  members: relateddiscord_userSchema.array(),
}))
