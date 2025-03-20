import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoveUpRight } from "lucide-react";

const ProfileCompletion = ({ percentage, className }) => {
	// Determine color based on percentage
	const getColor = () => {
		if (percentage < 30) return "#EF4444"; // Red
		if (percentage < 100) return "#F59E0B"; // Amber/Yellow
		return "#10B981"; // Green
	};

	// SVG circle calculations
	const radius = 70;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<div
			className={`bg-white rounded-lg p-6 flex flex-col items-center ${className}`}
		>
			{/* Profile completion circle */}
			<h3 className="text-lg font-medium mb-4">Profile Completion</h3>

			<div className="relative w-40 h-40">
				{/* Background circle */}
				<svg className="w-full h-full" viewBox="0 0 160 160">
					<title>Profile Completion Progress</title>
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
						stroke={getColor()}
						strokeWidth="12"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						transform="rotate(-90 80 80)"
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

// Main dashboard content
const ApplicantDashboard = () => {
	const router = useRouter();
	// Get completion percentage from backend in a real app
	// For now, we'll simulate with state
	const [completionPercentage, setCompletionPercentage] = useState(75);

	// Determine what content to show based on completion
	// In a real app, this would come from API or user state
	const [showResults, setShowResults] = useState(false);

	// In a real app, fetch the profile completion status from your API
	useEffect(() => {
		// Example API call:
		// async function fetchProfileStatus() {
		//   const response = await fetch('/api/profile/status');
		//   const data = await response.json();
		//   setCompletionPercentage(data.completionPercentage);
		// }
		// fetchProfileStatus();

		// Simulated API response for demonstration
		// Remove this in production and use real API call
		const timer = setTimeout(() => {
			// This simulates profile data being loaded after component mounts
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	// Button label changes based on profile completion
	const getActionButtonLabel = () => {
		return completionPercentage === 100
			? "Go To Exam"
			: "Complete Your Profile";
	};

	// Handle main CTA button click
	const handleActionButtonClick = () => {
		if (completionPercentage < 100) {
			// Redirect to profile page
			router.push("/applicant");
		} else {
			// Redirect to exam page
			router.push("/applicant/exam");
		}
	};

	// Handle the button in the profile completion card
	const handleCompleteProfileClick = () => {
		// Redirect to profile page
		router.push("/applicant");
	};

	// Function to simulate different completion stages for demonstration purposes
	// In a real app, this would come from your API
	useEffect(() => {
		// This code is just for simulating the progression through stages
		// In your real app, you would get the completion percentage from the backend

		// Get the completion from localStorage (for demo persistence)
		const savedCompletion = localStorage.getItem("profileCompletion");
		if (savedCompletion) {
			setCompletionPercentage(parseInt(savedCompletion, 10));
		}

		// Check if there's a completion param in the URL (for demo purposes)
		const urlParams = new URLSearchParams(window.location.search);
		const completionParam = urlParams.get("completion");
		if (completionParam) {
			const newCompletion = parseInt(completionParam, 10);
			setCompletionPercentage(newCompletion);
			localStorage.setItem("profileCompletion", newCompletion.toString());
		}
	}, []);

	// Determine which main content to render based on completion percentage
	const renderMainContent = () => {
		// For 100% completion, show assessment info
		if (completionPercentage === 100) {
			return (
				<div className="bg-white rounded-lg p-8 w-full text-center">
					<h1 className="text-3xl font-bold mb-4">
						GROW RWANDA RECRUITMENT ASSESSMENT
					</h1>
					<p className="mb-8 max-w-2xl mx-auto">
						The Grow Rwanda Recruitment Assessment is designed to evaluate
						candidates based on their knowledge and reasoning skills. The exam
						consists of two sections:
					</p>

					<Button
						className="bg-[#39ade3] hover:bg-[#3a9fd0] flex items-center mx-auto"
						onClick={() => router.push("/applicant/exam")}
					>
						Go To Exam
						<MoveUpRight className="w-6 h-6" />
					</Button>
				</div>
			);
		}

		// For incomplete profiles, show the checklist card
		return (
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

				<Button
					className="mt-4 bg-[#39ade3] hover:bg-[#3a9fd0] flex items-center"
					onClick={handleCompleteProfileClick}
				>
					Complete Your Profile
					<MoveUpRight className="w-6 h-6" />
				</Button>
			</div>
		);
	};

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Welcome Card - spans 2/3 of the width */}
				<div className="md:col-span-2">
					<div className="bg-gradient-to-tr from-primary-dark to-primary-base rounded-lg text-white relative overflow-hidden flex flex-col md:flex-row items-center">
						<Image
							src="/images/complete-profile.png"
							alt="Happy Applicant"
							className=""
							width={332}
							height={300}
						/>
						<div className="relative z-10">
							<h2 className="text-lg">Hi, John Doe</h2>
							<h1 className="text-3xl font-bold mt-2 mb-6">
								Welcome To Your
								<br />
								Applicant Dashboard
							</h1>

							<Button
								variant="default"
								className="bg-white text-blue-600 hover:bg-gray-100 flex items-center"
								onClick={handleActionButtonClick}
							>
								{getActionButtonLabel()}
								<MoveUpRight className="w-6 h-6" />
							</Button>
						</div>
					</div>
				</div>

				{/* Profile Completion Card - 1/3 of the width */}
				<div className="md:col-span-1">
					<ProfileCompletion
						className="h-full"
						percentage={completionPercentage}
					/>
				</div>
			</div>

			{/* Bottom content area - shows different content based on completion */}
			{showResults ? (
				// Show exam results - for when the user has taken the exam
				<div className="bg-white rounded-lg p-8 w-full">
					<h2 className="text-3xl font-bold mb-12">Score</h2>

					<div className="flex flex-wrap">
						<div className="w-full md:w-1/2 flex flex-col items-center mb-8 md:mb-0">
							<div className="relative w-40 h-40">
								{/* Score circle */}
								<svg className="w-full h-full" viewBox="0 0 160 160">
									<title>Score</title>
									<circle
										cx="80"
										cy="80"
										r="70"
										fill="none"
										stroke="#F3F4F6"
										strokeWidth="12"
									/>
									<circle
										cx="80"
										cy="80"
										r="70"
										fill="none"
										stroke="#10B981"
										strokeWidth="12"
										strokeDasharray="439.6"
										strokeDashoffset="109.9" // 75% filled (439.6 * 0.25)
										transform="rotate(-90 80 80)"
										strokeLinecap="round"
									/>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="text-4xl font-bold text-green-600">75%</span>
								</div>
							</div>
							<h3 className="text-xl mt-4">Section one - Multiple Choice</h3>
						</div>

						<div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-amber-50 py-8 rounded-lg">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>SVG</title>
								<path
									d="M12 9V14"
									stroke="#F59E0B"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle cx="12" cy="17" r="1" fill="#F59E0B" />
								<circle
									cx="12"
									cy="12"
									r="10"
									stroke="#F59E0B"
									strokeWidth="2"
								/>
							</svg>
							<p className="text-xl text-center mt-4 text-gray-700">
								Come back later for Section 2<br />
								score
							</p>
						</div>
					</div>
				</div>
			) : (
				// Show profile completion or assessment info
				renderMainContent()
			)}
		</div>
	);
};

export default ApplicantDashboard;
