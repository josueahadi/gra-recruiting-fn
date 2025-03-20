"use client";

import { Button } from "@/components/ui/button";
// import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";

interface ProfileCompletionProps {
	percentage: number;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
	percentage,
}) => {
	// Determine color based on percentage
	const getColor = () => {
		if (percentage < 30) return "text-red-500";
		if (percentage < 100) return "text-amber-500";
		return "text-green-500";
	};

	// SVG circle calculations
	const radius = 70;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<div className="bg-white rounded-lg p-6 flex flex-col items-center">
			<h3 className="text-lg font-medium mb-4">Profile Completion</h3>

			<div className="relative w-40 h-40">
				{/* Background circle */}
				<svg className="w-full h-full" viewBox="0 0 160 160">
					<title>Profile Completion</title>
					<circle
						cx="80"
						cy="80"
						r={radius}
						fill="none"
						stroke="#F3F4F6"
						strokeWidth="12"
					/>
					{/* Progress circle */}
					<circle
						cx="80"
						cy="80"
						r={radius}
						fill="none"
						stroke={
							percentage < 30
								? "#EF4444"
								: percentage < 100
									? "#F59E0B"
									: "#10B981"
						}
						strokeWidth="12"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						transform="rotate(-90 80 80)"
						strokeLinecap="round"
					/>
				</svg>

				{/* Percentage text */}
				<div className="absolute inset-0 flex items-center justify-center">
					<span className={cn("text-4xl font-bold", getColor())}>
						{percentage}%
					</span>
				</div>
			</div>
		</div>
	);
};

const ApplicantDashboard = () => {
	// Mock data - in a real app this would come from API/context
	const profile = {
		name: "John Doe",
		completionPercentage: 75,
	};

	return (
		<div className="space-y-8">
			{/* Welcome Card */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white relative overflow-hidden">
				<div className="relative z-10">
					<h2 className="text-lg">Hi, {profile.name}</h2>
					<h1 className="text-3xl font-bold mt-2 mb-6">
						Welcome To Your
						<br />
						Applicant Dashboard
					</h1>

					<Button
						variant="default"
						className="bg-white text-blue-600 hover:bg-gray-100"
					>
						Complete Your Profile
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="ml-2"
						>
							<title>Arrow Icon</title>
							<path
								d="M5 12H19"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M12 5L19 12L12 19"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Button>
				</div>

				{/* Background image */}
				<Image
					src="/images/join-us.png"
					alt="Happy Applicant"
					className="absolute right-0 top-0 h-full object-contain object-right"
					width={332}
					height={300}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Profile Completion */}
				<ProfileCompletion percentage={profile.completionPercentage} />

				{/* Action Card */}
				<div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center text-center">
					<Image
						src="/images/profile-checklist.svg"
						alt="Complete Profile"
						className="mb-6"
						width={207}
						height={126}
					/>

					<h3 className="text-lg font-medium mb-2">
						First complete your profile to unlock the assessment
					</h3>

					<Button className="mt-4 bg-blue-500 hover:bg-blue-600">
						Complete Your Profile
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="ml-2"
						>
							<title>Arrow Icon</title>
							<path
								d="M5 12H19"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M12 5L19 12L12 19"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ApplicantDashboard;
