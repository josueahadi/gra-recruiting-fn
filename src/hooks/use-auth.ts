import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import type { AuthResponse, User } from "@/types/api";
import type { AuthCredentials } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface UseAuthOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onOpenChange?: (open: boolean) => void;
}

interface AuthState {
	isLoading: boolean;
	showPassword: boolean;
}

export const useAuth = (options?: UseAuthOptions) => {
	const [state, setState] = useState<AuthState>({
		isLoading: false,
		showPassword: false,
	});
	const { toast } = useToast();
	const router = useRouter();

	const handleAuth = (mode: "login" | "signup") => {
		router.push(`/auth?mode=${mode}`);
	};

	const loginMutation = useMutation({
		mutationFn: async (credentials: AuthCredentials) => {
			const { data } = await api.post<AuthResponse>("/auth/login", credentials);
			return data;
		},
		onSuccess: (data) => {
			console.log(data);
			toast({
				title: "Success!",
				description: "Successfully logged in.",
			});
			options?.onSuccess?.();
			options?.onOpenChange?.(false);
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: "Invalid credentials. Please try again.",
				variant: "destructive",
			});
			options?.onError?.(error);
		},
	});

	const signUpMutation = useMutation({
		mutationFn: async (data: AuthCredentials & { name: string }) => {
			const response = await api.post<AuthResponse>("/auth/signup", data);
			return response.data;
		},
		onSuccess: (data) => {
			console.log(data);
			toast({
				title: "Success!",
				description: "Your account has been created successfully.",
			});
			options?.onSuccess?.();
			options?.onOpenChange?.(false);
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
			options?.onError?.(error);
		},
	});

	const userQuery = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const { data } = await api.get<User>("/auth/me");
			return data;
		},
	});

	const handleGoogleAuth = async () => {
		try {
			await api.get("/auth/google");
			toast({
				title: "Success!",
				description: "Successfully authenticated with Google.",
			});
			options?.onSuccess?.();
		} catch (error) {
			const err = error as Error;
			console.error("Google auth error:", err);
			toast({
				title: "Error",
				description: "Failed to authenticate with Google. Please try again.",
				variant: "destructive",
			});
			options?.onError?.(err);
		}
	};

	return {
		login: loginMutation.mutateAsync,
		signup: signUpMutation.mutateAsync,
		user: userQuery.data,
		isLoading:
			state.isLoading || loginMutation.isPending || signUpMutation.isPending,
		showPassword: state.showPassword,
		setShowPassword: (show: boolean) =>
			setState((prev) => ({ ...prev, showPassword: show })),
		handleGoogleAuth,
		isAuthenticated: !!userQuery.data,
		isUserLoading: userQuery.isLoading,
		handleAuth,
	};
};
