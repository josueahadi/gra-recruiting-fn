import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
	"/",
	"/auth",
	"/about",
	"/contact",
	"/api",
	"/favicon.ico",
];

const isPublicPath = (path: string) => {
	return publicPaths.some(
		(publicPath) => path === publicPath || path.startsWith(`${publicPath}?`),
	);
};

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const authCookie = request.cookies.get("persist:gra-auth");
	let token = null;

	if (authCookie) {
		try {
			const authData = JSON.parse(authCookie.value);
			const tokenData = JSON.parse(authData.token);
			token = tokenData;
		} catch (error) {
			console.error("Error parsing auth cookie:", error);
		}
	}

	if (
		(pathname.startsWith("/applicant") || pathname.startsWith("/admin")) &&
		!isPublicPath(pathname)
	) {
		if (!token) {
			const url = new URL("/auth", request.url);
			url.searchParams.set("mode", "login");
			url.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/applicant/:path*", "/admin/:path*"],
};
