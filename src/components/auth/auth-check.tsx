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

		if (pathname.startsWith("/auth")) {
			return;
		}

		if (isProtectedRoute(pathname) && !isAuthenticated) {
			console.log("[AuthCheck] Unauthorized access, redirecting to login");
			setIsRedirecting(true);

			const encodedPath = encodeURIComponent(pathname);
			const redirectUrl = `/auth?mode=login&callbackUrl=${encodedPath}`;

			router.replace(redirectUrl);
			return;
		}

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

	if (isCheckingAuth || isLoading || isRedirecting) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	return <>{children}</>;
}

export default AuthCheck;
