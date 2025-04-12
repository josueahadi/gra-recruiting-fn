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
	logout,
	setUser,
	initializeAuth,
} from "@/redux/slices/auth-slice";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";

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

const cleanToken = (token: string): string => {
	if (!token) return "";
	return token.replace(/^["'](.+)["']$/, "$1").trim();
};

export const useAuth = (options?: UseAuthOptions) => {
	const [showPassword, setShowPassword] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();

	const dispatch = useAppDispatch();
	const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
		(state) => state.auth,
	);

	const getRoleFromToken = (tokenStr: string): string | null => {
		if (!tokenStr) return null;

		try {
			const cleaned = cleanToken(tokenStr);

			const decodedToken = jwtDecode<DecodedToken>(cleaned);
			return decodedToken.role;
		} catch (error) {
			console.error("[useAuth] Error decoding token:", error);
			return null;
		}
	};

	const isAdminRole = (role: string | null): boolean => {
		if (!role) return false;
		const upperRole = role.toUpperCase();
		return upperRole === "ADMIN" || upperRole === "SUPER_ADMIN";
	};

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

	const fetchUserProfile = async () => {
		if (!token) return null;

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
			return userData;
		} catch (error) {
			console.error("[useAuth] Error fetching user profile:", error);
			return null;
		}
	};

	const signInMutation = useMutation({
		mutationFn: async (credentials: SignInCredentials) => {
			dispatch(setLoading(true));
			const response = await api.post("/api/v1/auth/signin", credentials);
			return response.data;
		},
		onSuccess: (data) => {
			const { accessToken } = data;

			if (!accessToken) {
				console.error("[useAuth] No access token in response:", data);
				throw new Error("No access token received");
			}

			console.log(
				"[useAuth] Sign in successful with token:",
				accessToken.substring(0, 10) + "...",
			);

			dispatch(setToken(accessToken));

			toast({
				title: "Success!",
				description: "Successfully logged in.",
			});

			fetchUserProfile();

			handleRedirect(accessToken);
		},
		onError: (error: any) => {
			console.error("[useAuth] Sign in error:", error?.response?.data || error);

			dispatch(
				setError(error.response?.data?.message || "Invalid credentials"),
			);

			toast({
				title: "Error",
				description:
					error.response?.data?.message ||
					"Invalid credentials. Please try again.",
				variant: "destructive",
			});

			options?.onError?.(error);
		},
		onSettled: () => {
			dispatch(setLoading(false));
		},
	});

	const signUpMutation = useMutation({
		mutationFn: async (data: SignUpData) => {
			dispatch(setLoading(true));

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
		onSuccess: (data) => {
			if (!data.accessToken) {
				throw new Error("No access token received");
			}

			dispatch(setToken(data.accessToken));

			toast({
				title: "Success!",
				description: "Your account has been created successfully.",
			});

			fetchUserProfile();

			handleRedirect(data.accessToken);
		},
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
		queryFn: fetchUserProfile,
		enabled: !!token && !user,
		retry: 1,
	});

	useEffect(() => {
		dispatch(initializeAuth());

		const authCheckTimer = setTimeout(() => {
			setIsCheckingAuth(false);
		}, 1000);

		return () => clearTimeout(authCheckTimer);
	}, [dispatch]);

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
			api.defaults.headers.common["Authorization"] = `Bearer ${cleanedToken}`;
		} else {
			delete api.defaults.headers.common["Authorization"];
		}
	}, [token]);

	const signOut = () => {
		dispatch(logout());
		router.replace("/auth?mode=login");

		toast({
			title: "Signed out",
			description: "You have been signed out successfully.",
		});
	};

	const handleGoogleAuth = async () => {
		try {
			window.location.href = `${api.defaults.baseURL}/api/v1/auth/google`;
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

	const isProtectedRoute = (path: string) => {
		return path.startsWith("/applicant") || path.startsWith("/admin");
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

		// Actions
		setShowPassword,
		signIn: signInMutation.mutate,
		signUp: signUpMutation.mutate,
		signOut,
		verifyEmail: verifyEmailMutation.mutate,
		handleGoogleAuth,
		handleAuth,

		// Helper methods
		isProtectedRoute,
		getRoleFromToken,
		isAdminRole,
	};
};

export default useAuth;
