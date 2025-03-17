// import type { NextRequest } from "next/server";

// Uncomment this block when you're ready to implement authentication
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
//
// const publicPaths = [
//   "/",
//   "/about",
//   "/solution",
//   "/contact",
//   "/api",
//   "/favicon.ico",
// ];

// export async function middleware( NextRequest) {
// Authentication logic would go here when needed
// Uncomment and implement when ready to use authentication
// const { pathname } = req.nextUrl;
// if (pathname.startsWith("/dashboard")) {
//   const token = await getToken({ req });
//   if (!token) {
//     const loginUrl = new URL("/login", req.url);
//     loginUrl.searchParams.set("callbackUrl", req.url);
//     return NextResponse.redirect(loginUrl);
//   }
// }
// return NextResponse.next();
// }

// export const config = {
// 	matcher: ["/dashboard/:path*"],
// };
