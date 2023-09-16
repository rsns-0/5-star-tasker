import * as z from "zod"

export const test_paginationSchema = z.object({
  id: z.bigint(),
  created_at: z.date(),
  name: z.string().nullish(),
  value: z.bigint().nullish(),
  text: z.string().nullish(),
})
