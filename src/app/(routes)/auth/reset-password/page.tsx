"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	ChevronLeft,
	Mail,
	KeyRound,
	Check,
	AlertCircle,
	Loader2,
	Eye,
	EyeOff,
} from "lucide-react";

type PasswordResetStep = "request" | "verify" | "reset" | "success";

export default function ResetPasswordPage() {
	const router = useRouter();
	const [step, setStep] = useState<PasswordResetStep>("request");

	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);

	const clearError = useCallback(() => {
		if (error) setError(null);
	}, [error]);

	const handleRequestReset = async (e: React.FormEvent) => {
		e.preventDefault();
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
			setAccessToken(token);
			setStep("verify");

			showToast({
				title: "Verification code sent",
				description: "Please check your email for the code",
				variant: "success",
			});
		} catch (error: any) {
			console.error("Error requesting password reset:", error);
			setError(
				error.response?.data?.message ||
					"Failed to send verification code. Please try again.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();

		if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
			setError("Please enter a valid 6-digit code");
			return;
		}

		setIsLoading(true);

		try {
			if (!accessToken) {
				throw new Error("Session expired. Please try again.");
			}

			await api.post(
				"/api/v1/auth/verify-reset-password-via-email",
				{ email, code },
				{ headers: { Authorization: `Bearer ${accessToken}` } },
			);

			setStep("reset");
			showToast({
				title: "Code verified",
				description: "Please set your new password",
				variant: "success",
			});
		} catch (error: any) {
			console.error("Error verifying code:", error);
			setError(
				error.response?.data?.message ||
					"Invalid or expired code. Please try again.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();

		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords don't match");
			return;
		}

		setIsLoading(true);

		try {
			if (!accessToken) {
				throw new Error("Session expired. Please try again.");
			}

			await api.patch(
				"/api/v1/auth/reset-password",
				{ password },
				{ headers: { Authorization: `Bearer ${accessToken}` } },
			);

			setStep("success");
			showToast({
				title: "Password reset successful",
				description: "You can now log in with your new password",
				variant: "success",
			});
		} catch (error: any) {
			console.error("Error resetting password:", error);
			setError(
				error.response?.data?.message ||
					"Failed to reset password. Please try again.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendCode = async () => {
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
			setAccessToken(token);

			showToast({
				title: "New code sent",
				description: "Please check your email for the new verification code",
				variant: "success",
			});
		} catch (error: any) {
			console.error("Error resending code:", error);
			setError(
				error.response?.data?.message ||
					"Failed to resend code. Please try again.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToLogin = () => {
		router.push("/auth?mode=login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
			{step === "request" && (
				<Card className="w-full max-w-md mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							Reset Your Password
						</CardTitle>
						<CardDescription className="text-center">
							Enter your email and we'll send you a verification code
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start">
								<AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
								<p>{error}</p>
							</div>
						)}

						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
									<Input
										id="email"
										type="email"
										placeholder="Enter your email address"
										className="pl-10"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											clearError();
										}}
										required
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
								onClick={handleRequestReset}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending code...
									</>
								) : (
									"Send Reset Code"
								)}
							</Button>

							<Button
								type="button"
								variant="ghost"
								className="w-full flex items-center justify-center"
								onClick={handleBackToLogin}
							>
								<ChevronLeft className="h-4 w-4 mr-2" />
								Back to Login
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Verify Code Step */}
			{step === "verify" && (
				<Card className="w-full max-w-md mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							Verify Code
						</CardTitle>
						<CardDescription className="text-center">
							Enter the 6-digit verification code sent to {email}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start">
								<AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
								<p>{error}</p>
							</div>
						)}

						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="code">Verification Code</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
									<Input
										id="code"
										type="text"
										placeholder="Enter 6-digit code"
										className="pl-10"
										value={code}
										onChange={(e) => {
											setCode(e.target.value.trim());
											clearError();
										}}
										required
										maxLength={6}
									/>
								</div>
								<p className="text-xs text-gray-500">
									The code is valid for 5 minutes. If you don't receive it,
									check your spam folder.
								</p>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
								onClick={handleVerifyCode}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Verifying...
									</>
								) : (
									"Verify Code"
								)}
							</Button>

							<div className="flex flex-col space-y-2">
								<Button
									type="button"
									variant="outline"
									className="w-full"
									onClick={handleResendCode}
									disabled={isLoading}
								>
									Resend Code
								</Button>

								<Button
									type="button"
									variant="ghost"
									className="w-full flex items-center justify-center"
									onClick={() => setStep("request")}
									disabled={isLoading}
								>
									<ChevronLeft className="h-4 w-4 mr-2" />
									Back
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{step === "reset" && (
				<Card className="w-full max-w-md mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							Create New Password
						</CardTitle>
						<CardDescription className="text-center">
							Your password must be at least 8 characters
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start">
								<AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
								<p>{error}</p>
							</div>
						)}

						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="password">New Password</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter new password"
										className="pl-10 pr-10"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											clearError();
										}}
										required
									/>
									<button
										type="button"
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
									<Input
										id="confirmPassword"
										type={showPassword ? "text" : "password"}
										placeholder="Confirm new password"
										className="pl-10"
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
											clearError();
										}}
										required
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
								onClick={handleResetPassword}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating password...
									</>
								) : (
									"Reset Password"
								)}
							</Button>

							<Button
								type="button"
								variant="ghost"
								className="w-full flex items-center justify-center"
								onClick={() => setStep("verify")}
								disabled={isLoading}
							>
								<ChevronLeft className="h-4 w-4 mr-2" />
								Back
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Success Step */}
			{step === "success" && (
				<Card className="w-full max-w-md mx-auto">
					<CardHeader>
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Check className="h-8 w-8 text-green-600" />
						</div>
						<CardTitle className="text-2xl font-bold text-center">
							Password Reset Successful
						</CardTitle>
						<CardDescription className="text-center">
							Your password has been updated successfully
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button className="w-full" onClick={handleBackToLogin}>
							Back to Login
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
