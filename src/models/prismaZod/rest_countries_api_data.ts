import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const rest_countries_api_dataSchema = z.object({
  id: z.number().int(),
  cca2: z.string(),
  ccn3: z.string().nullish(),
  cca3: z.string(),
  cioc: z.string().nullish(),
  independent: z.boolean().nullish(),
  unMember: z.boolean(),
  capital: z.string().array(),
  altSpellings: z.string().array(),
  subregion: z.string().nullish(),
  languages: jsonSchema,
  translations: jsonSchema,
  latlng: z.number().array(),
  landlocked: z.boolean(),
  borders: z.string().array(),
  area: z.number(),
  flag: z.string(),
  population: z.number().int(),
  gini: jsonSchema,
  fifa: z.string().nullish(),
  timezones: z.string().array(),
  capitalInfo: jsonSchema,
  car: jsonSchema,
  coatOfArms: jsonSchema,
  flags: jsonSchema,
  idd: jsonSchema,
  maps: jsonSchema,
  name: jsonSchema,
  postalCode: jsonSchema,
  status: z.string(),
  region: jsonSchema,
  continents: jsonSchema.array(),
  startOfWeek: jsonSchema,
  currencies: jsonSchema,
  demonyms: jsonSchema,
})
