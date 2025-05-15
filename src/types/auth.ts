import type { JwtPayload } from "jwt-decode";

export interface User {
	id: string;
	email: string;
	name: string;
	role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface AuthResponse {
	user: User;
	accessToken: string;
}

export interface AuthCredentials {
	email: string;
	password: string;
	department?: string;
	institution?: string;
	educationLevel?: string;
	program?: string;
	graduationYear?: string;
}

export interface SignUpCredentials extends AuthCredentials {
	name: string;
}

export interface SignUpFormProps {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onModeChange?: () => void;
	onOpenChange?: (open: boolean) => void;
}

export interface FormStepProps {
	isActive: boolean;
	stepNumber: number;
	label: string;
}

export interface ProgressIndicatorProps {
	currentStep: number;
	steps: Array<{
		label: string;
		number: number;
	}>;
}

export interface DecodedToken extends JwtPayload {
	id: number;
	role: string;
	iat: number;
	exp: number;
}

export interface SignInResponse {
	message: string;
	accessToken: string;
}
