"use client";

import AuthForm from "@/components/auth/auth-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

function AuthContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mode = (searchParams.get("mode") as "login" | "signup") || "login";
	const callbackUrl = searchParams.get("callbackUrl");
	const { isAuthenticated, user, token, isCheckingAuth, getRoleFromToken } =
		useAuth();
	// Add a state to track redirection status
	const [isRedirecting, setIsRedirecting] = useState(false);

	// Force an immediate check for authentication status
	useEffect(() => {
		console.log("[Auth Page] Initial load: ", {
			isAuthenticated,
			hasToken: !!token,
			isChecking: isCheckingAuth,
			isRedirecting,
		});
	}, [isRedirecting, isAuthenticated, token, isCheckingAuth]);

	useEffect(() => {
		// Skip if already redirecting to prevent loops
		if (isRedirecting) return;

		// Add detailed console logs for debugging
		console.log("[Auth Page] Auth state updated:", {
			isAuthenticated,
			isCheckingAuth,
			hasToken: !!token,
			user: user?.email,
			callbackUrl,
			isRedirecting,
		});

		if (token) {
			const decodedRole = getRoleFromToken(token);
			console.log("[Auth Page] Decoded token role:", decodedRole);
		}

		// If authenticated, redirect immediately
		if (isAuthenticated && token && !isRedirecting) {
			const decodedRole = getRoleFromToken(token);

			// Use the callback URL or default based on role from token
			// Use case-insensitive comparison for role matching
			const isAdminUser = decodedRole?.toUpperCase() === "ADMIN" || 
				decodedRole?.toUpperCase() === "SUPER_ADMIN";
			
			const redirectPath = callbackUrl || 
				(isAdminUser ? "/admin/dashboard" : "/applicant/dashboard");

			console.log("[Auth Page] Redirecting to:", redirectPath);

			// Set redirecting state to prevent further redirects
			setIsRedirecting(true);

			// Use replace instead of push to avoid browser history issues
			router.replace(redirectPath);
		}
	}, [
		isAuthenticated,
		isCheckingAuth,
		user,
		token,
		callbackUrl,
		router,
		getRoleFromToken,
		isRedirecting,
	]);

	// Show loading state if still checking auth or actively redirecting
	if (isCheckingAuth || isRedirecting) {
		return <AuthFallback />;
	}

	// If authenticated but still on this page (waiting for redirect)
	if (isAuthenticated) {
		return <AuthFallback />;
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

function AuthFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-pulse flex space-x-4">
				<div className="rounded-full bg-gray-200 h-12 w-12" />
				<div className="flex-1 space-y-4 py-1">
					<div className="h-4 bg-gray-200 rounded w-3/4" />
					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded" />
						<div className="h-4 bg-gray-200 rounded w-5/6" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default function AuthPage() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return <AuthFallback />;
	}

	return (
		<Suspense fallback={<AuthFallback />}>
			<AuthContent />
		</Suspense>
	);
}
