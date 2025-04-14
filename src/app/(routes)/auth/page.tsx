"use client";

import AuthForm from "@/components/auth/auth-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initializeAuth } from "@/redux/slices/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

function AuthContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mode = (searchParams.get("mode") as "login" | "signup") || "login";
	const callbackUrl = searchParams.get("callbackUrl");
	const { isAuthenticated, user, token, isCheckingAuth, getRoleFromToken } =
		useAuth();
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const authError = useAppSelector((state) => state.auth.error);

	const [isRedirecting, setIsRedirecting] = useState(false);
	const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
	const [showInlineError, setShowInlineError] = useState(false);

	useEffect(() => {
		console.log("[Auth Page] Initial load: ", {
			isAuthenticated,
			hasToken: !!token,
			isChecking: isCheckingAuth,
			isRedirecting,
		});

		if (token && !isAuthenticated) {
			dispatch(initializeAuth());
		}

		if (!isCheckingAuth && !hasCheckedAuth) {
			setHasCheckedAuth(true);
		}
	}, [
		isRedirecting,
		isAuthenticated,
		token,
		isCheckingAuth,
		hasCheckedAuth,
		dispatch,
	]);

	useEffect(() => {
		if (authError) {
			setShowInlineError(true);

			const timer = setTimeout(() => {
				setShowInlineError(false);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [authError]);

	useEffect(() => {
		if (isRedirecting || isCheckingAuth || !hasCheckedAuth) return;

		console.log("[Auth Page] Auth state updated:", {
			isAuthenticated,
			isCheckingAuth,
			hasToken: !!token,
			user: user?.email,
			callbackUrl,
			isRedirecting,
			hasCheckedAuth,
		});

		if (!isAuthenticated || !token) return;

		const lastRedirectTime = Number.parseInt(
			localStorage.getItem("lastAuthRedirect") || "0",
		);
		const currentTime = Date.now();

		if (currentTime - lastRedirectTime < 2000) {
			console.log("[Auth Page] Preventing redirect loop - too many redirects");
			return;
		}

		const decodedRole = getRoleFromToken(token);
		console.log("[Auth Page] Decoded token role:", decodedRole);

		const isAdminUser =
			decodedRole?.toUpperCase() === "ADMIN" ||
			decodedRole?.toUpperCase() === "SUPER_ADMIN";

		const redirectPath =
			callbackUrl ||
			(isAdminUser ? "/admin/dashboard" : "/applicant/dashboard");

		console.log("[Auth Page] Redirecting to:", redirectPath);

		setIsRedirecting(true);
		localStorage.setItem("lastAuthRedirect", currentTime.toString());

		toast({
			title: "Authentication Successful",
			description: `Welcome back${user?.firstName ? `, ${user.firstName}` : ""}! Redirecting you now...`,
			variant: "default",
		});

		setTimeout(() => {
			router.replace(redirectPath);
		}, 500);
	}, [
		isAuthenticated,
		isCheckingAuth,
		user,
		token,
		callbackUrl,
		router,
		getRoleFromToken,
		isRedirecting,
		hasCheckedAuth,
		toast,
	]);

	if (isCheckingAuth || isRedirecting || isAuthenticated) {
		return <AuthFallback />;
	}

	return (
		<div className="min-h-screen flex">
			{showInlineError && authError && (
				<div className="fixed top-4 right-4 z-[9999] bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg w-96 animate-in slide-in-from-right">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-red-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<title>Authentication Error</title>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3 flex-1">
							<h3 className="text-sm font-medium">Authentication Error</h3>
							<div className="mt-1 text-sm">{authError}</div>
						</div>
						<button
							type="button"
							className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
							onClick={() => setShowInlineError(false)}
						>
							<X size={16} />
						</button>
					</div>
				</div>
			)}

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
	useEffect(() => {
		const currentTime = Date.now();
		const lastRedirectTime = Number.parseInt(
			localStorage.getItem("lastAuthRedirect") || "0",
		);

		if (currentTime - lastRedirectTime > 5000) {
			localStorage.removeItem("lastAuthRedirect");
		}
	}, []);

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
