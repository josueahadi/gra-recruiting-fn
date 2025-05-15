"use client";

import { api } from "@/services/api";
import type { ApiError } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import {
	cleanToken,
	isProtectedRoute,
	getRoleFromToken,
	isAdminRole,
	isTokenExpired,
	type UserType,
	formatUserName,
	syncTokenToCookie,
} from "@/lib/utils/auth-utils";
import { showToast } from "@/services/toast";
import type { ErrorWithResponse, ApiErrorResponse } from "@/types/errors";
import type { SignInResponse } from "@/types/auth";

interface UseAuthOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

interface SignInCredentials {
	email: string;
	password: string;
}

interface SignUpData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phoneNumber: string;
	career?: string;
	levelOfEducation?: string;
	university?: string;
	graduationDate?: string;
	major?: string;
	linkedinProfileUrl?: string;
	githubProfileUrl?: string;
}

interface UserProfileResponse {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	careerName?: string;
	linkedinProfileUrl?: string;
	githubProfileUrl?: string;
	resumeURL?: string;
	levelOfEducation?: string;
	university?: string;
	graduationDate?: string;
	createdAt: string;
	updatedAt: string;
	profileUpdatedAt: string | null;
}

interface FieldError extends Error {
	fieldErrors?: Record<string, string>;
}

