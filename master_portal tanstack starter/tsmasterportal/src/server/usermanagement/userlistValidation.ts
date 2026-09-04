// server/usermanagement/userlistValidation.ts

import { z } from "zod";

export const getUsersSchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().max(100).optional(),
	search: z.string().trim().optional(),
});

export type GetUsersInput = z.infer<typeof getUsersSchema>;