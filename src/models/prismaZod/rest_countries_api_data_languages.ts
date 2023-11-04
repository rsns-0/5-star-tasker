import * as z from "zod"

export const rest_countries_api_data_languagesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  abbreviation: z.string(),
})
