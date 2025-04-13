/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/auth-slice";
import { cleanToken, isTokenExpired } from "@/lib/utils/auth-utils";

const BASE_URL = "https://jobs-staging.api.growrwanda.com";

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000,
});

let isLoggingOut = false;

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
		console.error("[API] Request error:", error);
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

		if (error.response.status === 401 && !originalRequest._retry) {
			console.log("[API] 401 Unauthorized response, logging out");
			originalRequest._retry = true;
			handleAuthError();
		}

		if (error.response.status === 403 && !originalRequest._retry) {
			console.error("[API] 403 Forbidden - Permission denied");
		}

		if (error.response.status === 404) {
			console.error("[API] 404 Not Found:", originalRequest.url);
		}

		if (error.response.status >= 500) {
			console.error(
				"[API] Server error:",
				error.response.status,
				error.response.data,
			);
		}

		return Promise.reject(error);
	},
);

export const handleApiError = (
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	error: any,
	fallbackMessage = "An error occurred",
) => {
	if (error.response?.data?.message) {
		return error.response.data.message;
	}

	if (error.message) {
		return error.message;
	}

	return fallbackMessage;
};
