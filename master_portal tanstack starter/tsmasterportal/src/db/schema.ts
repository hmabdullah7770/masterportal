import {
	bigint,
	boolean,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

/**
 * API Control registry — PostgreSQL BIGINT identity primary key (production-friendly
 * for large tables). `status` is the enable/disable flag controlled by the row switch.
 */
export const apiEndpoints = pgTable("api_controls", {
	id: bigint("id", { mode: "bigint" })
		.primaryKey()
		.generatedByDefaultAsIdentity(),
	name: text("name").notNull(),
	endpoint: text("endpoint").notNull(),
	category: text("category").notNull().default("Auth"),
	status: boolean("status").notNull().default(true),
	lastUsedAt: timestamp("last_used_at", { withTimezone: true, mode: "date" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
});

export type ApiEndpointRecord = typeof apiEndpoints.$inferSelect;
export type NewApiEndpointRecord = typeof apiEndpoints.$inferInsert;
