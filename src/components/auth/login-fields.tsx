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
				<Input
					id="email"
					name="email"
					type="email"
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					placeholder="Email Address"
					className={`w-full h-12 rounded-xl border-gray-400 bg-white ${errors.email ? "border-red-500" : ""}`}
					autoComplete="email"
				/>
				{errors.email && (
					<p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
						className={`w-full h-12 rounded-xl border-gray-400 bg-white pr-10 ${errors.password ? "border-red-500" : ""}`}
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
				</div>
				{errors.password && (
					<p className="text-red-500 text-xs mt-1">{errors.password}</p>
				)}
			</div>
		</div>
	);
};

export default LoginFields;
