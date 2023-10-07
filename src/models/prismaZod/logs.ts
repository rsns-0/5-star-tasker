import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const logsSchema = z.object({
  id: z.bigint(),
  created_at: z.date(),
  level: z.number().int(),
  message: z.string(),
  json: jsonSchema,
  tags: z.string().array(),
  unsafe_json: jsonSchema,
})
