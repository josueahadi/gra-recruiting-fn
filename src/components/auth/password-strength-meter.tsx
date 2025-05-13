"use client";

import { useEffect, useState } from "react";
import { AUTH_CONSTANTS } from "@/constants";
import { cn } from "@/lib/utils";

type PasswordStrength = "weak" | "fair" | "good" | "strong" | "none";

interface PasswordRequirement {
	label: string;
	isMet: boolean;
}

interface PasswordStrengthMeterProps {
	password: string;
	className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
	password,
	className,
}) => {
	const [strength, setStrength] = useState<PasswordStrength>("none");
	const [score, setScore] = useState(0);
	const [requirements, setRequirements] = useState<PasswordRequirement[]>([
		{ label: "At least 8 characters", isMet: false },
		{ label: "Contains uppercase letter", isMet: false },
		{ label: "Contains lowercase letter", isMet: false },
		{ label: "Contains a number", isMet: false },
		{ label: "Contains a special character", isMet: false },
	]);

	useEffect(() => {
		if (!password) {
			setStrength("none");
			setScore(0);
			setRequirements((prev) => prev.map((req) => ({ ...req, isMet: false })));
			return;
		}

		// Update requirements
		const updatedRequirements = [
			{
				label: "At least 8 characters",
				isMet: password.length >= AUTH_CONSTANTS.VALIDATION.password.minLength,
			},
			{
				label: "Contains uppercase letter",
				isMet: AUTH_CONSTANTS.VALIDATION.password.requireUppercase
					? /[A-Z]/.test(password)
					: true,
			},
			{
				label: "Contains lowercase letter",
				isMet: AUTH_CONSTANTS.VALIDATION.password.requireLowercase
					? /[a-z]/.test(password)
					: true,
			},
			{
				label: "Contains a number",
				isMet: AUTH_CONSTANTS.VALIDATION.password.requireNumber
					? /\d/.test(password)
					: true,
			},
			{
				label: "Contains a special character",
				isMet: AUTH_CONSTANTS.VALIDATION.password.requireSpecial
					? /[!@#$%^&*(),.?":{}|<>]/.test(password)
					: true,
			},
		];

		setRequirements(updatedRequirements);

		// Calculate score based on requirements met
		const metCount = updatedRequirements.filter((req) => req.isMet).length;
		const newScore = Math.ceil((metCount / updatedRequirements.length) * 100);
		setScore(newScore);

		// Determine strength based on score
		if (newScore === 0) {
			setStrength("none");
		} else if (newScore <= 25) {
			setStrength("weak");
		} else if (newScore <= 50) {
			setStrength("fair");
		} else if (newScore <= 75) {
			setStrength("good");
		} else {
			setStrength("strong");
		}
	}, [password]);

	const getColorClass = () => {
		switch (strength) {
			case "weak":
				return "bg-red-500";
			case "fair":
				return "bg-orange-500";
			case "good":
				return "bg-yellow-500";
			case "strong":
				return "bg-green-500";
			default:
				return "bg-gray-200";
		}
	};

	const getStrengthLabel = () => {
		switch (strength) {
			case "weak":
				return "Weak";
			case "fair":
				return "Fair";
			case "good":
				return "Good";
			case "strong":
				return "Strong";
			default:
				return "";
		}
	};

	if (!password) {
		return null;
	}

	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex items-center gap-2">
				<div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
					<div
						className={cn(
							"h-full transition-all duration-300",
							getColorClass(),
						)}
						style={{ width: `${score}%` }}
					/>
				</div>
				<span className="text-xs font-medium">{getStrengthLabel()}</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
				{requirements.map((req, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className={cn(
							"flex items-center gap-1",
							req.isMet ? "text-green-600" : "text-gray-500",
						)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={cn(
								"h-3 w-3",
								req.isMet ? "text-green-500" : "text-gray-400",
							)}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>Meter</title>
							{req.isMet ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							)}
						</svg>
						<span>{req.label}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default PasswordStrengthMeter;
