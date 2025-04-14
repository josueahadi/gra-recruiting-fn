"use client";

import AuthForm from "@/components/auth/auth-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch } from "@/redux/hooks";
import { initializeAuth } from "@/redux/slices/auth-slice";

export default function AuthPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mode = (searchParams.get("mode") as "login" | "signup") || "login";

	const { isAuthenticated, token, isCheckingAuth, getRoleFromToken } =
		useAuth();
	const dispatch = useAppDispatch();

	const [hasRedirected, setHasRedirected] = useState(false);

	// Initialize auth if we have a token but not authenticated
	useEffect(() => {
		if (token && !isAuthenticated) {
			dispatch(initializeAuth());
		}
	}, [token, isAuthenticated, dispatch]);

	// Handle redirection when authenticated
	useEffect(() => {
		if (isCheckingAuth || hasRedirected) return;

		if (isAuthenticated && token) {
			console.log("[Auth Page] User is authenticated, preparing to redirect");
			setHasRedirected(true);

			const role = getRoleFromToken(token);
			const isAdmin =
				role?.toUpperCase() === "ADMIN" ||
				role?.toUpperCase() === "SUPER_ADMIN";

			// Fixed redirect paths based on user role
			const redirectPath = isAdmin
				? "/admin/dashboard"
				: "/applicant/dashboard";

			console.log("[Auth Page] Redirecting to:", redirectPath);
			router.replace(redirectPath);
		}
	}, [
		isAuthenticated,
		isCheckingAuth,
		token,
		router,
		getRoleFromToken,
		hasRedirected,
	]);

	// Don't render the form if already authenticated and not in process of redirection
	if (isCheckingAuth || (isAuthenticated && !hasRedirected)) {
		return <AuthLoadingState />;
	}

	return (
		<div className="min-h-screen flex">
			<div className="hidden lg:block lg:fixed lg:w-1/2 h-screen">
				<Image
					width={500}
					height={500}
					src={
						mode === "login"
							? "/images/placeholder.svg"
							: "/images/placeholder.svg"
					}
					alt="Grow Rwanda"
					className="w-full h-full object-cover"
					priority
				/>
			</div>

			<div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 bg-white">
				<AuthForm mode={mode} />
			</div>
		</div>
	);
}

function AuthLoadingState() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="flex gap-2 items-center">
				<div className="w-4 h-4 rounded-full bg-primary-base animate-pulse" />
				<div className="w-4 h-4 rounded-full bg-primary-base animate-pulse delay-75" />
				<div className="w-4 h-4 rounded-full bg-primary-base animate-pulse delay-150" />
				<span className="ml-2 text-gray-500">Redirecting...</span>
			</div>
		</div>
	);
}
