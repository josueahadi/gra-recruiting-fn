export interface ApiResponse<T> {
	data: T;
	message: string;
	status: number;
}

export interface User {
	id: string;
	email: string;
	name: string;
	role: "USER" | "ADMIN";
}

export interface LoginResponse {
	accessToken: string;
	user: User;
}

export interface AuthCredentials {
	email: string;
	password: string;
}
