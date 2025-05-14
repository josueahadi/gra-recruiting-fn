"use client";

import { Button } from "@/components/ui/button";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EducationBackgroundFields } from "./background-fields";
import { ContactInfoFields } from "./contact-info-fields";
// import GoogleAuthButton from "./google-auth-button";
import { LoginFields } from "./login-fields";
import ProgressIndicator from "./progress-indicator";
// import Link from "next/link";
import { showToast } from "@/services/toast";

const REGISTRATION_STEPS = [
	{ number: 1, label: "Contact Info" },
	{ number: 2, label: "Background" },
];

interface AuthFormProps {
	mode: "login" | "signup";
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

const AuthForm = ({ mode, onSuccess, onError }: AuthFormProps) => {
	const router = useRouter();

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
		phoneNumber: "",
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
		// handleGoogleAuth,
		error: authError,
		clearErrors,
	} = useAuth({
		onSuccess: () => {
			console.log(
				"[AuthForm] Authentication successful, middleware will handle redirection",
			);
			if (onSuccess) onSuccess();
		},
		onError: (error) => {
			const errorMessage =
				error.message || "Please check your information and try again.";
			setServerError(errorMessage);

			if (onError) onError(error);
		},
	});

	useEffect(() => {
		setServerError(null);
		clearErrors?.();

		return () => {
			if (mode === "signup" && currentStep === 1) {
				// Keep step 1 data in case user comes back
				clearSignupData(true);
			}
		};
	}, [mode, clearErrors, currentStep]);

	useEffect(() => {
		if (authError) {
			setServerError(authError);

			// Map backend error messages to specific form fields
			if (authError.includes("email")) {
				setFormErrors((prev) => ({ ...prev, email: authError }));
			} else if (authError.includes("password")) {
				setFormErrors((prev) => ({ ...prev, password: authError }));
			}
		}
	}, [authError]);

	// Restore saved form data when component mounts
	useEffect(() => {
		if (mode === "signup") {
			try {
				const step1DataStr = localStorage.getItem("signupStep1Data");
				if (step1DataStr) {
					const step1Data = JSON.parse(step1DataStr);
					setFormData((prev) => ({
						...prev,
						firstName: step1Data.firstName || prev.firstName,
						lastName: step1Data.lastName || prev.lastName,
						email: step1Data.email || prev.email,
						phoneNumber: step1Data.phoneNumber || prev.phoneNumber,
					}));
				}

				// Check if there's pending step 2 data (for users who completed step 1)
				const pendingDataStr = localStorage.getItem("signupPendingData");
				if (pendingDataStr) {
					const pendingData = JSON.parse(pendingDataStr);

					// Update form data with saved step 2 values
					setFormData((prev) => ({
						...prev,
						career: pendingData.career || prev.career,
						levelOfEducation:
							pendingData.levelOfEducation || prev.levelOfEducation,
						university: pendingData.university || prev.university,
						graduationDate: pendingData.graduationDate || prev.graduationDate,
						major: pendingData.major || prev.major,
						linkedinProfileUrl:
							pendingData.linkedinProfileUrl || prev.linkedinProfileUrl,
						githubProfileUrl:
							pendingData.githubProfileUrl || prev.githubProfileUrl,
					}));

					// If we have step 2 data, user likely refreshed while on step 2
					if (pendingData.career || pendingData.levelOfEducation) {
						setCurrentStep(2);
					}
				}
			} catch (error) {
				console.error("Error restoring saved form data:", error);
			}
		}
	}, [mode]);

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

	const clearSignupData = (keepStep1 = false) => {
		try {
			if (!keepStep1) {
				localStorage.removeItem("signupStep1Data");
			}
			localStorage.removeItem("signupPendingData");
		} catch (error) {
			console.error("Error clearing signup data:", error);
		}
	};

