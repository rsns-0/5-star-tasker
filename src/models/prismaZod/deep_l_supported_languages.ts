import * as z from "zod"

export const deep_l_supported_languagesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  abbreviation: z.string(),
})
