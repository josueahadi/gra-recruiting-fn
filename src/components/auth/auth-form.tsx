import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "./google-auth-button";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import ProgressIndicator from "./progress-indicator";
import { BsGithub, BsLinkedin } from "react-icons/bs";

const REGISTRATION_STEPS = [
	{ number: 1, label: "Contact Info" },
	{ number: 2, label: "Education Background" },
];

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) =>
	(new Date().getFullYear() - i).toString(),
);

interface AuthFormProps {
	mode: "login" | "signup";
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onOpenChange?: (open: boolean) => void;
	onModeChange: () => void;
}

const AuthForm = ({
	mode,
	onSuccess,
	onError,
	onOpenChange,
	onModeChange,
}: AuthFormProps) => {
	const {
		isLoading,
		showPassword,
		setShowPassword,
		login,
		signup,
		handleGoogleAuth,
	} = useAuth({
		onSuccess,
		onError,
		onOpenChange,
	});

	const [currentStep, setCurrentStep] = useState(1);

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		if (mode === "login") {
			await login({
				email: formData.get("email") as string,
				password: formData.get("password") as string,
			});
		} else {
			if (currentStep === 1) {
				setCurrentStep(2);
				return;
			}

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
		}
	};

	return (
		<div className="h-full">
			{mode === "signup" && (
				<ProgressIndicator
					currentStep={currentStep}
					steps={REGISTRATION_STEPS}
				/>
			)}

			<div className="flex !rounded-xl overflow-hidden">
				<div className="w-1/2 bg-gradient-to-b from-[#D1D9D1] via-[#ECEAEA] to-[#D1D9D1] flex items-center justify-center">
					<Image
						width={500}
						height={500}
						src={
							mode === "login"
								? "/images/freepik-11-2000.webp"
								: "/images/registration-01.svg"
						}
						alt={
							mode === "login"
								? "Login illustration"
								: "Registration illustration"
						}
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="w-1/2 p-12 bg-gray-400/15">
					<div className="max-w-md mx-auto space-y-6">
						{mode === "signup" && currentStep === 1 && (
							<div className="text-center mb-8">
								<h1 className="text-3xl font-bold text-gray-900">
									{AUTH_CONSTANTS.SIGNUP.steps.contact.title}
								</h1>
								<p className="mt-2 text-gray-600">
									{AUTH_CONSTANTS.SIGNUP.steps.contact.subtitle}
								</p>
							</div>
						)}

						{mode === "login" && (
							<div className="text-center mb-8">
								<h1 className="text-3xl font-bold text-gray-900">
									{AUTH_CONSTANTS.LOGIN.title}
								</h1>
								<p className="mt-2 text-gray-600">
									{AUTH_CONSTANTS.LOGIN.subtitle}
								</p>
							</div>
						)}

						<form onSubmit={handleFormSubmit} className="space-y-6">
							{mode === "login" && (
								<>
									<Input
										type="email"
										name="email"
										placeholder="Email Address"
										className="w-full h-12 rounded-xl border-gray-400 bg-white"
										autoComplete="email"
									/>

									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											name="password"
											placeholder="Password"
											className="w-full h-12 rounded-xl border-gray-400 bg-white pr-10"
											autoComplete="new-password"
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
								</>
							)}

							{mode === "signup" && currentStep === 1 && (
								<>
									<Input
										type="text"
										name="fullName"
										placeholder="Full Names"
										className="w-full h-12 rounded-xl border-gray-400 bg-white"
										autoComplete="name"
									/>

									<Input
										type="email"
										name="email"
										placeholder="Email Address"
										className="w-full h-12 rounded-xl border-gray-400 bg-white"
										autoComplete="email"
									/>

									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											name="password"
											placeholder="Password"
											className="w-full h-12 rounded-xl border-gray-400 bg-white pr-10"
											autoComplete="new-password"
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>

									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											name="confirm-password"
											placeholder="Confirm Password"
											className="w-full h-12 rounded-xl border-gray-400 bg-white pr-10"
											minLength={8}
											aria-label="Confirm Password"
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>

									<div className="flex items-center space-x-2">
										<Checkbox id="terms" name="terms" />
										<label htmlFor="terms" className="text-sm text-gray-700">
											{AUTH_CONSTANTS.SIGNUP.terms}
										</label>
									</div>
								</>
							)}

							{mode === "signup" && currentStep === 2 && (
								<div className="max-w-md mx-auto space-y-6">
									<div className="text-center mb-8">
										<h1 className="text-3xl font-bold text-gray-900">
											{AUTH_CONSTANTS.SIGNUP.steps.education.title}
										</h1>
									</div>

									<div className="space-y-6">
										<div>
											<label
												htmlFor="career"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Career
											</label>
											<Select name="department">
												<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
													<SelectValue placeholder="Department" />
												</SelectTrigger>
												<SelectContent>
													{AUTH_CONSTANTS.SIGNUP.steps.education.departments.map(
														(dept) => (
															<SelectItem key={dept} value={dept.toLowerCase()}>
																{dept}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</div>

										<div>
											<label
												htmlFor="institution"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Add Education History
											</label>
											<Select name="institution">
												<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
													<SelectValue placeholder="Select your institution" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="university1">
														University 1
													</SelectItem>
													<SelectItem value="university2">
														University 2
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div>
											<label
												htmlFor="educationLevel"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Education Level
											</label>
											<Select name="educationLevel">
												<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
													<SelectValue placeholder="Select your Education Level" />
												</SelectTrigger>
												<SelectContent>
													{AUTH_CONSTANTS.SIGNUP.steps.education.education_levels.map(
														(level) => (
															<SelectItem
																key={level}
																value={level.toLowerCase()}
															>
																{level}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</div>

										<div>
											<label
												htmlFor="program"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Program
											</label>
											<Input
												type="text"
												name="program"
												placeholder="Education Program"
												className="w-full h-12 rounded-xl border-gray-400 bg-white"
											/>
										</div>

										<div>
											<label
												htmlFor="graduationYear"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Graduation Date
											</label>
											<Select name="graduationYear">
												<SelectTrigger className="w-full h-12 rounded-xl border-gray-400 bg-white">
													<SelectValue placeholder="2018" />
												</SelectTrigger>
												<SelectContent>
													{GRADUATION_YEARS.map((year) => (
														<SelectItem key={year} value={year}>
															{year}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div>
											<label
												htmlFor="cvUpload"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Your CV
											</label>
											<div className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
												<div className="flex flex-col items-center">
													<svg
														className="w-8 h-8 text-green-500 mb-2"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-label="Upload icon"
													>
														<title>Upload icon</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
														/>
													</svg>
													<p className="font-medium">Click to Upload</p>
													<p className="text-sm text-gray-500">
														Drag and drop file here
													</p>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<label
												htmlFor="optionalInfo"
												className="block text-sm font-medium text-gray-700"
											>
												Add Optional Information
											</label>
											<Button
												variant="outline"
												className="w-full h-12 rounded-xl border-gray-400 bg-white hover:bg-gray-50"
											>
												<BsLinkedin className="mr-2 text-[#0077B5]" />
												LinkedIn Profile Link
											</Button>
											<Button
												variant="outline"
												className="w-full h-12 rounded-xl border-gray-400 bg-white hover:bg-gray-50"
											>
												<BsGithub className="mr-2" />
												GitHub Profile Link
											</Button>
										</div>

										<div className="flex gap-4">
											<Button
												type="button"
												variant="outline"
												className="flex-1 h-12 rounded-xl border-gray-400"
												onClick={() => setCurrentStep(1)}
											>
												Back
											</Button>
											<Button
												type="submit"
												className="flex-1 h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
												disabled={isLoading}
											>
												Create Account
											</Button>
										</div>
									</div>
								</div>
							)}

							{mode === "login" || currentStep === 1 ? (
								<Button
									type="submit"
									className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
									disabled={isLoading}
								>
									{mode === "login"
										? AUTH_CONSTANTS.LOGIN.buttons.submit
										: AUTH_CONSTANTS.SIGNUP.buttons.next}
								</Button>
							) : null}
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
								type="button"
								onClick={onModeChange}
								className="text-green-500 hover:text-green-600 font-semibold"
							>
								{mode === "login"
									? AUTH_CONSTANTS.LOGIN.signUpLink
									: AUTH_CONSTANTS.SIGNUP.signInLink}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
