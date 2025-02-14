import cn from "classnames";

// auth
export const AUTH_CONSTANTS = {
	COLORS: {
		gradient: {
			from: "#D1D9D1",
			via: "#ECEAEA",
			to: "#D1D9D1",
		},
	},
	LOGIN: {
		title: "Login",
		subtitle: "Please Enter Your Details to login to your account",
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
		terms: "I agree to the terms & conditions",
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

// authStyles
export const authStyles = {
	wrapper: "flex !rounded-xl overflow-hidden",
	imageSection: cn(
		"w-1/2 bg-gradient-to-b flex items-center justify-center",
		`from-[${AUTH_CONSTANTS.COLORS.gradient.from}]`,
		`via-[${AUTH_CONSTANTS.COLORS.gradient.via}]`,
		`to-[${AUTH_CONSTANTS.COLORS.gradient.to}]`,
	),
	image: "w-full h-full object-cover",
	formSection: "w-1/2 p-12 bg-gray-400/15",
	formWrapper: "max-w-md mx-auto space-y-6",
	header: "text-center mb-8",
	headerTitle: "text-3xl font-bold text-gray-900",
	headerSubtitle: "mt-2 text-gray-600",
	form: "space-y-6",
	input: "w-full h-12 rounded-xl border-gray-400 bg-white",
	inputWithIcon: "w-full h-12 rounded-xl border-gray-400 bg-white pr-10",
	button:
		"w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold",
	divider: "flex items-center",
	dividerLine: "flex-grow border-t border-gray-400/75",
	dividerText: "mx-4 text-sm font-bold text-gray-700 uppercase",
	modeToggle: "text-center text-sm text-gray-600",
	modeToggleButton: "text-green-500 hover:text-green-600 font-semibold",
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
