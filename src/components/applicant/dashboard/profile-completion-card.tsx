import { cn } from "@/lib/utils";
import type React from "react";

interface ProfileCompletionCardProps {
	percentage: number;
	className?: string;
	size?: "small" | "medium" | "large";
}

/**
 * A component to display the profile completion percentage with a circular progress indicator
 */
const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
	percentage,
	className,
	size = "medium",
}) => {
	// Validate percentage
	if (percentage < 0 || percentage > 100) {
		throw new Error("Percentage must be between 0 and 100.");
	}

	// Determine color based on percentage
	const getColor = () => {
		if (percentage < 30) return "#EF4444"; // Red
		if (percentage < 100) return "#F59E0B"; // Amber/Yellow
		return "#10B981"; // Green
	};

	// SVG circle calculations
	const getSvgSize = () => {
		switch (size) {
			case "small":
				return { width: 100, height: 100, radius: 40 };
			case "large":
				return { width: 180, height: 180, radius: 80 };
			default:
				return { width: 160, height: 160, radius: 70 };
		}
	};

	const svgSize = getSvgSize();
	const radius = svgSize.radius;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<div
			className={cn(
				"bg-white rounded-lg p-6 flex flex-col items-center",
				className,
			)}
		>
			<h3 className="text-lg font-semibold mb-4">Profile Completion</h3>

			<div
				className={`relative w-${svgSize.width / 4} h-${svgSize.height / 4}`}
			>
				{/* Background circle */}
				<svg
					className="w-full h-full"
					viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
				>
					<title>Profile Completion Progress</title>
					<circle
						cx={svgSize.width / 2}
						cy={svgSize.height / 2}
						r={radius}
						fill="none"
						stroke="#F3F4F6"
						strokeWidth="12"
					/>
					{/* Progress circle */}
					<circle
						cx={svgSize.width / 2}
						cy={svgSize.height / 2}
						r={radius}
						fill="none"
						stroke={getColor()}
						strokeWidth="12"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						transform={`rotate(-90 ${svgSize.width / 2} ${svgSize.height / 2})`}
						strokeLinecap="round"
					/>
				</svg>

				{/* Percentage text */}
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-4xl font-bold" style={{ color: getColor() }}>
						{percentage}%
					</span>
				</div>
			</div>
		</div>
	);
};

export default ProfileCompletionCard;
