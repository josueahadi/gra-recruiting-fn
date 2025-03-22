import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoveRight, MoveUpRight } from "lucide-react";

// Type definitions for better type safety
interface ResultData {
	sectionOne: {
		score: number;
		completed: boolean;
	};
	sectionTwo: {
		score: number | null;
		completed: boolean;
	};
	assessmentCompleted: boolean;
}

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
			<h3 className="text-lg font-semibold mb-4">Profile Completion</h3>

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

// Result component for showing assessment results
const ResultSection = ({ section, score, completed }) => {
	// SVG circle calculations for score display
	const radius = 70;
	const circumference = 2 * Math.PI * radius;
	const offset = completed
		? circumference - (score / 100) * circumference
		: circumference;

	return (
		<div className="w-full md:w-1/2 flex flex-col items-center mb-8 md:mb-0">
			<div className="relative w-40 h-40">
				{/* Score circle */}
				<svg className="w-full h-full" viewBox="0 0 160 160">
					<title>Assessment Score</title>
					<circle
						cx="80"
						cy="80"
						r={radius}
						fill="none"
						stroke="#F3F4F6"
						strokeWidth="12"
					/>
					{completed && (
						<circle
							cx="80"
							cy="80"
							r={radius}
							fill="none"
							stroke={
								score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"
							}
							strokeWidth="12"
							strokeDasharray={circumference}
							strokeDashoffset={offset}
							transform="rotate(-90 80 80)"
							strokeLinecap="round"
						/>
					)}
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					{completed ? (
						<span
							className="text-4xl font-bold"
							style={{
								color:
									score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444",
							}}
						>
							{score}%
						</span>
					) : (
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
							<circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2" />
						</svg>
					)}
				</div>
			</div>
			<h3 className="text-xl mt-4">
				{section === "one"
					? "Section One - Multiple Choice"
					: "Section Two - Short Essay"}
			</h3>
			{!completed && (
				<p className="text-center mt-2 text-gray-500">
					{section === "one" ? "Not yet completed" : "Results pending"}
				</p>
			)}
		</div>
	);
};

