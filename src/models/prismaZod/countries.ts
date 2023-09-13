import { continents } from "@prisma/client";
import * as z from "zod";

export const countriesSchema = z.object({
	id: z.bigint(),
	name: z.string().nullish(),
	iso2: z.string(),
	iso3: z.string().nullish(),
	local_name: z.string().nullish(),
	continent: z.nativeEnum(continents).nullish(),
	flag: z.string().nullish(),
});
