import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";

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
		// Initialize auth state from persisted token
		initializeAuth: (state) => {
			// If we have a token but isAuthenticated is false, fix it
			if (state.token && !state.isAuthenticated) {
				console.log("[Redux Debug] Initializing auth state from token");
				state.isAuthenticated = true;

				try {
					state.decodedToken = jwtDecode<DecodedToken>(state.token);
					console.log("[Redux Debug] Re-initialized auth state with token:", {
						role: state.decodedToken?.role,
						isAuthenticated: state.isAuthenticated,
					});
				} catch (error) {
					console.error(
						"[Redux Debug] Failed to decode token during initialization:",
						error,
					);
					// Token is invalid, reset state
					state.token = null;
					state.isAuthenticated = false;
					state.decodedToken = null;
				}
			}
		},
		setCredentials: (
			state,
			action: PayloadAction<{ token: string; user: User }>,
		) => {
			const cleanToken = action.payload.token.replace(/^["'](.+)["']$/, "$1");
			console.log("[Redux Debug] Processing token:", {
				originalLength: action.payload.token.length,
				cleanedLength: cleanToken.length,
				userRole: action.payload.user.role,
			});

			state.token = cleanToken;
			state.user = action.payload.user;

			try {
				state.decodedToken = jwtDecode<DecodedToken>(cleanToken);
				console.log(
					"[Redux Debug] Successfully decoded token in Redux:",
					state.decodedToken?.role,
				);
			} catch (error) {
				state.decodedToken = null;
				console.error("[Redux Debug] Error decoding token in Redux:", error);
			}

			state.isAuthenticated = true;
			state.error = null;
		},
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.isLoading = false;
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
			state.isAuthenticated = false;
			state.error = null;
		},
	},
});

export const {
	setCredentials,
	setUser,
	setLoading,
	setError,
	logout,
	initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
