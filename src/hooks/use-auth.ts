"use client";

import { api } from "@/services/api";
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
import { toast } from "react-hot-toast";

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
		initializeAuth: storeInitializeAuth
	} = useAuthStore();

	// Use memoized callbacks to prevent infinite loops
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
			toast.error("Your session has expired. Please sign in again.");
			logout();
		}
	}, [token, logout]);

	// Update user type based on role
	useEffect(() => {
		if (token) {
			const role = getRoleFromToken(token);
			setUserType(isAdminRole(role) ? "admin" : "applicant");
		}
	}, [token]);

	// Initialize auth on component mount
	useEffect(() => {
		console.log("[useAuth] Component mounted, initializing auth...");
		initializeAuth();
	}, [initializeAuth]);

	const handleAuth = useCallback((type: "login" | "signup") => {
		router.push(`/auth?mode=${type}`);
	}, [router]);

	const handleRedirect = useCallback((authToken: string) => {
		const role = getRoleFromToken(authToken);

		// Simple redirect logic based on user role
		const redirectPath = isAdminRole(role)
			? "/admin/dashboard"
			: "/applicant/dashboard";

		console.log("[useAuth] Redirecting to:", redirectPath);
		router.replace(redirectPath);

		options?.onSuccess?.();
	}, [router, options]);

	const fetchUserProfile = async (
		retryCount = 0,
	): Promise<UserProfileResponse | null> => {
		if (!token) {
			console.log("[useAuth] fetchUserProfile called but no token available");
			return null;
		}
		
		const MAX_RETRIES = 2;

		try {
			console.log("[useAuth] Making API request to fetch user profile...");
			
			const { data } = await api.get<UserProfileResponse>(
				"/api/v1/users/view-profile",
			);
			
			console.log("[useAuth] Successfully fetched user profile:", {
				id: data.id,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email
			});

			const userData = {
				id: data.id.toString(),
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				role: getRoleFromToken(token) || "USER",
				phoneNumber: data.phoneNumber,
				isEmailVerified: true,
				isTemporary: false // Explicitly mark as not temporary
			};

			console.log("[useAuth] Setting user data in store");
			setUser(userData);
			return data;
		} catch (error: any) {
			console.error(
				`[useAuth] Error fetching user profile (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`,
				error,
			);

			if (error.response?.status === 401) {
				logout();
				return null;
			}

			if (retryCount < MAX_RETRIES) {
				const delay = 2 ** retryCount * 500;
				await new Promise((resolve) => setTimeout(resolve, delay));
				return fetchUserProfile(retryCount + 1);
			}

			toast.error("Could not load your profile. Some features may be limited.");
			throw error;
		}
	};

	const signIn = async (credentials: SignInCredentials) => {
		try {
			// Clear any existing auth state first
			logout();
			queryClient.removeQueries({ queryKey: ["current-user"] });
			
			setLoading(true);
			clearError();

			console.log("[Auth] Signing in with:", credentials.email);

			const response = await api.post("/api/v1/auth/signin", credentials);
			const { accessToken } = response.data;

			if (!accessToken) {
				throw new Error("No access token received");
			}

			// Validate the token before proceeding
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

			try {
				// Load user profile
				const profile = await fetchUserProfile();
				
				if (!profile) {
					throw new Error("Failed to load user profile");
				}

				// Validate that the profile email matches the login email
				if (profile.email.toLowerCase() !== credentials.email.toLowerCase()) {
					throw new Error("Profile mismatch detected");
				}
				
				// Redirect to appropriate dashboard
				const role = getRoleFromToken(accessToken);
				const redirectPath = isAdminRole(role) 
					? "/admin/dashboard" 
					: "/applicant/dashboard";
				
				console.log("[Auth] Redirecting to:", redirectPath);
				window.location.href = redirectPath;
				
				if (options?.onSuccess) {
					options.onSuccess();
				}
			} catch (error) {
				console.error("[Auth] Error during post-login verification:", error);
				// Clear everything and force logout on verification failure
				logout();
				queryClient.removeQueries({ queryKey: ["current-user"] });
				syncTokenToCookie(null);
				throw new Error("Login verification failed. Please try again.");
			}
		} catch (error: any) {
			console.error("[Auth] Sign in error:", error.response?.data || error.message);
			
			const errorMessage = error.response?.data?.message || error.message || "Authentication failed. Please try again.";
			setError(errorMessage);
			
			// Ensure cleanup on error
			logout();
			queryClient.removeQueries({ queryKey: ["current-user"] });
			syncTokenToCookie(null);
			
			if (options?.onError) {
				options.onError(new Error(errorMessage));
			}
		} finally {
			setLoading(false);
		}
	};

	const signUpMutation = useMutation({
		mutationFn: async (data: SignUpData) => {
			setLoading(true);
			clearError();

			const response = await api.post("/api/v1/users/signup", {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			});

			const { accessToken } = response.data;

			if (!accessToken) {
				throw new Error("No access token received from signup");
			}

			if (data.career) {
				try {
					await api.post(
						"/api/v1/applicants/complete-application-profile",
						{
							career: data.career,
							levelOfEducation: data.levelOfEducation,
							university: data.university,
							graduationDate: data.graduationDate,
							major: data.major,
							linkedinProfileUrl: data.linkedinProfileUrl,
							githubProfileUrl: data.githubProfileUrl,
						},
						{
							headers: { Authorization: `Bearer ${accessToken}` },
						},
					);
				} catch (profileError) {
					console.error("[useAuth] Error completing profile:", profileError);
				}
			}

			return response.data;
		},
		onSuccess: async (data) => {
			if (!data.accessToken) {
				throw new Error("No access token received");
			}

			setToken(data.accessToken);

			toast.success("Your account has been created successfully");

			try {
				console.log("[useAuth] Fetching user profile before redirecting...");
				await fetchUserProfile();
				handleRedirect(data.accessToken);
			} catch (error) {
				console.error("[useAuth] Error fetching profile during signup:", error);
				handleRedirect(data.accessToken);
			}
		},
		onError: (error: any) => {
			setError(error.response?.data?.message || "Registration failed");

			toast.error(
				error.response?.data?.message ||
					"Something went wrong. Please try again.",
			);

			options?.onError?.(error);
		},
		onSettled: () => {
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

			toast.success("Your email has been verified successfully");

			fetchUserProfile();
		},
		onError: (error: any) => {
			setError(error.response?.data?.message || "Verification failed");

			toast.error(
				error.response?.data?.message ||
					"Failed to verify email. Please try again.",
			);
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

	// If we have a token but no user data, fetch the profile
	useEffect(() => {
		if (token && !user) {
			console.log("[useAuth] Token exists but no user data, fetching profile...");
			fetchUserProfile().catch(err => {
				console.error("[useAuth] Error fetching profile during initialization:", err);
			});
		}
	}, [token, user]);

	useEffect(() => {
		if (!userQuery.isPending && !userQuery.isError && userQuery.data) {
			console.log("[useAuth] User query completed successfully");
			setUserType(user && isAdminRole(user.role) ? "admin" : "applicant");
		} else if (userQuery.isError) {
			console.error("[useAuth] User query failed:", userQuery.error);
		}
	}, [userQuery.isPending, userQuery.isError, userQuery.data, user, setUserType]);

	useEffect(() => {
		if (token) {
			const cleanedToken = cleanToken(token);
			api.defaults.headers.common.Authorization = `Bearer ${cleanedToken}`;
		} else {
			api.defaults.headers.common.Authorization = undefined;
		}
	}, [token]);

	const signOut = () => {
		// Clear auth token from cookies first for immediate server-side logout
		syncTokenToCookie(null);
		
		// Clear auth header
		api.defaults.headers.common.Authorization = undefined;

		// Clear state in Zustand store
		logout();

		// Clear any cached queries
		queryClient.removeQueries({ queryKey: ["current-user"] });

		toast.success("You have been logged out", {
			duration: 3000,
			position: "top-center",
		});

		// Force a page reload to clear any cached state
		window.location.href = "/auth?mode=login";
	};

	const handleGoogleAuth = async () => {
		try {
			window.location.href = `${api.defaults.baseURL}/api/v1/auth/google`;
		} catch (error: any) {
			console.error("[useAuth] Google auth error:", error);
			setError("Google authentication failed");

			toast.error("Failed to authenticate with Google. Please try again.");

			options?.onError?.(error);
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
		isLoading:
			isLoading ||
			signUpMutation.isPending ||
			userQuery.isLoading,
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
	};
};