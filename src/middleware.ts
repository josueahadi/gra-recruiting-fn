import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
	cleanToken,
	isAdminRole,
	isTokenExpired,
} from "@/lib/utils/auth-utils";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";

const publicPaths = [
	"/",
	"/auth",
	"/about",
	"/contact",
	"/api",
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

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow access to public paths
	if (isPublicPath(pathname)) {
		return NextResponse.next();
	}

	const authCookie = request.cookies.get("persist:gra-auth");
	let token = null;
	let role = null;
	let isExpired = true;

	// Try to extract and validate token
	if (authCookie) {
		try {
			const authData = JSON.parse(authCookie.value);
			let tokenData = null;
			try {
				tokenData = JSON.parse(authData.token || "null");
			} catch (e) {
				tokenData = authData.token;
				console.log(
					`[Middleware] Failed to parse token, using raw value: ${e}`,
					authData.token,
				);
			}

			if (tokenData) {
				token = cleanToken(tokenData);

				try {
					const decoded = jwtDecode<DecodedToken>(token);
					role = decoded?.role;
					isExpired = isTokenExpired(token);

					if (isExpired) {
						console.log("[Middleware] Token expired, redirecting to login");
						token = null;
						role = null;
					}
				} catch (error) {
					console.error("[Middleware] Error decoding token:", error);
					token = null;
					role = null;
				}
			}
		} catch (error) {
			console.error("[Middleware] Error parsing auth cookie:", error);
		}
	}

	// Handle protected routes
	if (pathname.startsWith("/applicant") || pathname.startsWith("/admin")) {
		// Redirect unauthenticated users to login
		if (!token) {
			console.log(
				"[Middleware] No valid token, redirecting to login:",
				pathname,
			);
			// Simple redirect to login without callback URL
			return NextResponse.redirect(new URL("/auth?mode=login", request.url));
		}

		// Redirect non-admin users trying to access admin routes
		if (pathname.startsWith("/admin")) {
			if (!isAdminRole(role)) {
				console.log("[Middleware] Unauthorized admin access, role:", role);
				return NextResponse.redirect(
					new URL("/applicant/dashboard", request.url),
				);
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/applicant/:path*",
		"/admin/:path*",
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
