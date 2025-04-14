/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	setToken,
	setLoading,
	setError,
	clearError,
	logout,
	setUser,
	initializeAuth,
} from "@/redux/slices/auth-slice";
import {
	cleanToken,
	isProtectedRoute,
	getRoleFromToken,
	isAdminRole,
	isTokenExpired,
	type UserType,
	formatUserName,
} from "@/lib/utils/auth-utils";
import { handleApiError } from "@/services/api";

interface UseAuthOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onOpenChange?: (open: boolean) => void;
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
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [userType, setUserType] = useState<UserType>("applicant");
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();

	const dispatch = useAppDispatch();
	const { user, token, isAuthenticated, isLoading, error, decodedToken } =
		useAppSelector((state) => state.auth);

	useEffect(() => {
		if (token) {
			if (isTokenExpired(token)) {
				console.log("[useAuth] Token expired, logging out");
				toast({
					title: "Session Expired",
					description: "Your session has expired. Please sign in again.",
					variant: "destructive",
				});
				dispatch(logout());
			} else {
				const role = getRoleFromToken(token);
				setUserType(isAdminRole(role) ? "admin" : "applicant");
			}
		}
	}, [token, dispatch, toast]);

	const handleRedirect = (authToken: string) => {
		const role = getRoleFromToken(authToken);
		const callbackUrl = searchParams?.get("callbackUrl");

		let redirectPath: string;

		if (callbackUrl) {
			redirectPath = callbackUrl;
		} else {
			redirectPath = isAdminRole(role)
				? "/admin/dashboard"
				: "/applicant/dashboard";
		}

		console.log("[useAuth] Redirecting to:", redirectPath);

		setTimeout(() => {
			router.replace(redirectPath);
		}, 100);

		options?.onSuccess?.();
	};

	const handleAuth = (type: "login" | "signup") => {
		router.push(`/auth?mode=${type}`);
	};

	const fetchUserProfile = async (
		retryCount = 0,
	): Promise<UserProfileResponse | null> => {
		if (!token) return null;
		const MAX_RETRIES = 2;

		try {
			const { data } = await api.get<UserProfileResponse>(
				"/api/v1/users/view-profile",
			);
			console.log("[useAuth] Fetched user profile:", data);

			const userData = {
				id: data.id.toString(),
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				role: getRoleFromToken(token) || "USER",
				phoneNumber: data.phoneNumber,
				isEmailVerified: true,
			};

			dispatch(setUser(userData));
			return data;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error(
				`[useAuth] Error fetching user profile (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`,
				error,
			);

			if (error.response?.status === 401) {
				dispatch(logout());
				return null;
			}

			if (retryCount < MAX_RETRIES) {
				const delay = 2 ** retryCount * 500;
				await new Promise((resolve) => setTimeout(resolve, delay));
				return fetchUserProfile(retryCount + 1);
			}

			toast({
				title: "Profile Error",
				description:
					"Could not load your profile. Some features may be limited.",
				variant: "destructive",
			});

			throw error;
		}
	};

	const signInMutation = useMutation({
		mutationFn: async (credentials: SignInCredentials) => {
			try {
				dispatch(setLoading(true));
				dispatch(clearError());

				console.log(
					"[useAuth] Attempting sign in with email:",
					credentials.email,
				);

				const response = await api.post("/api/v1/auth/signin", credentials);
				return response.data;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				console.error("[useAuth] Sign in API error:", {
					message: error.message,
					status: error.response?.status,
					data: error.response?.data,
					url: error.config?.url,
				});

				throw error;
			}
		},
		onSuccess: async (data) => {
			const { accessToken } = data;

			if (!accessToken) {
				console.error("[useAuth] No access token in response:", data);
				throw new Error("No access token received");
			}

			console.log(
				"[useAuth] Sign in successful with token:",
				`${accessToken.substring(0, 10)}...`,
			);

			dispatch(setToken(accessToken));

			toast({
				title: "Success!",
				description: "Successfully logged in.",
			});

			try {
				console.log("[useAuth] Fetching user profile before redirecting...");
				await fetchUserProfile();

				handleRedirect(accessToken);
			} catch (error) {
				console.error("[useAuth] Error fetching profile during login:", error);
				handleRedirect(accessToken);
			}
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			console.error("[useAuth] Sign in error:", error);

			const errorResponse = handleApiError(
				error,
				"Invalid credentials. Please try again.",
			);

			dispatch(setError(errorResponse.message));

			let toastMessage = errorResponse.message;

			if (errorResponse.details?.statusCode === 404) {
				toastMessage =
					"This account doesn't exist. Please sign up or verify your email.";
			} else if (errorResponse.details?.statusCode === 401) {
				toastMessage = "Invalid password. Please try again.";
			}

			toast({
				title: "Authentication Failed",
				description: toastMessage,
				variant: "destructive",
			});

			if (options?.onError) options.onError(error);
		},
		onSettled: () => {
			dispatch(setLoading(false));
		},
	});

	const signUpMutation = useMutation({
		mutationFn: async (data: SignUpData) => {
			dispatch(setLoading(true));
			dispatch(clearError());

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

			dispatch(setToken(data.accessToken));

			toast({
				title: "Success!",
				description: "Your account has been created successfully.",
			});

			try {
				console.log("[useAuth] Fetching user profile before redirecting...");
				await fetchUserProfile();

				handleRedirect(data.accessToken);
			} catch (error) {
				console.error("[useAuth] Error fetching profile during signup:", error);
				handleRedirect(data.accessToken);
			}
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			dispatch(
				setError(error.response?.data?.message || "Registration failed"),
			);

			toast({
				title: "Error",
				description:
					error.response?.data?.message ||
					"Something went wrong. Please try again.",
				variant: "destructive",
			});

			options?.onError?.(error);
		},
		onSettled: () => {
			dispatch(setLoading(false));
		},
	});

	const verifyEmailMutation = useMutation({
		mutationFn: async (code: string) => {
			dispatch(setLoading(true));
			dispatch(clearError());
			const { data } = await api.patch("/api/v1/users/verify-email", { code });
			return data;
		},
		onSuccess: (data) => {
			if (data.accessToken) {
				dispatch(setToken(data.accessToken));
			}

			toast({
				title: "Success!",
				description: "Your email has been verified successfully.",
			});

			fetchUserProfile();
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			dispatch(
				setError(error.response?.data?.message || "Verification failed"),
			);

			toast({
				title: "Error",
				description:
					error.response?.data?.message ||
					"Failed to verify email. Please try again.",
				variant: "destructive",
			});
		},
		onSettled: () => {
			dispatch(setLoading(false));
		},
	});

	const userQuery = useQuery({
		queryKey: ["current-user"],
		queryFn: () => fetchUserProfile(),
		enabled: !!token && !user,
		retry: 2,
		retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
	});

	useEffect(() => {
		dispatch(initializeAuth());

		if (token && !isTokenExpired(token)) {
			const role = getRoleFromToken(token);
			setUserType(isAdminRole(role) ? "admin" : "applicant");
		} else if (token) {
			// Token exists but is expired
			console.log(
				"[useAuth] Expired token found during initialization, logging out",
			);
			dispatch(logout());
		}

		const authCheckTimer = setTimeout(() => {
			setIsCheckingAuth(false);
		}, 1000);

		return () => clearTimeout(authCheckTimer);
	}, [dispatch, token]);

	useEffect(() => {
		if (!userQuery.isPending) {
			setIsCheckingAuth(false);
		}
	}, [userQuery.isPending]);

	useEffect(() => {
		if (!token) {
			setIsCheckingAuth(false);
		}
	}, [token]);

	useEffect(() => {
		if (token) {
			const cleanedToken = cleanToken(token);
			api.defaults.headers.common.Authorization = `Bearer ${cleanedToken}`;
		} else {
			api.defaults.headers.common.Authorization = undefined;
		}
	}, [token]);

	const signOut = () => {
		api.defaults.headers.common.Authorization = undefined;

		dispatch(logout());

		setTimeout(() => {
			router.push("/auth?mode=login");
			toast({
				title: "Signed out",
				description: "You have been signed out successfully.",
			});
		}, 100);
	};

	const handleGoogleAuth = async () => {
		try {
			window.location.href = `${api.defaults.baseURL}/api/v1/auth/google`;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error("[useAuth] Google auth error:", error);
			dispatch(setError("Google authentication failed"));

			toast({
				title: "Error",
				description: "Failed to authenticate with Google. Please try again.",
				variant: "destructive",
			});

			options?.onError?.(error);
		}
	};

	const getUserDisplayName = () => {
		return formatUserName(user?.firstName, user?.lastName);
	};

	return {
		// State
		user,
		token,
		isAuthenticated,
		isLoading:
			isLoading ||
			signInMutation.isPending ||
			signUpMutation.isPending ||
			userQuery.isLoading,
		isCheckingAuth,
		error,
		showPassword,
		userType,
		decodedToken,
		displayName: getUserDisplayName(),

		// Actions
		setShowPassword,
		signIn: signInMutation.mutate,
		signUp: signUpMutation.mutate,
		signOut,
		verifyEmail: verifyEmailMutation.mutate,
		handleGoogleAuth,
		handleAuth,
		clearErrors: () => dispatch(clearError()),

		// Helper methods
		isProtectedRoute,
		getRoleFromToken,
		isAdminRole,
		refreshProfile: () => fetchUserProfile(),
		isTokenExpired: () => (token ? isTokenExpired(token) : true),
		getUserDisplayName,
	};
};

export default useAuth;
