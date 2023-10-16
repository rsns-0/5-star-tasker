import * as z from "zod"
import { Completediscord_channels, relateddiscord_channelsSchema, Completediscord_user, relateddiscord_userSchema, Completewebhooks, relatedwebhooksSchema } from "./index"

export const remindersSchema = z.object({
  created_at: z.date(),
  user_id: z.string(),
  channel_id: z.string(),
  reminder_message: z.string(),
  webhook_id: z.string(),
  id: z.number().int(),
  time: z.date(),
})

export interface Completereminders extends z.infer<typeof remindersSchema> {
  discord_channels: Completediscord_channels
  discord_user: Completediscord_user
  webhook: Completewebhooks
}

/**
 * relatedremindersSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedremindersSchema: z.ZodSchema<Completereminders> = z.lazy(() => remindersSchema.extend({
  discord_channels: relateddiscord_channelsSchema,
  discord_user: relateddiscord_userSchema,
  webhook: relatedwebhooksSchema,
}))