	const toggleMode = () => {
		// Clear signup data when switching modes
		clearSignupData();
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

		if (!formData.phoneNumber) {
			errors.phoneNumber = "Phone number is required";
			isValid = false;
		} else {
			const cleanNumber = formData.phoneNumber.replace(/[\s\-()]/g, "");
			const withCountryCode = /^\+250[7][0-9]{8}$/;
			const withoutCountryCode = /^0[7][0-9]{8}$/;

			if (
				!withCountryCode.test(cleanNumber) &&
				!withoutCountryCode.test(cleanNumber)
			) {
				errors.phoneNumber =
					"Please enter a valid Rwanda phone number (+250789000000 or 0789000000)";
				isValid = false;
			} else {
				setFormData((prev) => ({
					...prev,
					phoneNumber: cleanNumber,
				}));
			}
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

		try {
			if (mode === "login") {
				const isValid = validateLoginForm();
				if (!isValid) {
					return;
				}

				await signIn({
					email: formData.email,
					password: formData.password,
				});
			} else {
				if (currentStep === 1) {
					const isValid = validateSignupStep1();
					if (!isValid) {
						return;
					}

					localStorage.setItem(
						"signupStep1Data",
						JSON.stringify({
							firstName: formData.firstName,
							lastName: formData.lastName,
							email: formData.email,
							phoneNumber: formData.phoneNumber,
						}),
					);

					// Call the signup API at step 1
					const formattedPhoneNumber = formData.phoneNumber.startsWith("+250")
						? formData.phoneNumber
						: formData.phoneNumber.startsWith("0")
							? `+250${formData.phoneNumber.slice(1)}`
							: `+250${formData.phoneNumber}`;

					await signUp({
						firstName: formData.firstName,
						lastName: formData.lastName,
						email: formData.email,
						password: formData.password,
						phoneNumber: formattedPhoneNumber,
					});

					// Save email for verification pending page
					localStorage.setItem("pendingVerificationEmail", formData.email);

					// Redirect to verification pending page
					router.push("/auth/verification-pending");
				} else {
					const isValid = validateSignupStep2();
					if (!isValid) {
						return;
					}

					// Save step 2 data
					localStorage.setItem(
						"signupPendingData",
						JSON.stringify({
							career: formData.career,
							levelOfEducation: formData.levelOfEducation,
							university: formData.university,
							graduationDate: formData.graduationDate,
							major: formData.major,
							linkedinProfileUrl: formData.linkedinProfileUrl,
							githubProfileUrl: formData.githubProfileUrl,
						}),
					);

					showToast({
						title: "Profile data saved",
						description: "Please complete email verification to continue.",
						variant: "success",
					});

					// Redirect to verification pending page
					router.push("/auth/verification-pending");
				}
			}
		} catch (error) {
			console.error("[AuthForm] Form submission error:", error);
			showToast("An error occurred. Please try again.", { type: "error" });
		}
	};

	return (
		<div className="bg-white rounded-xl p-12 shadow-md sm:min-w-[450px]">
			{mode === "signup" && (
				<ProgressIndicator
					currentStep={currentStep}
					steps={REGISTRATION_STEPS}
				/>
			)}
			<div className="max-w-md mx-auto space-y-6">
				<FormHeader mode={mode} currentStep={currentStep} />

				{serverError && !formErrors.email && !formErrors.password && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
						{serverError}
					</div>
				)}

				<form onSubmit={handleFormSubmit} className="space-y-6">
					{mode === "login" && (
						<LoginFields
							email={formData.email}
							password={formData.password}
							errors={formErrors}
							onEmailChange={(value) =>
								handleInputChange({
									target: { name: "email", value, type: "text" },
								} as React.ChangeEvent<HTMLInputElement>)
							}
							onPasswordChange={(value) =>
								handleInputChange({
									target: { name: "password", value, type: "text" },
								} as React.ChangeEvent<HTMLInputElement>)
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
							phoneNumber={formData.phoneNumber}
							terms={formData.terms}
							errors={formErrors}
							onInputChange={(name, value) =>
								handleInputChange({
									target: {
										name,
										value,
										type: typeof value === "boolean" ? "checkbox" : "text",
									},
								} as React.ChangeEvent<HTMLInputElement>)
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
								} as React.ChangeEvent<HTMLInputElement>)
							}
							onSelectChange={handleSelectChange}
							onBack={() => setCurrentStep(1)}
							isLoading={isLoading}
						/>
					)}

					{(mode === "login" || mode === "signup") && (
						<Button
							type="submit"
							className="w-full h-12 rounded-xl bg-primary-base hover:bg-primary-dark text-white font-semibold"
							disabled={isLoading}
						>
							{isLoading
								? "Please wait..."
								: mode === "login"
									? AUTH_CONSTANTS.LOGIN.buttons.submit
									: currentStep === 1
										? AUTH_CONSTANTS.SIGNUP.buttons.next
										: "Save & Continue"}
						</Button>
					)}
				</form>

				{/* 
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
					</>
				)}
				*/}

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

				{/* {mode === "login" && (
					<p className="text-center text-sm">
						<Link
							href="/auth/reset-password"
							className="text-primary-base hover:text-primary-dark font-medium"
						>
							Forgot your password?
						</Link>
					</p>
				)} */}
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