// Main dashboard content
const ApplicantDashboard = () => {
	const router = useRouter();

	// State for profile completion and assessment results
	const [completionPercentage, setCompletionPercentage] = useState(75);
	const [showResults, setShowResults] = useState(false);
	const [resultsData, setResultsData] = useState<ResultData>({
		sectionOne: {
			score: 75,
			completed: true,
		},
		sectionTwo: {
			score: null,
			completed: false,
		},
		assessmentCompleted: false,
	});
	const [isLoading, setIsLoading] = useState(true);

	// Simulate loading profile and result data from API
	useEffect(() => {
		// Simulate API call
		const fetchDashboardData = async () => {
			setIsLoading(true);
			try {
				// In a real app, these would be actual API calls
				// const profileResponse = await fetch('/api/profile/status');
				// const profileData = await profileResponse.json();

				// const resultsResponse = await fetch('/api/assessment/results');
				// const resultsData = await resultsResponse.json();

				// Simulate API response delay
				await new Promise((resolve) => setTimeout(resolve, 800));

				// For demonstration, check URL parameters to toggle between states
				const urlParams = new URLSearchParams(window.location.search);
				const completionParam = urlParams.get("completion");
				const showResultsParam = urlParams.get("showResults");

				// Update state based on URL parameters or localStorage
				const savedCompletion = localStorage.getItem("profileCompletion");
				if (completionParam) {
					const newCompletion = parseInt(completionParam, 10);
					setCompletionPercentage(newCompletion);
					localStorage.setItem("profileCompletion", newCompletion.toString());
				} else if (savedCompletion) {
					setCompletionPercentage(parseInt(savedCompletion, 10));
				}

				// Check if we should show results
				if (showResultsParam === "true") {
					setShowResults(true);

					// Simulate different result states based on URL parameter
					const resultState = urlParams.get("resultState") || "section1";
					if (resultState === "section1") {
						setResultsData({
							sectionOne: {
								score: 75,
								completed: true,
							},
							sectionTwo: {
								score: null,
								completed: false,
							},
							assessmentCompleted: false,
						});
					} else if (resultState === "complete") {
						setResultsData({
							sectionOne: {
								score: 75,
								completed: true,
							},
							sectionTwo: {
								score: 85,
								completed: true,
							},
							assessmentCompleted: true,
						});
					}
				} else {
					// Check if the user has completed any assessments
					// This would be determined by the API in a real app
					const hasCompletedAssessment = localStorage.getItem(
						"assessmentCompleted",
					);

					if (hasCompletedAssessment === "true") {
						setShowResults(true);
					}
				}
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	// Button label changes based on profile completion
	const getActionButtonLabel = () => {
		if (showResults) {
			return resultsData.assessmentCompleted
				? "View Full Results"
				: "Continue Assessment";
		}
		return completionPercentage === 100
			? "Go To Exam"
			: "Complete Your Profile";
	};

	// Handle main CTA button click
	const handleActionButtonClick = () => {
		if (showResults) {
			if (resultsData.assessmentCompleted) {
				// Go to full results page
				router.push("/applicant/results");
			} else {
				// Continue to next section of assessment
				router.push("/applicant/exam");
			}
		} else {
			if (completionPercentage < 100) {
				// Redirect to profile page
				router.push("/applicant");
			} else {
				// Redirect to exam page
				router.push("/applicant/exam");
			}
		}
	};

	// Toggle between results view and profile/assessment view
	const toggleResultsView = () => {
		setShowResults(!showResults);
	};

	// Handle the button in the profile completion card
	const handleCompleteProfileClick = () => {
		// Redirect to profile page
		router.push("/applicant");
	};

	// Determine which main content to render based on completion percentage
	const renderMainContent = () => {
		// For 100% completion, show assessment info
		if (completionPercentage === 100) {
			return (
				<div className="bg-white rounded-lg p-8 w-full text-center">
					<h1 className="text-2xl md:text-4xl font-bold mb-4">
						GROW RWANDA RECRUITMENT ASSESSMENT
					</h1>
					<p className="mb-8 max-w-2xl mx-auto">
						The Grow Rwanda Recruitment Assessment is designed to evaluate
						candidates based on their knowledge and reasoning skills. The exam
						consists of two sections:
					</p>

					<Button
						className="bg-primary-base hover:bg-primary-base flex items-center mx-auto px-6 py-4 text-base font-semibold"
						onClick={() => router.push("/applicant/exam")}
					>
						Go To Exam
						<MoveRight className="w-6 h-6 ml-2" />
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

				<h3 className="text-lg font-semibold mb-2">
					First complete your profile to unlock the assessment
				</h3>

				<Button
					className="mt-4 bg-primary-base hover:bg-primary-base flex items-center p-6 text-base font-semibold"
					onClick={handleCompleteProfileClick}
				>
					Complete Your Profile
					<MoveUpRight className="w-6 h-6 ml-2" />
				</Button>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Welcome Card - spans 2/3 of the width */}
				<div className="md:col-span-2">
					<div className="bg-gradient-to-tr from-primary-dark to-custom-skyBlue rounded-lg text-white relative z-10 overflow-hidden flex flex-col md:flex-row items-center p-6">
						<div
							className="absolute inset-0 z-0 opacity-100 pointer-events-none"
							style={{
								backgroundImage: "url('/images/growrwanda-pattern-01.svg')",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
							}}
						/>
						<Image
							src="/images/complete-profile.png"
							alt="Happy Applicant"
							className="z-10"
							width={332}
							height={300}
						/>
						<div className="relative z-10 py-6 flex flex-col items-center text-center md:items-start md:text-left">
							<h2 className="text-lg">Hi, John Doe</h2>
							<h1 className="text-3xl font-semibold mt-2 mb-6">
								Welcome To Your
								<br />
								Applicant Dashboard
							</h1>

							<div className="flex flex-wrap gap-4">
								<Button
									variant="default"
									className="bg-white text-custom-skyBlue hover:bg-gray-100 flex items-center font-semibold"
									onClick={handleActionButtonClick}
								>
									{getActionButtonLabel()}
									<MoveRight className="w-6 h-6 ml-2" />
								</Button>

								{/* Show this button only if user has results to view */}
								{(completionPercentage === 100 || showResults) && (
									<Button
										variant="outline"
										className="bg-transparent border-white text-white hover:bg-white/10"
										onClick={toggleResultsView}
									>
										{showResults ? "View Assessment" : "View Results"}
									</Button>
								)}
							</div>
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
				// Show exam results
				<div className="bg-white rounded-lg p-8 w-full">
					<h2 className="text-3xl font-bold mb-12">Assessment Results</h2>

					<div className="flex flex-wrap">
						<ResultSection
							section="one"
							score={resultsData.sectionOne.score}
							completed={resultsData.sectionOne.completed}
						/>

						<div className="w-full md:w-1/2 flex flex-col items-center">
							{resultsData.sectionTwo.completed ? (
								<ResultSection
									section="two"
									score={resultsData.sectionTwo.score}
									completed={resultsData.sectionTwo.completed}
								/>
							) : (
								<div className="flex flex-col items-center justify-center bg-amber-50 py-8 px-4 rounded-lg w-full max-w-sm">
									<svg
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>Pending</title>
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
										{resultsData.sectionOne.completed
											? "Come back later for Section 2 score"
											: "Complete Section 1 first"}
									</p>
								</div>
							)}
						</div>
					</div>

					{resultsData.assessmentCompleted && (
						<div className="mt-8 text-center">
							<Button
								className="bg-primary-base hover:bg-primary-base flex items-center mx-auto px-6 py-4 text-base font-semibold"
								onClick={() => router.push("/applicant/results")}
							>
								View Detailed Results
								<MoveRight className="w-6 h-6 ml-2" />
							</Button>
						</div>
					)}
				</div>
			) : (
				// Show profile completion or assessment info
				renderMainContent()
			)}
		</div>
	);
};

export default ApplicantDashboard;
