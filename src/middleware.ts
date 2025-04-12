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

	if (isPublicPath(pathname)) {
		return NextResponse.next();
	}

	const authCookie = request.cookies.get("persist:gra-auth");
	let token = null;
	let role = null;

	if (authCookie) {
		try {
			const authData = JSON.parse(authCookie.value);
			const tokenData = JSON.parse(authData.token || "null");
			token = tokenData;

			if (token) {
				const decodedToken = jwtDecode<DecodedToken>(token);
				role = decodedToken.role;
			}
		} catch (error) {
			console.error("Error parsing auth cookie:", error);
		}
	}
	if (pathname.startsWith("/applicant") || pathname.startsWith("/admin")) {
		if (!token) {
			const url = new URL("/auth", request.url);
			url.searchParams.set("mode", "login");
			url.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(url);
		}

		if (
			pathname.startsWith("/admin") &&
			role !== "ADMIN" &&
			role !== "SUPER_ADMIN"
		) {
			return NextResponse.redirect(
				new URL("/applicant/dashboard", request.url),
			);
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
