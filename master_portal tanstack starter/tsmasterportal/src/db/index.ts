import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { DB_NAME } from "./constant";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
	__mp_postgres?: ReturnType<typeof postgres>;
	__mp_drizzle?: DrizzleDb;
};

function getDatabaseUrl(): string {
	const url = process.env.DATABASE_URL;
	if (!url?.trim()) {
		throw new Error(
			"DATABASE_URL is missing. Set it in .env (see .env.example).",
		);
	}
	const baseUrl = url.trim();
	return baseUrl.endsWith("/") ? `${baseUrl}${DB_NAME}` : `${baseUrl}/${DB_NAME}`;
}

/**
 * Server-only Postgres + Drizzle client (singleton in dev to survive HMR).
 * Import this only from `src/server/*` or other server-only code paths.
 */
export function getDb(): DrizzleDb {
	if (globalForDb.__mp_drizzle) {
		return globalForDb.__mp_drizzle;
	}
	const sql = postgres(getDatabaseUrl(), { max: 10 });
	const db = drizzle(sql, { schema });
	globalForDb.__mp_postgres = sql;
	globalForDb.__mp_drizzle = db;
	return db;
}
