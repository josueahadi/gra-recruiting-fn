"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_CONSTANTS } from "@/constants";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import PasswordStrengthMeter from "./password-strength-meter";

interface ContactInfoFieldsProps {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	terms: boolean;
	errors?: Record<string, string>;
	onInputChange: (name: string, value: string | boolean) => void;
	showPassword: boolean;
	setShowPassword: (show: boolean) => void;
}

export const ContactInfoFields = ({
	firstName,
	lastName,
	email,
	password,
	confirmPassword,
	terms,
	errors = {},
	onInputChange,
	showPassword,
	setShowPassword,
}: ContactInfoFieldsProps) => {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="firstName">First Name</Label>
					<Input
						id="firstName"
						name="firstName"
						type="text"
						value={firstName}
						onChange={(e) => onInputChange("firstName", e.target.value)}
						placeholder="First Name"
						className={`w-full h-12 rounded-xl border-gray-400 bg-white ${errors.firstName ? "border-red-500" : ""}`}
					/>
					{errors.firstName && (
						<p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="lastName">Last Name</Label>
					<Input
						id="lastName"
						name="lastName"
						type="text"
						value={lastName}
						onChange={(e) => onInputChange("lastName", e.target.value)}
						placeholder="Last Name"
						className={`w-full h-12 rounded-xl border-gray-400 bg-white ${errors.lastName ? "border-red-500" : ""}`}
					/>
					{errors.lastName && (
						<p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">Email Address</Label>
				<Input
					id="email"
					name="email"
					type="email"
					value={email}
					onChange={(e) => onInputChange("email", e.target.value)}
					placeholder="Email Address"
					className={`w-full h-12 rounded-xl border-gray-400 bg-white ${errors.email ? "border-red-500" : ""}`}
					autoComplete="email"
				/>
				{errors.email && (
					<p className="text-red-500 text-xs mt-1">{errors.email}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<div className="relative">
					<Input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => onInputChange("password", e.target.value)}
						placeholder="Password"
						className={`w-full h-12 rounded-xl border-gray-400 bg-white pr-10 ${errors.password ? "border-red-500" : ""}`}
						autoComplete="new-password"
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
				{password && (
					<PasswordStrengthMeter password={password} className="mt-2" />
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirm Password</Label>
				<div className="relative">
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type={showPassword ? "text" : "password"}
						value={confirmPassword}
						onChange={(e) => onInputChange("confirmPassword", e.target.value)}
						placeholder="Confirm Password"
						className={`w-full h-12 rounded-xl border-gray-400 bg-white pr-10 ${
							errors.confirmPassword ? "border-red-500" : ""
						}`}
						autoComplete="new-password"
					/>
				</div>
				{errors.confirmPassword && (
					<p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
				)}
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox
					id="terms"
					checked={terms}
					onCheckedChange={(checked) =>
						onInputChange("terms", checked === true)
					}
				/>
				<label htmlFor="terms" className="text-sm text-gray-700">
					{AUTH_CONSTANTS.SIGNUP.terms}{" "}
					<Link href="/terms" className="text-primary-base hover:underline">
						terms & conditions
					</Link>
				</label>
			</div>
			{errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
		</div>
	);
};

export default ContactInfoFields;
