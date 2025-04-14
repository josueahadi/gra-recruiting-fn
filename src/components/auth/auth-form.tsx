/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { EducationBackgroundFields } from "./background-fields";
import { ContactInfoFields } from "./contact-info-fields";
import GoogleAuthButton from "./google-auth-button";
import { LoginFields } from "./login-fields";
import ProgressIndicator from "./progress-indicator";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const REGISTRATION_STEPS = [
	{ number: 1, label: "Contact Info" },
	{ number: 2, label: "Education Background" },
];

interface AuthFormProps {
	mode: "login" | "signup";
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

const ErrorDisplay = ({ message }: { message: string | null }) => {
	if (!message) return null;

	return (
		<div className="animate-in fade-in-50 duration-300 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
			<div className="flex items-start">
				<div className="flex-shrink-0">
					<svg
						className="h-5 w-5 text-red-500"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<title>Error</title>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<div className="ml-3">
					<p className="text-sm font-medium">{message}</p>
				</div>
			</div>
		</div>
	);
};

const AuthForm = ({ mode, onSuccess, onError }: AuthFormProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/applicant/dashboard";
	const { toast } = useToast();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		career: "",
		levelOfEducation: "",
		university: "",
		graduationDate: "",
		major: "",
		terms: true,
		linkedinProfileUrl: "",
		githubProfileUrl: "",
	});

	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [currentStep, setCurrentStep] = useState(1);
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		isLoading,
		showPassword,
		setShowPassword,
		signIn,
		signUp,
		handleGoogleAuth,
		error: authError,
		clearErrors,
	} = useAuth({
		onSuccess: () => {
			if (onSuccess) {
				onSuccess();
			} else {
				router.push(callbackUrl);
			}
		},
		onError: (error) => {
			const errorMessage =
				error.message || "Please check your information and try again.";
			setServerError(errorMessage);

			toast({
				title: mode === "login" ? "Login failed" : "Registration failed",
				description: errorMessage,
				variant: "destructive",
			});

			if (onError) onError(error);
		},
	});

	useEffect(() => {
		setServerError(null);
		clearErrors?.();
	}, [mode, formData, clearErrors]);

	useEffect(() => {
		if (authError) {
			setServerError(authError);
		}
	}, [authError]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: "" }));
		}

		if (serverError) {
			setServerError(null);
		}
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: "" }));
		}

		if (serverError) {
			setServerError(null);
		}
	};

	const toggleMode = () => {
		router.push(`/auth?mode=${mode === "login" ? "signup" : "login"}`);
	};

	const validateLoginForm = () => {
		const errors: Record<string, string> = {};
		let isValid = true;

		if (!formData.email) {
			errors.email = "Email is required";
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = "Email is invalid";
			isValid = false;
		}

		if (!formData.password) {
			errors.password = "Password is required";
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	const validateSignupStep1 = () => {
		const errors: Record<string, string> = {};
		let isValid = true;

		if (!formData.firstName) {
			errors.firstName = "First name is required";
			isValid = false;
		}

		if (!formData.lastName) {
			errors.lastName = "Last name is required";
			isValid = false;
		}

		if (!formData.email) {
			errors.email = "Email is required";
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = "Email is invalid";
			isValid = false;
		}

		if (!formData.password) {
			errors.password = "Password is required";
			isValid = false;
		} else if (formData.password.length < 8) {
			errors.password = "Password must be at least 8 characters";
			isValid = false;
		}

		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = "Passwords don't match";
			isValid = false;
		}

		if (!formData.terms) {
			errors.terms = "You must accept the terms and conditions";
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	const validateSignupStep2 = () => {
		const errors: Record<string, string> = {};
		let isValid = true;

		if (!formData.career) {
			errors.career = "Career field is required";
			isValid = false;
		}

		if (!formData.levelOfEducation) {
			errors.levelOfEducation = "Education level is required";
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setServerError(null);

		if (mode === "login") {
			if (validateLoginForm()) {
				signIn({
					email: formData.email,
					password: formData.password,
				});
			}
		} else {
			if (currentStep === 1) {
				if (validateSignupStep1()) {
					setCurrentStep(2);
				}
			} else {
				if (validateSignupStep2()) {
					signUp({
						firstName: formData.firstName,
						lastName: formData.lastName,
						email: formData.email,
						password: formData.password,
						career: formData.career,
						levelOfEducation: formData.levelOfEducation,
						university: formData.university,
						graduationDate: formData.graduationDate,
						major: formData.major,
						linkedinProfileUrl: formData.linkedinProfileUrl,
						githubProfileUrl: formData.githubProfileUrl,
					});
				}
			}
		}
	};

	return (
		<div>
			{mode === "signup" && (
				<ProgressIndicator
					currentStep={currentStep}
					steps={REGISTRATION_STEPS}
				/>
			)}
			<div className="max-w-md mx-auto space-y-6">
				<FormHeader mode={mode} currentStep={currentStep} />

				{serverError && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
						{serverError}
					</div>
				)}

				<form onSubmit={handleFormSubmit} className="space-y-6">
					<ErrorDisplay message={serverError || authError} />
					{mode === "login" && (
						<LoginFields
							email={formData.email}
							password={formData.password}
							errors={formErrors}
							onEmailChange={(value) =>
								handleInputChange({
									target: { name: "email", value, type: "text" },
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								} as any)
							}
							onPasswordChange={(value) =>
								handleInputChange({
									target: { name: "password", value, type: "text" },
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								} as any)
							}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
					)}

					{mode === "signup" && currentStep === 1 && (
						<ContactInfoFields
							firstName={formData.firstName}
							lastName={formData.lastName}
							email={formData.email}
							password={formData.password}
							confirmPassword={formData.confirmPassword}
							terms={formData.terms}
							errors={formErrors}
							onInputChange={(name, value) =>
								handleInputChange({
									target: {
										name,
										value,
										type: typeof value === "boolean" ? "checkbox" : "text",
									},
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								} as any)
							}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
					)}

					{mode === "signup" && currentStep === 2 && (
						<EducationBackgroundFields
							career={formData.career}
							levelOfEducation={formData.levelOfEducation}
							university={formData.university}
							graduationDate={formData.graduationDate}
							major={formData.major}
							linkedinProfileUrl={formData.linkedinProfileUrl}
							githubProfileUrl={formData.githubProfileUrl}
							errors={formErrors}
							onInputChange={(name, value) =>
								handleInputChange({
									target: { name, value, type: "text" },
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								} as any)
							}
							onSelectChange={handleSelectChange}
							onBack={() => setCurrentStep(1)}
							isLoading={isLoading}
						/>
					)}

					{(mode === "login" || (mode === "signup" && currentStep === 1)) && (
						<Button
							type="submit"
							className="w-full h-12 rounded-xl bg-primary-base hover:bg-primary-dark text-white font-semibold"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="flex items-center justify-center">
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<title>Loading spinner</title>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									{mode === "login" ? "Signing in..." : "Next Step..."}
								</span>
							) : mode === "login" ? (
								AUTH_CONSTANTS.LOGIN.buttons.submit
							) : currentStep === 1 ? (
								AUTH_CONSTANTS.SIGNUP.buttons.next
							) : (
								AUTH_CONSTANTS.SIGNUP.buttons.submit
							)}
						</Button>
					)}
				</form>

				{(mode === "login" || (mode === "signup" && currentStep === 1)) && (
					<>
						<div className="flex items-center">
							<div className="flex-grow border-t border-gray-400/75" />
							<span className="mx-4 text-sm font-bold text-gray-700 uppercase">
								Or
							</span>
							<div className="flex-grow border-t border-gray-400/75" />
						</div>

						<GoogleAuthButton onClick={handleGoogleAuth} />

						<p className="text-center text-sm text-gray-600">
							{mode === "login"
								? AUTH_CONSTANTS.LOGIN.noAccount
								: AUTH_CONSTANTS.SIGNUP.hasAccount}{" "}
							<button
								onClick={toggleMode}
								type="button"
								className="text-primary-base hover:text-primary-dark font-semibold"
							>
								{mode === "login"
									? AUTH_CONSTANTS.LOGIN.signUpLink
									: AUTH_CONSTANTS.SIGNUP.signInLink}
							</button>
						</p>

						{mode === "login" && (
							<p className="text-center text-sm">
								<Link
									href="/auth/reset-password"
									className="text-primary-base hover:text-primary-dark font-medium"
								>
									Forgot your password?
								</Link>
							</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};

const FormHeader = ({
	mode,
	currentStep,
}: {
	mode: "login" | "signup";
	currentStep: number;
}) => (
	<div className="text-center mb-8">
		<h1 className="text-3xl font-bold text-gray-900">
			{mode === "login"
				? AUTH_CONSTANTS.LOGIN.title
				: currentStep === 1
					? AUTH_CONSTANTS.SIGNUP.steps.contact.title
					: AUTH_CONSTANTS.SIGNUP.steps.education.title}
		</h1>
		<p className="mt-2 text-gray-600">
			{mode === "login"
				? AUTH_CONSTANTS.LOGIN.subtitle
				: currentStep === 1
					? AUTH_CONSTANTS.SIGNUP.steps.contact.subtitle
					: ""}
		</p>
	</div>
);

export default AuthForm;
