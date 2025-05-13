"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface LoginFieldsProps {
	email: string;
	password: string;
	errors?: Record<string, string>;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	showPassword: boolean;
	setShowPassword: (show: boolean) => void;
}

export const LoginFields = ({
	email,
	password,
	errors = {},
	onEmailChange,
	onPasswordChange,
	showPassword,
	setShowPassword,
}: LoginFieldsProps) => {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email Address</Label>
				<div className="relative">
					<Input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
						placeholder="Email Address"
						className={`w-full h-12 rounded-xl ${
							errors.email
								? "border-red-500 focus:ring-red-500 bg-red-50"
								: "border-gray-400 bg-white"
						}`}
						autoComplete="email"
					/>
					{errors.email && (
						<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<svg
								className="h-5 w-5 text-red-500"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<title>Error</title>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					)}
				</div>
				{errors.email && (
					<p className="text-red-600 text-sm mt-1">{errors.email}</p>
				)}
			</div>

			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<Label htmlFor="password">Password</Label>
					<Link
						href="/auth/reset-password"
						className="text-sm text-primary-base hover:text-primary-dark"
					>
						Forgot Password?
					</Link>
				</div>
				<div className="relative">
					<Input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => onPasswordChange(e.target.value)}
						placeholder="Password"
						className={`w-full h-12 rounded-xl pr-10 ${
							errors.password
								? "border-red-500 focus:ring-red-500 bg-red-50"
								: "border-gray-400 bg-white"
						}`}
						autoComplete="current-password"
					/>
					<button
						type="button"
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
					{errors.password && (
						<div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
							<svg
								className="h-5 w-5 text-red-500"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<title>Error</title>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					)}
				</div>
				{errors.password && (
					<p className="text-red-600 text-sm mt-1">{errors.password}</p>
				)}
			</div>
		</div>
	);
};

export default LoginFields;
