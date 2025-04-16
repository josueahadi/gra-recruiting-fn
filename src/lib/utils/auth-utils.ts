import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types";

export enum Role {
	ADMIN = "ADMIN",
	SUPER_ADMIN = "SUPER_ADMIN",
	USER = "USER",
}

export type UserType = "admin" | "applicant";

export const cleanToken = (token: string | null): string => {
	if (!token) return "";
	return token.replace(/^["'](.+)["']$/, "$1").trim();
};

export const getRoleFromToken = (token: string | null): string | null => {
	if (!token) return null;

	try {
		const cleaned = cleanToken(token);
		const decodedToken = jwtDecode<DecodedToken>(cleaned);
		return decodedToken.role;
	} catch (error) {
		console.error("[Auth Utils] Error decoding token:", error);
		return null;
	}
};

export const isAdminRole = (role: string | null): boolean => {
	if (!role) return false;
	const upperRole = role.toUpperCase();
	return upperRole === Role.ADMIN || upperRole === Role.SUPER_ADMIN;
};

export const getUserType = (role: string | null): UserType => {
	return isAdminRole(role) ? "admin" : "applicant";
};

export const isTokenExpired = (
	token: string | null,
): boolean => {
	if (!token) return true;

	try {
		const cleaned = cleanToken(token);
		const decoded = jwtDecode<DecodedToken>(cleaned);

		if (!decoded.exp) return true;

		const currentTime = Math.floor(Date.now() / 1000);
		return decoded.exp <= currentTime;
	} catch (error) {
		console.error("[Auth Utils] Error checking token expiration:", error);
		return true;
	}
};

export const isProtectedRoute = (path: string): boolean => {
	return path.startsWith("/applicant") || path.startsWith("/admin");
};

export const formatUserName = (
	firstName?: string,
	lastName?: string,
): string => {
	if (!firstName && !lastName) return "User";

	if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	}

	return firstName || lastName || "User";
};

export const syncTokenToCookie = (token: string | null): void => {
	if (typeof document === 'undefined') return;
	
	if (token) {
		document.cookie = `auth-token=${token}; path=/; max-age=2592000; SameSite=Lax`;
	} else {
		document.cookie = 'auth-token=; path=/; max-age=0';
	}
};

export const getTokenFromCookie = (): string | null => {
	if (typeof document === 'undefined') return null;
	
	const cookieString = document.cookie;
	const cookies = cookieString.split(';');
	
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === 'auth-token' && value) {
			return value;
		}
	}
	
	return null;
};
