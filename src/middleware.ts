import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicPaths = [
	"/",
	"/auth",
	"/about",
	"/contact",
	"/api/v1/auth",
	"/favicon.ico",
	"/_next",
	"/images",
	"/public",
];

const isPublicPath = (path: string) => {
	return publicPaths.some(
		(publicPath) =>
			path === publicPath ||
			path.startsWith(`${publicPath}/`) ||
			path.startsWith(`${publicPath}?`),
	);
};

const isTokenExpired = (token: string): boolean => {
	try {
		const decoded = jwtDecode<{exp: number}>(token);
		const currentTime = Math.floor(Date.now() / 1000);
		return decoded.exp <= currentTime;
	} catch (error) {
		console.error("[Middleware] Error checking token expiration:", error);
		return true;
	}
};

const isAdminRole = (role: string | null): boolean => {
	if (!role) return false;
	const upperRole = role.toUpperCase();
	return upperRole === "ADMIN" || upperRole === "SUPER_ADMIN";
};

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if we're in a redirection loop
	const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0');
	if (redirectCount > 2) {
		console.error(`[Middleware] Detected redirect loop on path: ${pathname}`);
		return NextResponse.next();
	}

	if (isPublicPath(pathname)) {
		console.log(`[Middleware] Public path access: ${pathname}`);
		return NextResponse.next();
	}

	const authToken = request.cookies.get("auth-token")?.value;
	
	if (pathname.startsWith("/applicant") || pathname.startsWith("/admin") || pathname.startsWith("/api/protected")) {
		// Redirect unauthenticated users to login
		if (!authToken) {
			console.log(`[Middleware] No auth token found for protected route: ${pathname}`);
			const response = NextResponse.redirect(new URL("/auth?mode=login", request.url));
			response.headers.set('x-redirect-count', (redirectCount + 1).toString());
			return response;
		}
		
		// Check token expiration
		if (isTokenExpired(authToken)) {
			console.log(`[Middleware] Expired token for protected route: ${pathname}`);
			const response = NextResponse.redirect(new URL("/auth?mode=login", request.url));
			response.headers.set('x-redirect-count', (redirectCount + 1).toString());
			return response;
		}
		
		// Check admin routes
		if (pathname.startsWith("/admin")) {
			try {
				const decoded = jwtDecode<{role: string}>(authToken);
				if (!isAdminRole(decoded.role)) {
					console.log(`[Middleware] Non-admin attempted to access: ${pathname}`);
					const response = NextResponse.redirect(new URL("/applicant/dashboard", request.url));
					response.headers.set('x-redirect-count', (redirectCount + 1).toString());
					return response;
				}
			} catch (error) {
				console.error("[Middleware] Error decoding token:", error);
				const response = NextResponse.redirect(new URL("/auth?mode=login", request.url));
				response.headers.set('x-redirect-count', (redirectCount + 1).toString());
				return response;
			}
		}

		if (pathname.startsWith("/applicant") && !pathname.startsWith("/admin/applicants")) {
			try {
				const decoded = jwtDecode<{role: string}>(authToken);
				if (isAdminRole(decoded.role)) {
					console.log(`[Middleware] Admin attempted to access applicant route: ${pathname}`);
					const response = NextResponse.redirect(new URL("/admin/dashboard", request.url));
					response.headers.set('x-redirect-count', (redirectCount + 1).toString());
					return response;
				}
			} catch (error) {
				console.error("[Middleware] Error decoding token:", error);
				const response = NextResponse.redirect(new URL("/auth?mode=login", request.url));
				response.headers.set('x-redirect-count', (redirectCount + 1).toString());
				return response;
			}
		}
	}

	console.log(`[Middleware] Access granted to: ${pathname}`);
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/applicant/:path*",
		"/admin/:path*",
		"/api/protected/:path*",
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};

