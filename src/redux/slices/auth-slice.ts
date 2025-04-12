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

const cleanToken = (token: string): string => {
	return token.replace(/^["'](.+)["']$/, "$1").trim();
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		initializeAuth: (state) => {
			if (state.token && !state.isAuthenticated) {
				console.log("[Redux Debug] Initializing auth state from token");
				try {
					// Clean the token first
					const cleanedToken = cleanToken(state.token);
					state.token = cleanedToken;
					state.isAuthenticated = true;
					state.decodedToken = jwtDecode<DecodedToken>(cleanedToken);

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
				}
			}
		},
		setCredentials: (
			state,
			action: PayloadAction<{ token: string; user: User }>,
		) => {
			const cleanedToken = cleanToken(action.payload.token);
			console.log("[Redux Debug] Setting credentials with cleaned token:", {
				originalLength: action.payload.token.length,
				cleanedLength: cleanedToken.length,
				userRole: action.payload.user.role,
			});

			state.token = cleanedToken;
			state.user = action.payload.user;

			try {
				state.decodedToken = jwtDecode<DecodedToken>(cleanedToken);
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
			state.decodedToken = null;
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
