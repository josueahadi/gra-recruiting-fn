import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";
import { cleanToken } from "@/lib/utils/auth-utils";

interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	phoneNumber?: string;
	isEmailVerified: boolean;
}

interface AuthState {
	token: string | null;
	user: User | null;
	decodedToken: DecodedToken | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	token: null,
	user: null,
	decodedToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		initializeAuth: (state) => {
			if (state.token) {
				console.log("[Redux Debug] Initializing auth state from token");
				try {
					if (typeof state.isAuthenticated === "string") {
						state.isAuthenticated = state.isAuthenticated === "true";
					}

					const cleanedToken = cleanToken(state.token);
					state.token = cleanedToken;
					state.isAuthenticated = true;

					if (typeof state.decodedToken === "string") {
						try {
							state.decodedToken = JSON.parse(state.decodedToken);
						} catch (e) {
							console.error(
								`[Redux Debug] Failed to parse decodedToken string, decoding from token: ${e}`,
							);
							state.decodedToken = jwtDecode<DecodedToken>(cleanedToken);
						}
					} else if (!state.decodedToken) {
						state.decodedToken = jwtDecode<DecodedToken>(cleanedToken);
					}

					if (typeof state.user === "string") {
						try {
							state.user = JSON.parse(state.user);
						} catch (e) {
							console.error(`[Redux Debug] Failed to parse user string: ${e}`);
							state.user = null;
						}
					}

					state.error = null;

					console.log("[Redux Debug] Re-initialized auth state with token:", {
						role: state.decodedToken?.role,
						isAuthenticated: state.isAuthenticated,
					});
				} catch (error) {
					console.error(
						"[Redux Debug] Failed to decode token during initialization:",
						error,
					);
					state.token = null;
					state.isAuthenticated = false;
					state.decodedToken = null;
					state.user = null;
					state.error = "Session invalid. Please login again.";
				}
			}
		},

		setToken: (state, action: PayloadAction<string>) => {
			if (!action.payload) {
				state.error = "Invalid token received";
				return;
			}

			const cleanedToken = cleanToken(action.payload);
			console.log("[Redux Debug] Setting token:", {
				originalLength: action.payload.length,
				cleanedLength: cleanedToken.length,
			});

			state.token = cleanedToken;
			state.isAuthenticated = true;
			state.error = null;

			try {
				state.decodedToken = jwtDecode<DecodedToken>(cleanedToken);
				console.log(
					"[Redux Debug] Decoded token in Redux:",
					state.decodedToken,
				);

				if (!state.user && state.decodedToken) {
					state.user = {
						id: state.decodedToken.id.toString(),
						firstName: "User",
						lastName: "",
						email: "",
						role: state.decodedToken.role,
						isEmailVerified: false,
					};
					console.log("[Redux Debug] Created minimal user from token");
				}
			} catch (error) {
				state.decodedToken = null;
				state.error = "Error processing authentication token";
				console.error("[Redux Debug] Error decoding token in Redux:", error);
			}
		},

		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.error = null;
			console.log("[Redux Debug] User data set:", action.payload.email);
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
			if (action.payload === true) {
				state.error = null;
			}
		},

		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.isLoading = false;
		},

		clearError: (state) => {
			state.error = null;
		},

		logout: (state) => {
			state.token = null;
			state.user = null;
			state.decodedToken = null;
			state.isAuthenticated = false;
			state.error = null;
			state.isLoading = false;
			console.log("[Redux Debug] User logged out, auth state reset");
		},
	},
});

export const {
	setToken,
	setUser,
	setLoading,
	setError,
	clearError,
	logout,
	initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
