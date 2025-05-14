"use client";

import { useResetPassword } from "@/hooks/use-reset-password";
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
import PasswordStrengthMeter from "@/components/auth/password-strength-meter";
import { useState, useEffect } from "react";
import { AUTH_CONSTANTS } from "@/constants";

export default function ResetPasswordPage() {
	const {
		step,
		email,
		code,
		password,
		confirmPassword,
		showPassword,
		isLoading,
		error,
		setEmail,
		setCode,
		setPassword,
		setConfirmPassword,
		setShowPassword,
		clearError,
		requestReset,
		verifyCode,
		resetPassword,
		resendCode,
		goToLogin,
		goBack,
	} = useResetPassword();

	// State for resend cooldown
	const [resendCooldown, setResendCooldown] = useState(false);
	const [cooldownTime, setCooldownTime] = useState(0);

	// Handle form submissions
	const handleRequestResetSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		requestReset();
	};

	const handleVerifyCodeSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		verifyCode();
	};

	const handleResetPasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		resetPassword();
	};

	const handleResendCode = () => {
		if (resendCooldown) return;

		resendCode();
		setResendCooldown(true);
		setCooldownTime(60);

		const interval = setInterval(() => {
			setCooldownTime((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setResendCooldown(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	useEffect(() => {
		return () => {
			setCooldownTime(0);
			setResendCooldown(false);
		};
	}, []);

	return (
		<div className="w-full max-w-md mx-auto ">
			{step === "request" && (
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.request.title}
						</CardTitle>
						<CardDescription className="text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.request.subtitle}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start">
								<AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
								<p>{error}</p>
							</div>
						)}

						<form onSubmit={handleRequestResetSubmit} className="space-y-4">
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
								className="w-full bg-primary-base hover:bg-custom-skyBlue font-bold"
								disabled={isLoading}
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
								className="w-full flex items-center justify-center "
								onClick={goToLogin}
							>
								<ChevronLeft className="h-4 w-4" />
								Back to Login
							</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{step === "verify" && (
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.verify.title}
						</CardTitle>
						<CardDescription className="text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.verify.subtitle}
							<span className="block font-medium text-primary-base mt-1">
								{email}
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start">
								<AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
								<p>{error}</p>
							</div>
						)}

						<form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="code">Verification Code</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
									<Input
										id="code"
										type="text"
										placeholder="Enter 6-digit code"
										className="pl-10 text-left text-lg tracking-wider"
										value={code}
										onChange={(e) => {
											// Only allow digits and max length of 6
											const value = e.target.value
												.replace(/\D/g, "")
												.slice(0, 6);
											setCode(value);
											clearError();
										}}
										required
										maxLength={6}
										pattern="\d{6}"
										inputMode="numeric"
									/>
								</div>
								<p className="text-xs text-gray-500">
									The code is valid for 5 minutes. If you don&apos;t receive it,
									check your spam folder.
								</p>
							</div>

							<Button
								type="submit"
								className="w-full bg-primary-base hover:bg-custom-skyBlue font-bold"
								disabled={isLoading}
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
									disabled={isLoading || resendCooldown}
								>
									{resendCooldown
										? `Resend available in ${cooldownTime}s`
										: "Resend Code"}
								</Button>

								<Button
									type="button"
									variant="ghost"
									className="w-full flex items-center justify-center"
									onClick={goBack}
									disabled={isLoading}
								>
									<ChevronLeft className="h-4 w-4 mr-2" />
									Back
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{step === "reset" && (
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.reset.title}
						</CardTitle>
						<CardDescription className="text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.reset.subtitle}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start">
								<AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
								<p>{error}</p>
							</div>
						)}

						<form onSubmit={handleResetPasswordSubmit} className="space-y-4">
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

								{password && (
									<PasswordStrengthMeter password={password} className="mt-1" />
								)}
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
								{password &&
									confirmPassword &&
									password !== confirmPassword && (
										<p className="text-red-500 text-sm mt-1">
											Passwords don&apos;t match
										</p>
									)}
							</div>

							<Button
								type="submit"
								className="w-full bg-primary-base hover:bg-custom-skyBlue font-bold"
								disabled={isLoading || password !== confirmPassword}
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
								onClick={goBack}
								disabled={isLoading}
							>
								<ChevronLeft className="h-4 w-4 mr-2" />
								Back
							</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{step === "success" && (
				<Card>
					<CardHeader>
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Check className="h-8 w-8 text-green-600" />
						</div>
						<CardTitle className="text-2xl font-bold text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.success.title}
						</CardTitle>
						<CardDescription className="text-center">
							{AUTH_CONSTANTS.RESET_PASSWORD.steps.success.subtitle}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							className="w-full bg-primary-base hover:bg-custom-skyBlue font-bold"
							onClick={goToLogin}
						>
							Back to Login
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
