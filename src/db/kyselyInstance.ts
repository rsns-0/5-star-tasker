import { Kysely, PostgresDialect } from "kysely"

import { Pool } from "pg"
import { type DB } from "./types"
import { config } from "dotenv"
config()

export const db2 = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
})
