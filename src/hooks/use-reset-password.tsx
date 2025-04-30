"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";

export type ResetPasswordStep = "request" | "verify" | "reset" | "success";

interface UseResetPasswordOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useResetPassword = (options?: UseResetPasswordOptions) => {
	const router = useRouter();

	const [step, setStep] = useState<ResetPasswordStep>("request");
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [requestToken, setRequestToken] = useState<string | null>(null);
	const [verifyToken, setVerifyToken] = useState<string | null>(null);

	const clearError = useCallback(() => {
		if (error) setError(null);
	}, [error]);

	const requestReset = useCallback(async () => {
		if (!email) {
			setError("Please enter your email address");
			return;
		}

		clearError();
		setIsLoading(true);

		try {
			const response = await api.post(
				"/api/v1/auth/request-reset-password-via-email",
				{
					email,
				},
			);

			const { accessToken: token, message } = response.data;
			setRequestToken(token);
			setStep("verify");

			showToast({
				title: "Verification code sent",
				description: "Please check your email for the code",
				variant: "success",
			});

			if (options?.onSuccess) {
				options.onSuccess();
			}
		} catch (error: any) {
			console.error("Error requesting password reset:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to send verification code. Please try again.";
			setError(errorMessage);

			if (options?.onError) {
				options.onError(new Error(errorMessage));
			}
		} finally {
			setIsLoading(false);
		}
	}, [email, clearError, options]);

	const verifyCode = useCallback(async () => {
		if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
			setError("Please enter a valid 6-digit code");
			return;
		}

		clearError();
		setIsLoading(true);

		try {
			if (!requestToken) {
				throw new Error("Session expired. Please try again.");
			}

			const response = await api.post(
				"/api/v1/auth/verify-reset-password-via-email",
				{ email, code },
				{ headers: { Authorization: `Bearer ${requestToken}` } },
			);

			const { accessToken: newToken } = response.data;
			setVerifyToken(newToken);

			setStep("reset");
			showToast({
				title: "Code verified",
				description: "Please set your new password",
				variant: "success",
			});

			if (options?.onSuccess) {
				options.onSuccess();
			}
		} catch (error: any) {
			console.error("Error verifying code:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Invalid or expired code. Please try again.";
			setError(errorMessage);

			if (options?.onError) {
				options.onError(new Error(errorMessage));
			}
		} finally {
			setIsLoading(false);
		}
	}, [code, email, requestToken, clearError, options]);

	const resetPassword = useCallback(async () => {
		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords don't match");
			return;
		}

		clearError();
		setIsLoading(true);

		try {
			if (!verifyToken) {
				throw new Error("Verification session expired. Please start over.");
			}

			await api.patch(
				"/api/v1/auth/reset-password",
				{ password },
				{ headers: { Authorization: `Bearer ${verifyToken}` } },
			);

			setStep("success");
			showToast({
				title: "Password reset successful",
				description: "You can now log in with your new password",
				variant: "success",
			});

			if (options?.onSuccess) {
				options.onSuccess();
			}
		} catch (error: any) {
			console.error("Error resetting password:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to reset password. Please try again.";
			setError(errorMessage);

			if (options?.onError) {
				options.onError(new Error(errorMessage));
			}
		} finally {
			setIsLoading(false);
		}
	}, [password, confirmPassword, verifyToken, clearError, options]);

	const resendCode = useCallback(async () => {
		clearError();
		setIsLoading(true);

		try {
			const response = await api.post(
				"/api/v1/auth/request-reset-password-via-email",
				{
					email,
				},
			);

			const { accessToken: token } = response.data;
			setRequestToken(token);

			showToast({
				title: "New code sent",
				description: "Please check your email for the new verification code",
				variant: "success",
			});
		} catch (error: any) {
			console.error("Error resending code:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to resend code. Please try again.";
			setError(errorMessage);

			if (options?.onError) {
				options.onError(new Error(errorMessage));
			}
		} finally {
			setIsLoading(false);
		}
	}, [email, clearError, options]);

	const goToLogin = useCallback(() => {
		router.push("/auth?mode=login");
	}, [router]);

	const goBack = useCallback(() => {
		switch (step) {
			case "verify":
				setStep("request");
				break;
			case "reset":
				setStep("verify");
				break;
			default:
				break;
		}
	}, [step]);

	return {
		// State
		step,
		email,
		code,
		password,
		confirmPassword,
		showPassword,
		isLoading,
		error,

		// Setters
		setStep,
		setEmail,
		setCode,
		setPassword,
		setConfirmPassword,
		setShowPassword,
		clearError,

		// Actions
		requestReset,
		verifyCode,
		resetPassword,
		resendCode,
		goToLogin,
		goBack,
	};
};

export default useResetPassword;
