import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

	// Check if we're in a redirection loop
	const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0');
	if (redirectCount > 2) {
		console.error(`[Middleware] Detected redirect loop on path: ${pathname}`);
		return NextResponse.next();
	}

	// Allow access to public paths
	if (isPublicPath(pathname)) {
		console.log(`[Middleware] Public path access: ${pathname}`);
		return NextResponse.next();
	}

	// Note: Server middleware cannot access localStorage
	// We need to use cookies instead, but Zustand uses localStorage
	// For now, just let the client-side AuthCheck handle auth
	
	// For protected routes that must be checked server-side
	if (pathname.startsWith("/api/protected")) {
		// This would need a properly synced cookie to verify auth
		// For now, return next and let client-side handle it
		return NextResponse.next();
	}

	// Let client-side handle all auth checks for now
	console.log(`[Middleware] Proceeding to: ${pathname} (auth checked client-side)`);
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/applicant/:path*",
		"/admin/:path*",
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};

