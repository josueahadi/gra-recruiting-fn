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
		if (!isCheckingAuth && !isRedirecting) {
			if (isProtectedRoute(pathname) && !isAuthenticated) {
				setIsRedirecting(true);
				router.push(
					`/auth?mode=login&callbackUrl=${encodeURIComponent(pathname)}`,
				);
				return;
			}

			if (pathname.startsWith("/admin") && token) {
				const role = getRoleFromToken(token);
				if (!isAdminRole(role)) {
					setIsRedirecting(true);
					router.push("/applicant");
					return;
				}
			}
		}
	}, [
		isAuthenticated,
		isCheckingAuth,
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
