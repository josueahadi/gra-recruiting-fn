// auth
export const AUTH_CONSTANTS = {
	LOGIN: {
		title: "Welcome Back!",
		subtitle: "Please Enter Your Credentials to login to your account",
		forgotPassword: "Forgot Password?",
		noAccount: "Don't have an account?",
		signUpLink: "Sign up",
		buttons: {
			submit: "Login",
			submitting: "Logging in...",
			google: "Continue with Google",
		},
	},
	SIGNUP: {
		steps: {
			contact: {
				title: "Create Account",
				subtitle: "Fill in your details",
			},
			education: {
				title: "Complete Your Profile",
				subtitle: "Tell us about your education",
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
			next: "Next Step",
			back: "Back",
			submit: "Create Account",
			submitting: "Creating Account...",
			google: "Continue with Google",
		},
		terms: "I agree to the",
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
} as const;

// errors
export const ERROR_MESSAGES = {
	auth: {
		invalidCredentials: "Invalid credentials. Please try again.",
		signupFailed: "Something went wrong. Please try again.",
		googleAuthFailed: "Failed to authenticate with Google. Please try again.",
	},
} as const;

// success
export const SUCCESS_MESSAGES = {
	auth: {
		login: "You have been logged in successfully.",
		signup: "Your account has been created successfully.",
		googleAuth: {
			login: "Successfully signed in with Google.",
			signup: "Successfully signed up with Google.",
		},
	},
} as const;
