import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/auth-slice";

const BASE_URL = "https://jobs-staging.api.growrwanda.com/api/v1";

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const token = state.auth.token;

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			store.dispatch(logout());

			if (typeof window !== "undefined") {
				window.location.href = "/auth?mode=login";
			}
		}

		return Promise.reject(error);
	},
);
