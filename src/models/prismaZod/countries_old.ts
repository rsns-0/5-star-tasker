import * as z from "zod"

export const countries_oldSchema = z.object({
  id: z.bigint(),
  created_at: z.date(),
  name: z.string(),
  flag_emoji: z.string().nullish(),
  language_id: z.bigint().nullish(),
})
