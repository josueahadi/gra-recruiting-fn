"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useRegisterForm } from "@/hooks/use-register-form";
import type { RegisterFormProps } from "@/types/auth";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import ProgressIndicator from "./progress-indicator";

const REGISTRATION_STEPS = [
	{ number: 1, label: "Contact Info" },
	{ number: 2, label: "Education Background" },
];

const DEPARTMENTS = [
	"Software Development",
	"Digital Marketing",
	"Business Development",
	"Finance",
	"Human Resources",
];

const EDUCATION_LEVELS = [
	"High School",
	"Bachelor's Degree",
	"Master's Degree",
	"PhD",
	"Other",
];

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) =>
	(new Date().getFullYear() - i).toString(),
);

const RegisterForm = ({
	trigger,
	open,
	onOpenChange,
	onSuccess,
	onError,
}: RegisterFormProps) => {
	const [mounted, setMounted] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const {
		isLoading,
		showPassword,
		setShowPassword,
		handleSubmit,
		handleGoogleSignIn,
	} = useRegisterForm({
		onSuccess,
		onError,
		onOpenChange,
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const ContactInfo = (
		<div className="space-y-6">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
				<p className="mt-2 text-gray-600">Fill in your details</p>
			</div>

			<div className="space-y-6">
				<Input
					type="text"
					name="fullName"
					placeholder="Full Names"
					className="w-full h-12 rounded-xl border-gray-400 bg-white"
					required
					aria-label="Full name"
					autoComplete="name"
				/>

				<Input
					type="email"
					name="email"
					placeholder="Email Address"
					className="w-full h-12 rounded-xl border-gray-400 bg-white"
					required
					aria-label="Email address"
					autoComplete="email"
				/>

				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Password"
						className="w-full h-12 rounded-xl border-gray-400 bg-white pr-10"
						required
						minLength={8}
						aria-label="Password"
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

				<div className="flex items-center space-x-2">
					<Checkbox id="terms" name="terms" required />
					<label htmlFor="terms" className="text-sm text-gray-700">
						I agree to the terms & conditions
					</label>
				</div>

				<Button
					type="button"
					className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
					onClick={() => setCurrentStep(2)}
				>
					Next Step
				</Button>

				<div className="flex items-center">
					<div className="flex-grow border-t border-gray-400/75" />
					<span className="mx-4 text-sm font-bold text-gray-700 uppercase">
						Or
					</span>
					<div className="flex-grow border-t border-gray-400/75" />
				</div>

				<Button
					type="button"
					variant="outline"
					className="w-full h-12 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 text-gray-700 font-medium"
					onClick={handleGoogleSignIn}
				>
					<FcGoogle className="mr-2" />
					Sign up with Google
				</Button>
			</div>
		</div>
	);

	const EducationBackground = (
		<div className="space-y-6">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Complete Your Profile
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
							{DEPARTMENTS.map((dept) => (
								<SelectItem key={dept} value={dept.toLowerCase()}>
									{dept}
								</SelectItem>
							))}
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
							<SelectItem value="university1">University 1</SelectItem>
							<SelectItem value="university2">University 2</SelectItem>
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
							{EDUCATION_LEVELS.map((level) => (
								<SelectItem key={level} value={level.toLowerCase()}>
									{level}
								</SelectItem>
							))}
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
					<div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
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
							<p className="text-sm text-gray-500">Drag and drop file here</p>
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
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent
				className="max-w-5xl px-16 overflow-y-auto max-h-[100vh]"
				aria-labelledby="registration-title"
			>
				<VisuallyHidden>
					<DialogTitle />
				</VisuallyHidden>

				<div className="h-full">
					<ProgressIndicator
						currentStep={currentStep}
						steps={REGISTRATION_STEPS}
					/>

					<div className="flex !rounded-3xl overflow-hidden">
						<div className="w-1/3 bg-gradient-to-b from-[#D1D9D1] via-[#ECEAEA] to-[#ECEAEA] flex items-center justify-center">
							<Image
								width={500}
								height={400}
								src="/images/registration-01.svg"
								alt="Registration illustration"
								className="w-full h-auto"
							/>
						</div>

						<div className="w-2/3 p-12 bg-gray-400/15">
							<div className="max-w-md mx-auto">
								<form
									onSubmit={(e) => {
										e.preventDefault();
										const formData = new FormData(e.currentTarget);
										handleSubmit({
											fullName: formData.get("fullName") as string,
											email: formData.get("email") as string,
											password: formData.get("password") as string,
											terms: formData.get("terms") === "on",
										});
									}}
								>
									{currentStep === 1 ? ContactInfo : EducationBackground}
								</form>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default RegisterForm;
