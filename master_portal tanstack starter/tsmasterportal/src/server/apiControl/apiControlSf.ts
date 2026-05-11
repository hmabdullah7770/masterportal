import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "#/db";
import { apiEndpoints, type ApiEndpointRecord } from "#/db/schema";
import type {
	ApiControlCategory,
	ApiControlEndpointRow,
} from "#/types/apiControlEndpoint";
import {
	createApiControlItemSchema,
	setApiControlItemStatusSchema,
	updateApiControlItemSchema,
} from "./apiControlValidation";

function toRowDto(row: ApiEndpointRecord): ApiControlEndpointRow {
	return {
		id: row.id.toString(),
		name: row.name,
		endpoint: row.endpoint,
		category: row.category as ApiControlCategory,
		enabled: row.status,
		lastUsed: row.lastUsedAt
			? new Date(row.lastUsedAt).toLocaleString()
			: "—",
	};
}

/** List all API Control registry rows (API Control dashboard table). */
export const listApiControlRegistry = createServerFn({ method: "GET" }).handler(
	async (): Promise<ApiControlEndpointRow[]> => {
		const db = getDb();
		const rows = await db
			.select()
			.from(apiEndpoints)
			.orderBy(desc(apiEndpoints.id));
		return rows.map(toRowDto);
	},
);

export const createApiControlItem = createServerFn({ method: "POST" })
	.inputValidator(createApiControlItemSchema)
	.handler(async ({ data }): Promise<ApiControlEndpointRow> => {
		const db = getDb();
		const [inserted] = await db
			.insert(apiEndpoints)
			.values({
				name: data.name,
				endpoint: data.path,
				category: data.category,
				status: data.status,
			})
			.returning();
		if (!inserted) {
			throw new Error("Insert failed");
		}
		return toRowDto(inserted);
	});

export const updateApiControlItem = createServerFn({ method: "POST" })
	.inputValidator(updateApiControlItemSchema)
	.handler(async ({ data }): Promise<ApiControlEndpointRow> => {
		const db = getDb();
		const id = BigInt(data.id);
		const [updated] = await db
			.update(apiEndpoints)
			.set({
				name: data.name,
				endpoint: data.path,
				category: data.category,
				updatedAt: new Date(),
			})
			.where(eq(apiEndpoints.id, id))
			.returning();
		if (!updated) {
			throw new Error("API Control item not found");
		}
		return toRowDto(updated);
	});

export const setApiControlItemStatus = createServerFn({ method: "POST" })
	.inputValidator(setApiControlItemStatusSchema)
	.handler(async ({ data }): Promise<ApiControlEndpointRow> => {
		const db = getDb();
		const id = BigInt(data.id);
		const [updated] = await db
			.update(apiEndpoints)
			.set({
				status: data.status,
				updatedAt: new Date(),
			})
			.where(eq(apiEndpoints.id, id))
			.returning();
		if (!updated) {
			throw new Error("API Control item not found");
		}
		return toRowDto(updated);
	});
