export interface ErrorWithResponse {
	response?: { data?: { message?: string }; status?: number };
	message?: string;
}

// Shared API error response type for use in error handling
export interface ApiErrorResponse {
	response?: {
		data?: {
			message?: string | Array<string | { field: string; message: string }>;
			errors?: Record<string, string>;
			[key: string]: unknown;
		};
		[key: string]: unknown;
	};
	[key: string]: unknown;
}
