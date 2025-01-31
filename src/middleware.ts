import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

// const publicPaths = [
// 	"/",
// 	"/about",
// 	"/solution",
// 	"/contact",
// 	"/api",
// 	"/favicon.ico",
// ];

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/dashboard")) {
		const token = await getToken({ req });
		if (!token) {
			const loginUrl = new URL("/login", req.url);
			loginUrl.searchParams.set("callbackUrl", req.url);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
