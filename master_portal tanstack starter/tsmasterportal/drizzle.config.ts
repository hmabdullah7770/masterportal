import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DB_NAME } from "./src/db/constant";

const databaseUrl = process.env.DATABASE_URL!;
const url = databaseUrl.endsWith("/") ? `${databaseUrl}${DB_NAME}` : `${databaseUrl}/${DB_NAME}`;

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url,
	},
	strict: true,
	verbose: true,
});
