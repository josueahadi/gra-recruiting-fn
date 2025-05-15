"use client";

import { Button } from "@/components/ui/button";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ContactInfoFields } from "./contact-info-fields";
// import GoogleAuthButton from "./google-auth-button";
import { LoginFields } from "./login-fields";
// import Link from "next/link";
import { showToast } from "@/services/toast";

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
		phoneNumber: "",
	});

	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [serverError, setServerError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

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

			// If error is about unverified email, redirect to verification page
			if (
				errorMessage.toLowerCase().includes("not verified") ||
				errorMessage.toLowerCase().includes("verify your email")
			) {
				router.push("/auth/verification-pending");
			}

			if (onError) onError(error);
		},
	});

	useEffect(() => {
		setServerError(null);
		clearErrors?.();

		return () => {
			if (mode === "signup") {
				clearSignupData();
			}
		};
	}, [mode, clearErrors]);

	useEffect(() => {
		if (authError) {
			setServerError(authError);
			if (authError.toLowerCase().includes("email")) {
				setFormErrors((prev) => ({ ...prev, email: authError }));
			} else if (authError.toLowerCase().includes("password")) {
				setFormErrors((prev) => ({ ...prev, password: authError }));
			} else if (authError.toLowerCase().includes("first name")) {
				setFormErrors((prev) => ({ ...prev, firstName: authError }));
			} else if (authError.toLowerCase().includes("last name")) {
				setFormErrors((prev) => ({ ...prev, lastName: authError }));
			}
		}
	}, [authError]);

	useEffect(() => {
		if (mode === "signup") {
			try {
				const signupDataStr = localStorage.getItem("signupData");
				if (signupDataStr) {
					const signupData = JSON.parse(signupDataStr);
					setFormData((prev) => ({
						...prev,
						firstName: signupData.firstName || prev.firstName,
						lastName: signupData.lastName || prev.lastName,
						email: signupData.email || prev.email,
						phoneNumber: signupData.phoneNumber || prev.phoneNumber,
					}));
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

	const clearSignupData = () => {
		try {
			localStorage.removeItem("signupData");
		} catch (error) {
			console.error("Error clearing signup data:", error);
		}
	};

	const toggleMode = () => {
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

	const validateSignupForm = () => {
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

		setFormErrors(errors);
		return isValid;
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			if (mode === "login") {
				const isValid = validateLoginForm();
				if (!isValid) {
					setIsSubmitting(false);
					return;
				}
				await signIn({
					email: formData.email,
					password: formData.password,
				});
			} else {
				const isValid = validateSignupForm();
				if (!isValid) {
					setIsSubmitting(false);
					return;
				}

				// Save form data for potential future use
				localStorage.setItem(
					"signupData",
					JSON.stringify({
						firstName: formData.firstName,
						lastName: formData.lastName,
						email: formData.email,
						phoneNumber: formData.phoneNumber,
					}),
				);

				// Save email for verification page
				localStorage.setItem("pendingVerificationEmail", formData.email);

				// Format phone number if needed
				const formattedPhoneNumber = formData.phoneNumber.startsWith("+250")
					? formData.phoneNumber
					: formData.phoneNumber.startsWith("0")
						? `+250${formData.phoneNumber.slice(1)}`
						: `+250${formData.phoneNumber}`;

				// Call signUp - on success, this will redirect to verification page
				await signUp({
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password,
					phoneNumber: formattedPhoneNumber,
				});
			}
		} catch (error) {
			console.error("[AuthForm] Form submission error:", error);
			showToast("An error occurred. Please try again.", { type: "error" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white rounded-xl p-12 shadow-md sm:min-w-[450px]">
			<div className="max-w-md mx-auto space-y-6">
				<FormHeader mode={mode} />

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

					{mode === "signup" && (
						<ContactInfoFields
							firstName={formData.firstName}
							lastName={formData.lastName}
							email={formData.email}
							password={formData.password}
							confirmPassword={formData.confirmPassword}
							phoneNumber={formData.phoneNumber}
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

					{(mode === "login" || mode === "signup") && (
						<Button
							type="submit"
							className="w-full h-12 rounded-xl bg-primary-base hover:bg-primary-dark text-white font-semibold"
							disabled={isLoading || isSubmitting}
						>
							{isLoading || isSubmitting ? (
								<>
									<span className="animate-spin inline-block mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
									{mode === "login"
										? AUTH_CONSTANTS.LOGIN.buttons.submitting
										: AUTH_CONSTANTS.SIGNUP.buttons.submitting}
								</>
							) : mode === "login" ? (
								AUTH_CONSTANTS.LOGIN.buttons.submit
							) : (
								AUTH_CONSTANTS.SIGNUP.buttons.submit
							)}
						</Button>
					)}
				</form>

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
			</div>
		</div>
	);
};

const FormHeader = ({
	mode,
}: {
	mode: "login" | "signup";
}) => (
	<div className="text-center mb-8">
		<h1 className="text-3xl font-bold text-gray-900">
			{mode === "login"
				? AUTH_CONSTANTS.LOGIN.title
				: AUTH_CONSTANTS.SIGNUP.steps.contact.title}
		</h1>
		<p className="mt-2 text-gray-600">
			{mode === "login"
				? AUTH_CONSTANTS.LOGIN.subtitle
				: AUTH_CONSTANTS.SIGNUP.steps.contact.subtitle}
		</p>
	</div>
);

export default AuthForm;
