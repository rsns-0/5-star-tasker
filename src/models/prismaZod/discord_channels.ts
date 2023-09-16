import * as z from "zod"
import { Completediscord_guilds, relateddiscord_guildsSchema, Completediscord_messages, relateddiscord_messagesSchema, Completereminders, relatedremindersSchema, Completewebhooks, relatedwebhooksSchema } from "./index"

export const discord_channelsSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date(),
  discord_guild_id: z.string().nullish(),
})

export interface Completediscord_channels extends z.infer<typeof discord_channelsSchema> {
  discord_guilds?: Completediscord_guilds | null
  discord_messages: Completediscord_messages[]
  reminders: Completereminders[]
  webhooks: Completewebhooks[]
}

/**
 * relateddiscord_channelsSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateddiscord_channelsSchema: z.ZodSchema<Completediscord_channels> = z.lazy(() => discord_channelsSchema.extend({
  discord_guilds: relateddiscord_guildsSchema.nullish(),
  discord_messages: relateddiscord_messagesSchema.array(),
  reminders: relatedremindersSchema.array(),
  webhooks: relatedwebhooksSchema.array(),
}))
