"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthCheck({ children }: { children: React.ReactNode }) {
	const {
		isAuthenticated,
		isLoading,
		token,
		isProtectedRoute,
		getRoleFromToken,
		isAdminRole,
	} = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!isLoading) {
			if (isProtectedRoute(pathname) && !isAuthenticated) {
				router.push(`/auth?mode=login&callbackUrl=${pathname}`);
			}

			if (pathname.startsWith("/admin") && token) {
				const role = getRoleFromToken(token);
				if (!isAdminRole(role)) {
					router.push("/applicant/dashboard");
				}
			}
		}
	}, [
		isAuthenticated,
		isLoading,
		pathname,
		router,
		token,
		isProtectedRoute,
		getRoleFromToken,
		isAdminRole,
	]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	return <>{children}</>;
}
