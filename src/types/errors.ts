export interface ErrorWithResponse {
	response?: { data?: { message?: string }; status?: number };
	message?: string;
}
