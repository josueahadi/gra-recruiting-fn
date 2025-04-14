"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthCheck({ children }: { children: React.ReactNode }) {
	const {
		isAuthenticated,
		isLoading,
		isCheckingAuth,
		token,
		isProtectedRoute,
		getRoleFromToken,
		isAdminRole,
	} = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [isRedirecting, setIsRedirecting] = useState(false);

	useEffect(() => {
		if (isRedirecting || isLoading || isCheckingAuth) {
			return;
		}

		// Skip checks on auth pages
		if (pathname.startsWith("/auth")) {
			return;
		}

		// Handle unauthorized access to protected routes
		if (isProtectedRoute(pathname) && !isAuthenticated) {
			console.log("[AuthCheck] Unauthorized access, redirecting to login");
			setIsRedirecting(true);

			// Simple redirect to login page without callback URL
			router.replace("/auth?mode=login");
			return;
		}

		// Handle non-admin users trying to access admin routes
		if (pathname.startsWith("/admin") && token) {
			const role = getRoleFromToken(token);

			if (!isAdminRole(role)) {
				console.log(
					"[AuthCheck] Not admin, redirecting to applicant dashboard",
				);
				setIsRedirecting(true);
				router.replace("/applicant/dashboard");
				return;
			}
		}
	}, [
		isAuthenticated,
		isCheckingAuth,
		isLoading,
		isRedirecting,
		pathname,
		router,
		token,
		isProtectedRoute,
		getRoleFromToken,
		isAdminRole,
	]);

	// Show loading spinner while checking auth or redirecting
	if (isCheckingAuth || isLoading || isRedirecting) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex gap-2 items-center">
					<div className="w-4 h-4 rounded-full bg-primary-base animate-pulse" />
					<div className="w-4 h-4 rounded-full bg-primary-base animate-pulse delay-75" />
					<div className="w-4 h-4 rounded-full bg-primary-base animate-pulse delay-150" />
					<span className="ml-2 text-gray-500">Loading...</span>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

export default AuthCheck;
