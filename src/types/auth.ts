export interface RegisterFormData {
	fullName: string;
	email: string;
	password: string;
	terms: boolean;
}

export interface RegisterFormProps {
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export interface FormStepProps {
	isActive: boolean;
	completed?: boolean;
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
