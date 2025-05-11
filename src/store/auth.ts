import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";
import {
	cleanToken,
	isTokenExpired,
	getTokenFromCookie,
	syncTokenToCookie,
} from "@/lib/utils/auth-utils";
import { useEffect, useRef } from "react";

interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	phoneNumber?: string;
	isEmailVerified: boolean;
	isTemporary?: boolean;
}

interface AuthState {
	token: string | null;
	user: User | null;
	decodedToken: DecodedToken | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	lastUpdated: number; // Timestamp to track state freshness

	// Actions
	setToken: (token: string) => void;
	setUser: (user: User) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string) => void;
	clearError: () => void;
	logout: () => void;
	initializeAuth: () => void;
}

// Create a storage object that uses localStorage but also syncs with cookies
const createSyncedStorage = () => {
	if (typeof localStorage === "undefined" || typeof document === "undefined") {
		// Return a no-op storage for SSR
		return {
			getItem: () => Promise.resolve(null),
			setItem: () => Promise.resolve(),
			removeItem: () => Promise.resolve(),
		};
	}

	return {
		getItem: async (name: string) => {
			const str = localStorage.getItem(name);
			return str ? JSON.parse(str) : null;
		},

		setItem: async (name: string, value: unknown) => {
			const stringValue = JSON.stringify(value);
			localStorage.setItem(name, stringValue);

			try {
				// @ts-expect-error - We know value has the shape we expect
				if (value?.state?.token) {
					// Set a simple auth-token cookie for server middleware to use
					// @ts-expect-error - We know we can access this property
					document.cookie = `auth-token=${value.state.token}; path=/; max-age=2592000; SameSite=Lax`;
				} else {
					// Clear the cookie if no token
					document.cookie = "auth-token=; path=/; max-age=0";
				}
			} catch (e) {
				console.error("[Auth Store] Error syncing with cookies:", e);
			}
		},

		removeItem: async (name: string) => {
			localStorage.removeItem(name);
			// Clear the auth-token cookie
			document.cookie = "auth-token=; path=/; max-age=0";
		},
	};
};

export function useInitializeAuth() {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const initialized = useRef(false);

	useEffect(() => {
		if (!initialized.current) {
			console.log("[Auth Store] Initializing auth from storage and cookies");
			initializeAuth();
			initialized.current = true;
		}
	}, [initializeAuth]);
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			user: null,
			decodedToken: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			lastUpdated: Date.now(),

			initializeAuth: () => {
				try {
					console.log("[Auth Store] Initializing auth state");

					const storeToken = get().token;
					const cookieToken =
						typeof window !== "undefined" ? getTokenFromCookie() : null;

					// Prefer cookie token over store token, but validate both
					let token = null;
					let validToken = null;

					// Try cookie token first
					if (cookieToken) {
						try {
							const cleaned = cleanToken(cookieToken);
							if (!isTokenExpired(cleaned)) {
								validToken = cleaned;
								token = cookieToken;
							}
						} catch (e) {
							console.warn("[Auth Store] Cookie token invalid:", e);
						}
					}

					// Fall back to store token if cookie token invalid
					if (!validToken && storeToken) {
						try {
							const cleaned = cleanToken(storeToken);
							if (!isTokenExpired(cleaned)) {
								validToken = cleaned;
								token = storeToken;
							}
						} catch (e) {
							console.warn("[Auth Store] Store token invalid:", e);
						}
					}

					if (!validToken) {
						console.log(
							"[Auth Store] No valid auth token found during initialization",
						);
						get().logout();
						return;
					}

					// Clean and validate the token
					try {
						const decodedToken = jwtDecode<DecodedToken>(validToken);

						if (!decodedToken || !decodedToken.role) {
							console.error("[Auth Store] Invalid token structure");
							get().logout();
							return;
						}

						console.log(
							"[Auth Store] Auth token found and valid, setting state",
						);

						set({
							token: validToken,
							decodedToken,
							isAuthenticated: true,
							lastUpdated: Date.now(),
						});

						// Ensure cookie and store are in sync
						syncTokenToCookie(validToken);
					} catch (error) {
						console.error("[Auth Store] Token validation error:", error);
						get().logout();
						return;
					}
				} catch (error) {
					console.error("[Auth Store] Error initializing auth:", error);
					get().logout();
				}
			},

			setToken: (token: string) => {
				if (!token) {
					console.error("[Auth Store] Attempted to set null token");
					set({ error: "Invalid token received" });
					return;
				}

				try {
					console.log("[Auth Store] Setting new token");
					const cleanedToken = cleanToken(token);
					const decodedToken = jwtDecode<DecodedToken>(cleanedToken);

					console.log(
						"[Auth Store] Token decoded successfully, exp:",
						decodedToken.exp,
					);

					// Get the role and determine user type
					const role = decodedToken.role;

					set({
						token: cleanedToken,
						decodedToken,
						isAuthenticated: true,
						error: null,
						lastUpdated: Date.now(),
					});

					const { user } = get();
					if (!user && decodedToken) {
						console.log(
							"[Auth Store] Creating temporary user placeholder with role:",
							role,
						);
						set({
							user: {
								id: decodedToken.id.toString(),
								firstName: "Loading...",
								lastName: "",
								email: "",
								role: role,
								isEmailVerified: false,
								isTemporary: true,
							},
						});
					}
				} catch (error) {
					console.error("[Auth Store] Error decoding token:", error);
					set({
						decodedToken: null,
						error: "Error processing authentication token",
						lastUpdated: Date.now(),
					});
				}
			},

			setUser: (user: User) => {
				console.log("[Auth Store] Setting user with role:", user.role);
				set({
					user,
					error: null,
					lastUpdated: Date.now(),
				});
			},

			setLoading: (isLoading: boolean) => {
				set({
					isLoading,
					...(isLoading ? { error: null } : {}),
					lastUpdated: Date.now(),
				});
			},

			setError: (error: string) => {
				set({
					error,
					isLoading: false,
					lastUpdated: Date.now(),
				});
			},

			clearError: () => {
				set({
					error: null,
					lastUpdated: Date.now(),
				});
			},

			logout: () => {
				console.log("[Auth Store] User logged out, auth state reset");
				set({
					token: null,
					user: null,
					decodedToken: null,
					isAuthenticated: false,
					error: null,
					isLoading: false,
					lastUpdated: Date.now(),
				});
			},
		}),
		{
			name: "gra-auth",
			storage: createSyncedStorage(),
			partialize: (state) => ({
				token: state.token,
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				decodedToken: state.decodedToken,
			}),
		},
	),
);
