// auth
export const AUTH_CONSTANTS = {
	LOGIN: {
		title: "Welcome Back!",
		subtitle: "Sign in to your account to continue",
		forgotPassword: "Forgot Password?",
		noAccount: "Don't have an account?",
		signUpLink: "Sign up",
		buttons: {
			submit: "Login",
			submitting: "Logging in...",
			google: "Continue with Google",
		},
		errors: {
			email: "Please enter a valid email address",
			password: "Password is required",
			invalid: "Invalid email or password",
		},
	},
	SIGNUP: {
		steps: {
			contact: {
				title: "Create Your Account",
				subtitle: "Enter your personal information to get started",
			},
			education: {
				title: "Complete Your Profile",
				subtitle: "Tell us about your education and career path",
				departments: [
					"Software Development",
					"Digital Marketing",
					"Business Development",
					"Finance",
					"Human Resources",
				],
				education_levels: [
					"High School",
					"Bachelor's Degree",
					"Master's Degree",
					"PhD",
					"Other",
				],
			},
		},
		hasAccount: "Already have an account?",
		signInLink: "Sign in",
		buttons: {
			next: "Continue",
			back: "Back",
			submit: "Create Account",
			submitting: "Creating Account...",
			google: "Continue with Google",
		},
		terms: "I agree to the",

		errors: {
			firstName: "First name is required",
			lastName: "Last name is required",
			email: "Please enter a valid email address",
			password:
				"Password must be at least 8 characters with letters and numbers",
			passwordMatch: "Passwords don't match",
			terms: "You must accept the terms and conditions",
		},
	},
	FORMS: {
		labels: {
			email: "Email",
			password: "Password",
			fullName: "Full Names",
			career: "Career",
			education: "Add Education History",
			educationLevel: "Education Level",
			program: "Program",
			graduationDate: "Graduation Date",
			cv: "Your CV",
			optional: "Add Optional Information",
		},
		placeholders: {
			email: "Your Email",
			password: "Password",
			confirmPassword: "Confirm Password",
			fullName: "Full Names",
			department: "Department",
			institution: "Select your institution",
			educationLevel: "Select your Education Level",
			program: "Education Program",
			graduationYear: "2018",
		},
	},
	RESET_PASSWORD: {
		title: "Reset Your Password",
		subtitle: "We'll send you instructions to reset your password",
		buttons: {
			submit: "Send Reset Link",
			back: "Back to Login",
		},
		steps: {
			request: {
				title: "Reset Your Password",
				subtitle: "Enter your email and we'll send you a reset link",
			},
			verify: {
				title: "Verify Your Email",
				subtitle: "Enter the verification code sent to your email",
			},
			reset: {
				title: "Create New Password",
				subtitle: "Your password must be different from the previous one",
			},
			success: {
				title: "Password Reset Successful",
				subtitle: "Your password has been reset successfully",
			},
		},
	},
	VERIFICATION: {
		title: "Verify Your Email",
		subtitle: "We've sent a verification code to your email",
		buttons: {
			verify: "Verify Email",
			resend: "Resend Code",
			continue: "Continue to Dashboard",
		},
	},
	ERRORS: {
		general: "Something went wrong. Please try again.",
		network: "Network error. Please check your connection.",
		unauthorized: "Your session has expired. Please sign in again.",
		server: "Server error. Please try again later.",
	},
	VALIDATION: {
		password: {
			minLength: 8,
			requireUppercase: true,
			requireLowercase: true,
			requireNumber: true,
			requireSpecial: true,
		},
		email: {
			pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		},
	},
};
