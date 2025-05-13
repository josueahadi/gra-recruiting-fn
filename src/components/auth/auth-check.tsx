"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { isProtectedRoute, getRoleFromToken, isAdminRole } from "@/lib/utils/auth-utils";

export function AuthCheck({ children }: { children: React.ReactNode }) {
	const { token, isAuthenticated } = useAuthStore();
	const router = useRouter();
	const pathname = usePathname();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const prevPathRef = useRef(pathname);

	useEffect(() => {
		// Prevent multiple redirects
		if (isRedirecting) return;
		
		// Skip if path hasn't changed
		if (prevPathRef.current === pathname) {
			prevPathRef.current = pathname;
			return;
		}
		
		prevPathRef.current = pathname;
		
		// Skip checks on auth pages
		if (pathname.startsWith("/auth")) {
			// Redirect authenticated users away from auth pages
			if (isAuthenticated && token) {
				// Don't redirect if already navigating away from auth
				if (pathname === "/auth" || 
					pathname === "/auth/login" || 
					pathname === "/auth/signup" ||
					pathname.includes("mode=")) {
					const role = getRoleFromToken(token);
					const dashboardPath = isAdminRole(role) 
						? "/admin/dashboard" 
						: "/applicant/dashboard";
					console.log("[AuthCheck] Redirecting from auth page to:", dashboardPath);
					setIsRedirecting(true);
					router.replace(dashboardPath);
					setTimeout(() => setIsRedirecting(false), 1000);
				}
			}
			return;
		}

		if (isProtectedRoute(pathname) && !isAuthenticated) {
			console.log("[AuthCheck] Unauthorized access to protected route:", pathname);
			setIsRedirecting(true);
			router.replace("/auth?mode=login");
			setTimeout(() => setIsRedirecting(false), 1000);
			return;
		}

		if (pathname.startsWith("/admin") && token) {
			const role = getRoleFromToken(token);
			if (!isAdminRole(role)) {
				console.log("[AuthCheck] Non-admin user attempting to access admin route");
				setIsRedirecting(true);
				router.replace("/applicant/dashboard");
				setTimeout(() => setIsRedirecting(false), 1000);
				return;
			}
		}

		if (pathname.startsWith("/applicant") && token) {
			const role = getRoleFromToken(token);
			if (isAdminRole(role)) {
				console.log("[AuthCheck] Admin user attempting to access applicant-specific route");
				setIsRedirecting(true);
				router.replace("/admin/dashboard");
				setTimeout(() => setIsRedirecting(false), 1000);
				return;
			}
		}
	}, [isAuthenticated, pathname, router, token, isRedirecting]);

	// Render children directly without loading states
	return <>{children}</>;
}

export default AuthCheck;
