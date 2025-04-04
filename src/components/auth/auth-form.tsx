"use client";

import { Button } from "@/components/ui/button";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EducationBackgroundFields } from "./background-fields";
import { ContactInfoFields } from "./contact-info-fields";
import GoogleAuthButton from "./google-auth-button";
import { LoginFields } from "./login-fields";
import ProgressIndicator from "./progress-indicator";

const REGISTRATION_STEPS = [
	{ number: 1, label: "Contact Info" },
	{ number: 2, label: "Education Background" },
];

interface AuthFormProps {
	mode: "login" | "signup";
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

const AuthForm = ({ mode, onSuccess, onError }: AuthFormProps) => {
	const router = useRouter();

	const handleSuccess = () => {
		if (onSuccess) {
			onSuccess();
		}

		router.push("/applicant");
	};

	const {
		isLoading,
		showPassword,
		setShowPassword,
		// login,
		// signup,
		handleGoogleAuth,
	} = useAuth({
		onSuccess: handleSuccess,
		onError,
	});

	const [currentStep, setCurrentStep] = useState(1);

	const toggleMode = () => {
		router.push(`/auth?mode=${mode === "login" ? "signup" : "login"}`);
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// const formData = new FormData(e.currentTarget);

		if (mode === "login") {
			// For demo purposes, just redirect to the dashboard without actual API call
			handleSuccess();
			/*
			await login({
				email: formData.get("email") as string,
				password: formData.get("password") as string,
			});
			*/
		} else {
			if (currentStep === 1) {
				setCurrentStep(2);
				return;
			}

			// For demo purposes, just redirect to the dashboard without actual API call
			handleSuccess();

			/*
			await signup({
				name: formData.get("fullName") as string,
				email: formData.get("email") as string,
				password: formData.get("password") as string,
				department: formData.get("department") as string,
				institution: formData.get("institution") as string,
				educationLevel: formData.get("educationLevel") as string,
				program: formData.get("program") as string,
				graduationYear: formData.get("graduationYear") as string,
			});
			*/
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

				<form onSubmit={handleFormSubmit} className="space-y-6">
					{mode === "login" && (
						<LoginFields
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
					)}
					{mode === "signup" && currentStep === 1 && (
						<ContactInfoFields
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
					)}
					{mode === "signup" && currentStep === 2 && (
						<EducationBackgroundFields
							onBack={() => setCurrentStep(1)}
							isLoading={isLoading}
						/>
					)}

					<SubmitButton
						mode={mode}
						currentStep={currentStep}
						isLoading={isLoading}
					/>
				</form>

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
						className="text-primary-base hover:text-primary-base font-semibold"
					>
						{mode === "login"
							? AUTH_CONSTANTS.LOGIN.signUpLink
							: AUTH_CONSTANTS.SIGNUP.signInLink}
					</button>
				</p>
			</div>
		</div>
	);
};

const FormHeader = ({
	mode,
	currentStep,
}: { mode: "login" | "signup"; currentStep: number }) => (
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

const SubmitButton = ({
	mode,
	currentStep,
	isLoading,
}: {
	mode: "login" | "signup";
	currentStep: number;
	isLoading: boolean;
}) => (
	<Button
		type="submit"
		className={`w-full h-12 rounded-xl bg-primary-base hover:bg-primary-base text-white font-semibold ${mode === "signup" && currentStep === 2 ? "hidden" : ""}`}
		disabled={isLoading}
	>
		{mode === "login"
			? AUTH_CONSTANTS.LOGIN.buttons.submit
			: currentStep === 1
				? AUTH_CONSTANTS.SIGNUP.buttons.next
				: AUTH_CONSTANTS.SIGNUP.buttons.submit}
	</Button>
);

export default AuthForm;
