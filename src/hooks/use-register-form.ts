import { useToast } from "@/hooks/use-toast";
import type { RegisterFormData } from "@/types/auth";
import { useState } from "react";

interface UseRegisterFormProps {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onOpenChange?: (open: boolean) => void;
}

export const useRegisterForm = ({
	onSuccess,
	onError,
	onOpenChange,
}: UseRegisterFormProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (data: RegisterFormData) => {
		setIsLoading(true);

		console.log(data);

		try {
			// Add your API call here
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: "Success!",
				description: "Your account has been created successfully.",
			});

			onSuccess?.();
			onOpenChange?.(false);
		} catch (error) {
			const err = error as Error;
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
			onError?.(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			// Implement Google sign-in logic
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast({
				title: "Success!",
				description: "Successfully signed in with Google.",
			});
		} catch (error) {
			console.error("Google sign-in error:", error);
			toast({
				title: "Error",
				description: "Failed to sign in with Google. Please try again.",
				variant: "destructive",
			});
		}
	};

	return {
		isLoading,
		showPassword,
		setShowPassword,
		handleSubmit,
		handleGoogleSignIn,
	};
};
