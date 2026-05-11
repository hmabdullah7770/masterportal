export type ApiControlCategory = string;

/** One row in the API Control dashboard table (maps to `api_endpoints` in the DB). */
export type ApiControlEndpointRow = {
	id: string;
	name: string;
	endpoint: string;
	category: ApiControlCategory;
	enabled: boolean;
	lastUsed: string;
};
