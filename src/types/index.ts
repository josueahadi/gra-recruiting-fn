import type { SVGProps } from "react";

export interface ApiResponse<T> {
	data: T;
	message: string;
	status: number;
}

export interface User {
	id: string;
	email: string;
	name: string;
	role: "USER" | "ADMIN";
}

export interface LoginResponse {
	accessToken: string;
	user: User;
}

export interface AuthCredentials {
	email: string;
	password: string;
}

export interface BackgroundShapeProps {
	className?: string;
	fill?: string;
	fillOpacity?: number;
	stroke?: string;
	strokeWidth?: number;
	variant?: "filled" | "outlined";
	width?: number | string;
	height?: number | string;
}

export interface IconProps extends SVGProps<SVGSVGElement> {
	size?: number;
	color?: string;
}

export * from "./auth";
export * from "./question-types";
