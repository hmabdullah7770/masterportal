import { z } from "zod";

export const apiControlCategorySchema = z.string().trim().min(1).max(256);

/** BIGINT primary key serialized as a decimal string over the wire */
export const apiControlRegistryIdSchema = z
	.string()
	.regex(/^[0-9]+$/, "id must be a numeric string");

/** New row: display name, URL path, category, enabled flag */
export const createApiControlItemSchema = z.object({
	name: z.string().trim().min(1).max(256),
	path: z.string().trim().min(1).max(2048),
	category: apiControlCategorySchema,
	status: z.boolean(),
});

/** Edit metadata only (status uses the dedicated server function) */
export const updateApiControlItemSchema = z.object({
	id: apiControlRegistryIdSchema,
	name: z.string().trim().min(1).max(256),
	path: z.string().trim().min(1).max(2048),
	category: apiControlCategorySchema,
});

export const setApiControlItemStatusSchema = z.object({
	id: apiControlRegistryIdSchema,
	status: z.boolean(),
});

export type CreateApiControlItemInput = z.infer<
	typeof createApiControlItemSchema
>;
export type UpdateApiControlItemInput = z.infer<
	typeof updateApiControlItemSchema
>;
export type SetApiControlItemStatusInput = z.infer<
	typeof setApiControlItemStatusSchema
>;
