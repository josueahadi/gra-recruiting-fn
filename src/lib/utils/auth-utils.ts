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
	bufferTimeInSeconds = 300,
): boolean => {
	if (!token) return true;

	try {
		const cleaned = cleanToken(token);
		const decoded = jwtDecode<DecodedToken>(cleaned);

		if (!decoded.exp) return true;

		const currentTime = Math.floor(Date.now() / 1000);
		return decoded.exp <= currentTime + bufferTimeInSeconds;
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
