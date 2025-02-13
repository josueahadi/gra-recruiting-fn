export interface User {
	id: string;
	email: string;
	name: string;
	role: "USER" | "ADMIN";
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
	terms: boolean;
}

export interface SignUpFormProps {
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onModeChange?: () => void;
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
