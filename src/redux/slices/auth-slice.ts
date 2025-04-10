import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	token: null,
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ token: string; user: User }>,
		) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
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

export const { setCredentials, setUser, setLoading, setError, logout } =
	authSlice.actions;

export default authSlice.reducer;
