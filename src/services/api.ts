import axios from "axios";

// Create axios instance with default config
export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // Important for handling authentication cookies
});

// Add request interceptor to handle auth tokens if needed
api.interceptors.request.use((config) => {
	// You can add auth token logic here if needed
	return config;
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			// You might want to redirect to login or clear auth state
		}
		return Promise.reject(error);
	},
);

export default api;
