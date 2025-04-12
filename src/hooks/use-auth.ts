"use client";

import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	setCredentials,
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

	const getRoleFromToken = (token: string): string | null => {
		try {
			const cleanToken = token.replace(/^["'](.+)["']$/, "$1");

			console.log("[Token Debug] Attempting to decode token:", {
				tokenLength: token.length,
				cleanTokenLength: cleanToken.length,
				cleanToken: cleanToken,
			});

			const decodedToken = jwtDecode<DecodedToken>(cleanToken);
			console.log(
				"[Token Debug] Successfully decoded token, role =",
				decodedToken.role,
			);
			return decodedToken.role;
		} catch (error) {
			console.error("[Token Debug] Error decoding token:", error);
			return null;
		}
	};

	const isAdminRole = (role: string | null): boolean => {
		if (!role) return false;
		return (
			role.toUpperCase() === "ADMIN" || role.toUpperCase() === "SUPER_ADMIN"
		);
	};

	const handleRedirect = (authToken: string) => {
		const role = getRoleFromToken(authToken);
		const callbackUrl = searchParams?.get("callbackUrl");

		if (callbackUrl) {
			router.push(callbackUrl);
		} else {
			if (isAdminRole(role)) {
				router.push("/admin/dashboard");
			} else {
				router.push("/applicant");
			}
		}

		options?.onSuccess?.();
	};

	const handleAuth = (type: "login" | "signup") => {
		router.push(`/auth?mode=${type}`);
	};

	const signInMutation = useMutation({
		mutationFn: async (credentials: SignInCredentials) => {
			dispatch(setLoading(true));
			const { data } = await api.post("/auth/signin", credentials);
			return data;
		},
		onSuccess: (data) => {
			const { accessToken, user } = data;
			dispatch(setCredentials({ token: accessToken, user }));

			toast({
				title: "Success!",
				description: "Successfully logged in.",
			});

			handleRedirect(accessToken);
		},
		onError: (error: any) => {
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

			// Step 1: Create the user account
			const response = await api.post("/users/signup", {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			});

			if (data.career && response.data.accessToken) {
				try {
					await api.post(
						"/applicants/complete-application-profile",
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
							headers: { Authorization: `Bearer ${response.data.accessToken}` },
						},
					);
				} catch (profileError) {
					console.error("Error completing profile:", profileError);
				}
			}

			return response.data;
		},
		onSuccess: (data) => {
			const { accessToken, user } = data;
			dispatch(setCredentials({ token: accessToken, user }));

			toast({
				title: "Success!",
				description: "Your account has been created successfully.",
			});

			handleRedirect(accessToken);
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
			const { data } = await api.patch("/users/verify-email", { code });
			return data;
		},
		onSuccess: (data) => {
			if (data.user) {
				dispatch(
					setCredentials({
						token: data.accessToken || token || "",
						user: data.user,
					}),
				);
			}

			toast({
				title: "Success!",
				description: "Your email has been verified successfully.",
			});
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
		queryFn: async () => {
			if (!token) return null;
			const { data } = await api.get("/users/view-profile");
			return data;
		},
		enabled: !!token && !user,
		retry: 1,
	});

	useEffect(() => {
		dispatch(initializeAuth());

		if (userQuery.data) {
			dispatch(setUser(userQuery.data));
		}

		if (userQuery.error) {
			console.error("Error fetching user data:", userQuery.error);
			dispatch(logout());
		}

		if (!userQuery.isPending) {
			setIsCheckingAuth(false);
		}
	}, [userQuery.data, userQuery.error, userQuery.isPending, dispatch]);

	useEffect(() => {
		if (!token) {
			setIsCheckingAuth(false);
		}
	}, [token]);

	const signOut = () => {
		dispatch(logout());
		router.push("/auth?mode=login");

		toast({
			title: "Signed out",
			description: "You have been signed out successfully.",
		});
	};

	const handleGoogleAuth = async () => {
		try {
			window.location.href = `${api.defaults.baseURL}/auth/google`;
		} catch (error: any) {
			console.error("Google auth error:", error);
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

	useEffect(() => {
		if (token) {
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			delete api.defaults.headers.common["Authorization"];
		}
	}, [token]);

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
