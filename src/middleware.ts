import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

const cleanToken = (token: string): string => {
	return token.replace(/^["'](.+)["']$/, "$1").trim();
};

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (isPublicPath(pathname)) {
		return NextResponse.next();
	}

	const authCookie = request.cookies.get("persist:gra-auth");
	let token = null;
	let role = null;

	if (authCookie) {
		try {
			const authData = JSON.parse(authCookie.value);

			let tokenData = null;
			try {
				tokenData = JSON.parse(authData.token || "null");
			} catch (e) {
				tokenData = authData.token;
			}

			if (tokenData) {
				token = cleanToken(tokenData);

				try {
					const decoded = jwtDecode<DecodedToken>(token);
					role = decoded?.role;
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

	if (pathname.startsWith("/applicant") || pathname.startsWith("/admin")) {
		if (!token) {
			console.log("[Middleware] No token, redirecting to login:", pathname);
			const url = new URL("/auth", request.url);
			url.searchParams.set("mode", "login");
			url.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(url);
		}

		if (pathname.startsWith("/admin")) {
			const upperRole = role?.toUpperCase();
			if (upperRole !== "ADMIN" && upperRole !== "SUPER_ADMIN") {
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
