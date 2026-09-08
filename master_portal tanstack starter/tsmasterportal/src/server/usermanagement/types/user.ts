// server/usermanagement/types/user.ts

export interface UserRow {
	id: string;
	username: string;
	email: string;
	fullName: string;
	gender: string;
	age: number | null;
	bio: string;
	avatar: string;
	createdAt: string | null;
}

export interface GetUsersResponse {
	users: UserRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}