/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@/redux/slices/auth-slice";

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
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();

	const dispatch = useAppDispatch();
	const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
		(state) => state.auth,
	);

	// Redirect based on user role
	const handleRedirect = (userRole: string) => {
		const callbackUrl = searchParams?.get("callbackUrl");

		if (callbackUrl) {
			router.push(callbackUrl);
		} else {
			if (userRole.toLowerCase() === "admin") {
				router.push("/admin/dashboard");
			} else {
				router.push("/applicant/dashboard");
			}
		}

		options?.onSuccess?.();
	};

	// Handle auth type selection (login/signup)
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

			handleRedirect(user.role);
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

			// Step 2: If we have profile data and the signup was successful,
			// complete the application profile
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
					// We still return the user data since the account was created
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

			handleRedirect(user.role);
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
		queryFn: async () => {
			if (!token) return null;
			const { data } = await api.get("/users/view-profile");
			return data;
		},
		enabled: !!token && !user,
		retry: 1,
	});

	useEffect(() => {
		if (userQuery.data) {
			dispatch(setUser(userQuery.data));
		}

		if (userQuery.error) {
			console.error("Error fetching user data:", userQuery.error);
			dispatch(logout());
		}
	}, [userQuery.data, userQuery.error, dispatch]);

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
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			// biome-ignore lint/performance/noDelete: <explanation>
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
	};
};

export default useAuth;
