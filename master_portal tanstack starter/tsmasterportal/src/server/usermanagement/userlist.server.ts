// server/usermanagement/userlist.server.ts

import { createServerFn } from "@tanstack/react-start";
import mongoose from "mongoose";

import { connectDB } from "../../db/monogoDB/connection";

import {
	getUsersSchema,
	type GetUsersInput,
} from "./userlistValidation";

import type {
	GetUsersResponse,
	UserRow,
} from "./types/user";

function toUserRow(user: any): UserRow {
	return {
		id: user._id.toString(),
		username: user.username ?? "",
		email: user.email ?? "",
		fullName: user.fullName ?? "",
		createdAt:
			user.createdAt instanceof Date
				? user.createdAt.toISOString()
				: user.createdAt
					? new Date(user.createdAt).toISOString()
					: null,
	};
}

	


/** List users for the User Management dashboard. */
export const getAllUsers = createServerFn({ method: "GET" })
	.inputValidator(getUsersSchema)
	.handler(
		async ({ data }: { data: GetUsersInput }): Promise<GetUsersResponse> => {
			const page = data.page ?? 1;
			const limit = data.limit ?? 20;
			const search = data.search ?? "";
		await connectDB();

			if (!mongoose.connection.db) {
				throw new Error("Database connection not established");
			}

			const collection = mongoose.connection.db.collection("users");

			const query = search
				? {
						$or: [
							{
								username: {
									$regex: search,
									$options: "i",
								},
							},
							{
								email: {
									$regex: search,
									$options: "i",
								},
							},
							{
								fullName: {
									$regex: search,
									$options: "i",
								},
							},
						],
					}
				: {};

			const skip = (page - 1) * limit;

			const [users, total] = await Promise.all([
				collection
					.find(query, {
						projection: {
							password: 0,
							otp: 0,
							refreshToken: 0,
							fcmToken: 0,
						},
					})
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.toArray(),

				collection.countDocuments(query),
			]);

			const userRows: UserRow[] = users.map(toUserRow);

			return {
				users: userRows,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			};
		},
	);