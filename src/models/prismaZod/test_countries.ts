import * as z from "zod"

export const test_countriesSchema = z.object({
  id: z.bigint(),
  name: z.string().nullish(),
  iso2: z.string(),
  iso3: z.string().nullish(),
  local_name: z.string().nullish(),
})