export const useAuth = (options?: UseAuthOptions) => {
	const [showPassword, setShowPassword] = useState(false);
	const [userType, setUserType] = useState<UserType>("applicant");
	const router = useRouter();
	const queryClient = useQueryClient();

	const {
		token,
		user,
		isAuthenticated,
		isLoading,
		error,
		setToken,
		setUser,
		setLoading,
		setError,
		clearError: storeClearError,
		logout: storeLogout,
		initializeAuth: storeInitializeAuth,
	} = useAuthStore();

	const logout = useCallback(() => {
		storeLogout();
	}, [storeLogout]);

	const clearError = useCallback(() => {
		storeClearError();
	}, [storeClearError]);

	const initializeAuth = useCallback(() => {
		storeInitializeAuth();
	}, [storeInitializeAuth]);

	useEffect(() => {
		if (token && isTokenExpired(token)) {
			console.log("[Auth] Token expired, logging out");
			showToast("Your session has expired. Please sign in again.", {
				type: "error",
			});
			logout();
		}
	}, [token, logout]);

	useEffect(() => {
		if (token) {
			const role = getRoleFromToken(token);
			setUserType(isAdminRole(role) ? "admin" : "applicant");
		}
	}, [token]);

	useEffect(() => {
		console.log("[useAuth] Component mounted, initializing auth...");
		initializeAuth();
	}, [initializeAuth]);

	const handleAuth = useCallback(
		(type: "login" | "signup") => {
			router.push(`/auth?mode=${type}`);
		},
		[router],
	);

	const handleRedirect = useCallback(
		(authToken: string) => {
			const role = getRoleFromToken(authToken);

			const redirectPath = isAdminRole(role)
				? "/admin/dashboard"
				: "/applicant/dashboard";

			console.log("[useAuth] Redirecting to:", redirectPath);
			router.replace(redirectPath);

			options?.onSuccess?.();
		},
		[router, options],
	);

	const fetchUserProfile = useCallback(
		async (retryCount = 0): Promise<UserProfileResponse | null> => {
			const currentToken = useAuthStore.getState().token;

			if (!currentToken) {
				console.error(
					"[useAuth] fetchUserProfile called but no token in store",
				);
				return null;
			}

			const MAX_RETRIES = 2;

			try {
				console.log(
					"[useAuth] Making API request to fetch user profile with token:",
					`${currentToken.substring(0, 10)}...`,
				);

				const { data } = await api.get<UserProfileResponse>(
					"/api/v1/users/view-profile",
					{
						headers: {
							Authorization: `Bearer ${cleanToken(currentToken)}`,
						},
					},
				);

				console.log("[useAuth] Successfully fetched user profile:", {
					id: data.id,
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
				});

				const userData = {
					id: data.id.toString(),
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					role: getRoleFromToken(currentToken) || "USER",
					phoneNumber: data.phoneNumber,
					isEmailVerified: true,
					isTemporary: false,
				};

				console.log("[useAuth] Setting user data in store");
				setUser(userData);
				return data;
			} catch (error: unknown) {
				const apiError = error as ApiErrorResponse;
				console.error(
					`[useAuth] Error fetching user profile (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`,
					apiError.response?.data?.statusCode,
					apiError.response?.data,
				);

				if (apiError.response?.data?.statusCode === 401) {
					console.error(
						"[useAuth] Unauthorized error fetching profile, token may be invalid",
					);
					return null;
				}

				if (retryCount < MAX_RETRIES) {
					const delay = 2 ** retryCount * 500;
					console.log(`[useAuth] Retrying profile fetch in ${delay}ms...`);
					await new Promise((resolve) => setTimeout(resolve, delay));
					return fetchUserProfile(retryCount + 1);
				}

				showToast(
					"Could not load your profile. Some features may be limited.",
					{
						type: "error",
					},
				);
				throw error;
			}
		},
		[setUser],
	);

	const signIn = async (credentials: SignInCredentials) => {
		try {
			setLoading(true);
			clearError();

			console.log("[Auth] Signing in with:", credentials.email);

			let response: { data: SignInResponse };
			try {
				response = await api.post("/api/v1/auth/signin", credentials);
			} catch (error: unknown) {
				let errorMessage = "Invalid email or password";
				if (typeof error === "object" && error !== null) {
					if (
						"response" in error &&
						typeof (error as ErrorWithResponse).response?.data?.message ===
							"string"
					) {
						errorMessage =
							(error as ErrorWithResponse).response?.data?.message ??
							errorMessage;
					} else if (
						"message" in error &&
						typeof (error as ErrorWithResponse).message === "string"
					) {
						errorMessage = (error as ErrorWithResponse).message ?? errorMessage;
					}
				}
				console.error("[Auth] API signin error:", error);
				throw new Error(errorMessage);
			}

			const { accessToken } = response.data;

			if (!accessToken) {
				throw new Error("No access token received");
			}

			try {
				const role = getRoleFromToken(accessToken);
				if (!role) {
					throw new Error("Invalid token received");
				}
			} catch (error) {
				console.error("[Auth] Token validation failed:", error);
				throw new Error("Invalid authentication token received");
			}

			console.log("[Auth] Successfully signed in");

			syncTokenToCookie(accessToken);
			setToken(accessToken);

			api.defaults.headers.common.Authorization = `Bearer ${cleanToken(accessToken)}`;

			await new Promise((resolve) => setTimeout(resolve, 100));

			try {
				console.log(
					"[Auth] Fetching user profile with token:",
					`${accessToken.substring(0, 10)}...`,
				);
				const profile = await fetchUserProfile();

				if (!profile) {
					throw new Error("Failed to load user profile");
				}

				if (profile.email.toLowerCase() !== credentials.email.toLowerCase()) {
					throw new Error("Profile mismatch detected");
				}

				const role = getRoleFromToken(accessToken);
				const redirectPath = isAdminRole(role)
					? "/admin/dashboard"
					: "/applicant/dashboard";

				console.log("[Auth] Redirecting to:", redirectPath);
				router.replace(redirectPath);

				if (options?.onSuccess) {
					options.onSuccess();
				}
			} catch (error) {
				console.error("[Auth] Error after signin:", error);
				throw error;
			}
		} catch (error: unknown) {
			console.error("[Auth] Signin error:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Login failed. Please try again.";
			setError(errorMessage);
			showToast(errorMessage, { type: "error" });

			logout();
			queryClient.removeQueries({ queryKey: ["current-user"] });
			syncTokenToCookie(null);

			if (options?.onError) {
				options.onError(
					error instanceof Error ? error : new Error(errorMessage),
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const signUpMutation = useMutation({
		mutationFn: async (data: SignUpData) => {
			setLoading(true);
			clearError();

			try {
				const response = await api.post("/api/v1/users/signup", {
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					password: data.password,
					phoneNumber: data.phoneNumber,
				});
				return response.data;
			} catch (error: unknown) {
				let fieldErrors: Record<string, string> = {};
				let errorMessage = "Signup failed. Please try again.";
				if (typeof error === "object" && error !== null) {
					const apiError = error as ApiErrorResponse;
					const data = apiError.response?.data;
					if (data) {
						if (data.errors && typeof data.errors === "object") {
							fieldErrors = data.errors;
						} else if (typeof data.message === "string") {
							if (data.message.toLowerCase().includes("email")) {
								fieldErrors.email = data.message;
							} else if (data.message.toLowerCase().includes("password")) {
								fieldErrors.password = data.message;
							} else if (data.message.toLowerCase().includes("first name")) {
								fieldErrors.firstName = data.message;
							} else if (data.message.toLowerCase().includes("last name")) {
								fieldErrors.lastName = data.message;
							} else if (data.message.toLowerCase().includes("phone")) {
								fieldErrors.phoneNumber = data.message;
							} else {
								errorMessage = data.message;
							}
						} else if (Array.isArray(data.message)) {
							if (
								data.message.every(
									(m: unknown) =>
										typeof m === "object" &&
										m &&
										"field" in m &&
										"message" in m,
								)
							) {
								(
									data.message as Array<{ field: string; message: string }>
								).forEach((err) => {
									fieldErrors[err.field] = err.message;
								});
							} else if (
								data.message.every((m: unknown) => typeof m === "string")
							) {
								(data.message as string[]).forEach((msg: string) => {
									const lowerMsg = msg.toLowerCase();
									if (lowerMsg.includes("last name")) {
										fieldErrors.lastName = msg;
									} else if (lowerMsg.includes("first name")) {
										fieldErrors.firstName = msg;
									} else if (lowerMsg.includes("email")) {
										fieldErrors.email = msg;
									} else if (lowerMsg.includes("password")) {
										fieldErrors.password = msg;
									} else if (lowerMsg.includes("phone")) {
										fieldErrors.phoneNumber = msg;
									} else {
										errorMessage = msg;
									}
								});
							}
						}
					}
				}
				const err: FieldError = Object.assign(new Error(errorMessage), {
					fieldErrors,
				});
				throw err;
			}
		},
		onSuccess: async (data) => {
			if (data?.message?.includes("verification")) {
				try {
					localStorage.removeItem("signupData");
				} catch (error) {
					console.error("[useAuth] Error clearing signup data:", error);
				}

				showToast(
					"Account created! Please check your email to verify your account.",
					{ type: "success" },
				);

				router.push("/auth/verification-pending");

				if (options?.onSuccess) {
					options.onSuccess();
				}
			} else if (data?.accessToken) {
				setToken(data.accessToken);
				showToast("Your account has been created successfully", {
					type: "success",
				});

				try {
					localStorage.removeItem("signupData");
					localStorage.removeItem("signupPendingData");
					localStorage.removeItem("pendingVerificationEmail");
				} catch (error) {
					console.error("[useAuth] Error clearing signup data:", error);
				}

				try {
					await fetchUserProfile();
					handleRedirect(data.accessToken);
				} catch (error) {
					console.error(
						"[useAuth] Error fetching profile during signup:",
						error,
					);
					handleRedirect(data.accessToken);
				}
			}

			return data;
		},
		onError: (error: unknown) => {
			if (
				typeof error === "object" &&
				error !== null &&
				"fieldErrors" in error &&
				(error as FieldError).fieldErrors &&
				Object.keys((error as FieldError).fieldErrors || {}).length > 0
			) {
				setError(
					(error as FieldError).message ?? "Signup failed. Please try again.",
				);
				if (options?.onError) {
					options.onError(error as unknown as Error);
				}
			} else {
				const errorMessage =
					typeof error === "object" &&
					error &&
					"message" in error &&
					typeof (error as { message?: string }).message === "string"
						? ((error as { message?: string }).message ??
							"Signup failed. Please try again.")
						: "Signup failed. Please try again.";

				setError(errorMessage);

				if (options?.onError) {
					options.onError(error as unknown as Error);
				}
			}
			setLoading(false);
		},
	});

	const verifyEmailMutation = useMutation({
		mutationFn: async (code: string) => {
			setLoading(true);
			clearError();
			const { data } = await api.patch("/api/v1/users/verify-email", { code });
			return data;
		},
		onSuccess: (data) => {
			if (data.accessToken) {
				setToken(data.accessToken);
			}

			showToast("Your email has been verified successfully", {
				type: "success",
			});

			fetchUserProfile();
		},
		onError: (error: unknown) => {
			let errorMessage = "Verification failed";
			if (typeof error === "object" && error !== null) {
				if (
					"response" in error &&
					typeof (error as ErrorWithResponse).response?.data?.message ===
						"string"
				) {
					errorMessage =
						(error as ErrorWithResponse).response?.data?.message ??
						errorMessage;
				} else if (
					"message" in error &&
					typeof (error as ErrorWithResponse).message === "string"
				) {
					errorMessage = (error as ErrorWithResponse).message ?? errorMessage;
				}
			}
			setError(errorMessage);
			showToast(errorMessage, { type: "error" });
		},
		onSettled: () => {
			setLoading(false);
		},
	});

	const resendVerificationMutation = useMutation({
		mutationFn: async (email: string) => {
			setLoading(true);
			clearError();
			const { data } = await api.post(
				"/api/v1/auth/resend-verification-email",
				{
					email,
				},
			);
			return data;
		},
		onSuccess: () => {
			showToast(
				"Verification email has been resent. Please check your inbox.",
				{ type: "success" },
			);
		},
		onError: (error: unknown) => {
			let errorMessage = "Failed to resend verification email";
			if (typeof error === "object" && error !== null) {
				if (
					"response" in error &&
					typeof (error as ErrorWithResponse).response?.data?.message ===
						"string"
				) {
					errorMessage =
						(error as ErrorWithResponse).response?.data?.message ??
						errorMessage;
				} else if (
					"message" in error &&
					typeof (error as ErrorWithResponse).message === "string"
				) {
					errorMessage = (error as ErrorWithResponse).message ?? errorMessage;
				}
			}
			setError(errorMessage);
			showToast(errorMessage, { type: "error" });
		},
		onSettled: () => {
			setLoading(false);
		},
	});

	const userQuery = useQuery({
		queryKey: ["current-user", token],
		queryFn: () => {
			console.log("[useAuth] Fetching user profile via React Query...");
			return fetchUserProfile();
		},
		enabled: !!token,
		retry: 2,
		retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (token && !user) {
			console.log(
				"[useAuth] Token exists but no user data, fetching profile...",
			);
			fetchUserProfile().catch((err) => {
				console.error(
					"[useAuth] Error fetching profile during initialization:",
					err,
				);
			});
		}
	}, [token, user, fetchUserProfile]);

	useEffect(() => {
		if (!userQuery.isPending && !userQuery.isError && userQuery.data) {
			console.log("[useAuth] User query completed successfully");
			setUserType(user && isAdminRole(user.role) ? "admin" : "applicant");
		} else if (userQuery.isError) {
			console.error("[useAuth] User query failed:", userQuery.error);
		}
	}, [
		userQuery.isPending,
		userQuery.isError,
		userQuery.data,
		user,
		userQuery.error,
	]);

	useEffect(() => {
		if (token) {
			const cleanedToken = cleanToken(token);
			api.defaults.headers.common.Authorization = `Bearer ${cleanedToken}`;
		} else {
			api.defaults.headers.common.Authorization = undefined;
		}
	}, [token]);

	const signOut = () => {
		syncTokenToCookie(null);

		api.defaults.headers.common.Authorization = undefined;

		logout();

		queryClient.removeQueries({ queryKey: ["current-user"] });

		showToast("You have been logged out", {
			duration: 3000,
			type: "success",
		});

		window.location.href = "/auth?mode=login";
	};

	const handleGoogleAuth = async () => {
		try {
			window.location.href = `${api.defaults.baseURL}/api/v1/auth/google`;
		} catch (error: unknown) {
			console.error("[useAuth] Google auth error:", error);
			setError("Google authentication failed");

			showToast("Failed to authenticate with Google. Please try again.", {
				type: "error",
			});

			options?.onError?.(
				error instanceof Error
					? error
					: new Error("Google authentication failed"),
			);
		}
	};

	const getUserDisplayName = () => {
		return user ? formatUserName(user.firstName, user.lastName) : "";
	};

	return {
		// State
		user,
		token,
		isAuthenticated,
		isLoading: isLoading || signUpMutation.isPending || userQuery.isLoading,
		error,
		showPassword,
		userType,
		decodedToken: null,
		displayName: getUserDisplayName(),

		// Actions
		setShowPassword,
		signIn,
		signUp: signUpMutation.mutate,
		signOut,
		verifyEmail: verifyEmailMutation.mutate,
		handleGoogleAuth,
		handleAuth,
		clearErrors: clearError,

		// Helper methods
		isProtectedRoute,
		getRoleFromToken,
		isAdminRole,
		refreshProfile: () => fetchUserProfile(),
		isTokenExpired: () => (token ? isTokenExpired(token) : true),
		getUserDisplayName,

		// Verification methods
		resendVerification: resendVerificationMutation.mutate,
	};
};
