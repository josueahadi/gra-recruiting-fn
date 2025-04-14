/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/auth-slice";
import { cleanToken, isTokenExpired } from "@/lib/utils/auth-utils";

const BASE_URL = "https://jobs-staging.api.growrwanda.com";

let isLoggingOut = false;

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000,
});

const handleAuthError = () => {
	if (isLoggingOut) return;

	isLoggingOut = true;
	store.dispatch(logout());

	if (typeof window !== "undefined") {
		window.location.href = "/auth?mode=login";

		setTimeout(() => {
			isLoggingOut = false;
		}, 1000);
	}
};

api.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const token = state.auth.token;

		if (process.env.NODE_ENV === "development") {
			console.log(
				`[API Request] ${config.method?.toUpperCase()} ${config.url}`,
			);
		}

		if (token) {
			if (isTokenExpired(token)) {
				console.log("[API] Token expired or about to expire, logging out");
				handleAuthError();
				return Promise.reject(
					new Error("Session expired. Please login again."),
				);
			}

			const cleanedToken = cleanToken(token);
			config.headers.Authorization = `Bearer ${cleanedToken}`;

			if (process.env.NODE_ENV === "development") {
				console.log(
					"[API] Making request with auth token:",
					config.method?.toUpperCase(),
					config.url,
				);
			}
		}
		return config;
	},
	(error) => {
		console.error("[API] Request configuration error:", error);
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => {
		if (process.env.NODE_ENV === "development") {
			console.log(
				`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`,
			);
		}
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (!error.response) {
			console.error("[API] Network error:", error.message);
			return Promise.reject(
				new Error("Network error. Please check your connection."),
			);
		}

		let errorMessage = "An unexpected error occurred";
		let errorDetails = null;

		if (error.response?.data) {
			if (error.response.data.message) {
				errorMessage = error.response.data.message;
				errorDetails = {
					statusCode: error.response.data.statusCode,
					error: error.response.data.error,
					message: error.response.data.message,
				};
				console.log("[API] Structured error response:", errorDetails);
			}
		}

		if (error.response.status === 401 && !originalRequest._retry) {
			console.log("[API] 401 Unauthorized response, logging out");
			originalRequest._retry = true;
			handleAuthError();
		}

		if (error.response.status === 403) {
			console.error("[API] 403 Forbidden response:", error);
			errorMessage = "You do not have permission to access this resource.";
			errorDetails = {
				statusCode: error.response.status,
				error: error.response.data.error,
				message: error.response.data.message,
			};
		}

		if (error.response.status === 404) {
			console.error("[API] 404 Not Found response:", error);
			errorMessage = "The requested resource was not found.";
			errorDetails = {
				statusCode: error.response.status,
				error: error.response.data.error,
				message: error.response.data.message,
			};
		}

		if (error.response.status === 500) {
			console.error("[API] 500 Internal Server Error response:", error);
			errorMessage = "An internal server error occurred.";
			errorDetails = {
				statusCode: error.response.status,
				error: error.response.data.error,
				message: error.response.data.message,
			};
		} else if (error.response.status === 422) {
			console.error("[API] 422 Unprocessable Entity response:", error);
			errorMessage = "Validation error occurred.";
			errorDetails = {
				statusCode: error.response.status,
				error: error.response.data.error,
				message: error.response.data.message,
			};
		}

		if (error.response.status === 400) {
			console.error("[API] 400 Bad Request response:", error);
			errorMessage = "Bad request. Please check your input.";
			errorDetails = {
				statusCode: error.response.status,
				error: error.response.data.error,
				message: error.response.data.message,
			};
		}

		if (error.response.status === 429) {
			console.error("[API] 429 Too Many Requests response:", error);
			errorMessage = "Too many requests. Please try again later.";
			errorDetails = {
				statusCode: error.response.status,
				error: error.response.data.error,
				message: error.response.data.message,
			};
		}

		error.displayMessage = errorMessage;
		error.errorDetails = errorDetails;

		return Promise.reject(error);
	},
);

export const handleApiError = (
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	error: any,
	fallbackMessage = "An error occurred",
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): { message: string; details: any | null } => {
	const errorResponse = {
		message: fallbackMessage,
		details: null,
	};

	if (error.errorDetails) {
		errorResponse.details = error.errorDetails;
	}

	if (error.displayMessage) {
		errorResponse.message = error.displayMessage;
		return errorResponse;
	}

	if (error.response?.data?.message) {
		errorResponse.message = error.response.data.message;
		errorResponse.details = {
			statusCode: error.response.data.statusCode,
			error: error.response.data.error,
		};
		return errorResponse;
	}

	if (error.message) {
		errorResponse.message = error.message;
	}

	return errorResponse;
};
