"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import PasswordStrengthMeter from "./password-strength-meter";

interface ContactInfoFieldsProps {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	phoneNumber: string;
	terms: boolean;
	errors: Record<string, string>;
	onInputChange: (name: string, value: string | boolean) => void;
	showPassword: boolean;
	setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContactInfoFields = ({
	firstName,
	lastName,
	email,
	password,
	confirmPassword,
	phoneNumber,
	terms,
	errors,
	onInputChange,
	showPassword,
	setShowPassword,
}: ContactInfoFieldsProps) => {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="firstName">First Name</Label>
					<Input
						id="firstName"
						name="firstName"
						type="text"
						value={firstName}
						onChange={(e) => onInputChange("firstName", e.target.value)}
						className={errors.firstName ? "border-red-500" : ""}
					/>
					{errors.firstName && (
						<p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
					)}
				</div>
				<div>
					<Label htmlFor="lastName">Last Name</Label>
					<Input
						id="lastName"
						name="lastName"
						type="text"
						value={lastName}
						onChange={(e) => onInputChange("lastName", e.target.value)}
						className={errors.lastName ? "border-red-500" : ""}
					/>
					{errors.lastName && (
						<p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					value={email}
					onChange={(e) => onInputChange("email", e.target.value)}
					className={errors.email ? "border-red-500" : ""}
				/>
				{errors.email && (
					<p className="text-red-500 text-sm mt-1">{errors.email}</p>
				)}
			</div>

			<div>
				<Label htmlFor="phoneNumber">Phone Number</Label>
				<Input
					id="phoneNumber"
					name="phoneNumber"
					type="tel"
					value={phoneNumber}
					onChange={(e) => onInputChange("phoneNumber", e.target.value)}
					className={errors.phoneNumber ? "border-red-500" : ""}
					placeholder="+250789000000"
				/>
				{errors.phoneNumber && (
					<p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
				)}
			</div>

			<div>
				<Label htmlFor="password">Password</Label>
				<div className="relative">
					<Input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => onInputChange("password", e.target.value)}
						className={errors.password ? "border-red-500" : ""}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 transform -translate-y-1/2"
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</div>
				{errors.password && (
					<p className="text-red-500 text-sm mt-1">{errors.password}</p>
				)}
				{password && (
					<PasswordStrengthMeter password={password} className="mt-2" />
				)}
			</div>

			<div>
				<Label htmlFor="confirmPassword">Confirm Password</Label>
				<div className="relative">
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type={showPassword ? "text" : "password"}
						value={confirmPassword}
						onChange={(e) => onInputChange("confirmPassword", e.target.value)}
						className={errors.confirmPassword ? "border-red-500" : ""}
					/>
				</div>
				{errors.confirmPassword && (
					<p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
				)}
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox
					id="terms"
					checked={terms}
					onCheckedChange={(checked) => onInputChange("terms", checked === true)}
				/>
				<label
					htmlFor="terms"
					className={`text-sm ${errors.terms ? "text-red-500" : ""}`}
				>
					I agree to the{" "}
					<Link href="/terms" className="text-primary-base hover:underline">
						Terms and Conditions
					</Link>
				</label>
			</div>
			{errors.terms && (
				<p className="text-red-500 text-sm mt-1">{errors.terms}</p>
			)}
		</div>
	);
};

export default ContactInfoFields;
