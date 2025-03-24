import ProfileCompletionCard from "@/components/applicant/dashboard/profile-completion-card";
import ResultsDisplay from "@/components/applicant/dashboard/results-display";
import WelcomeBanner from "@/components/applicant/dashboard/welcome-banner";
import ProfileBlockMessage from "@/components/applicant/exam/profile-block-message";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

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
					const newCompletion = Number.parseInt(completionParam, 10);
					setCompletionPercentage(newCompletion);
					localStorage.setItem("profileCompletion", newCompletion.toString());
				} else if (savedCompletion) {
					setCompletionPercentage(Number.parseInt(savedCompletion, 10));
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

	// Format results data for ResultsDisplay component
	const formatResultsForDisplay = () => {
		return [
			{
				section: "one",
				sectionTitle: "Section One",
				sectionDescription: "Multiple Choice",
				score: resultsData.sectionOne.score,
				completed: resultsData.sectionOne.completed,
			},
			{
				section: "two",
				sectionTitle: "Section Two",
				sectionDescription: "Short Essay",
				score: resultsData.sectionTwo.score,
				completed: resultsData.sectionTwo.completed,
			},
		];
	};

	// Determine which main content to render based on completion percentage
	const renderMainContent = () => {
		// For 100% completion, show assessment info
		if (completionPercentage === 100) {
			return (
				<div className="bg-white rounded-lg p-8 md:py-16 w-full text-center">
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
			<ProfileBlockMessage
				title="First complete your profile to unlock the assessment"
				buttonText="Complete Your Profile"
				showImage={true}
				className="md:py-16"
			/>
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
					<WelcomeBanner
						userName="John Doe"
						primaryButtonText={getActionButtonLabel()}
						onPrimaryButtonClick={handleActionButtonClick}
						showSecondaryButton={completionPercentage === 100 || showResults}
						secondaryButtonText={
							showResults ? "View Assessment" : "View Results"
						}
						onSecondaryButtonClick={toggleResultsView}
					/>
				</div>

				{/* Profile Completion Card - 1/3 of the width */}
				<div className="md:col-span-1">
					<ProfileCompletionCard
						className="h-full"
						percentage={completionPercentage}
					/>
				</div>
			</div>

			{/* Bottom content area - shows different content based on completion */}
			{showResults ? (
				<ResultsDisplay
					sectionResults={formatResultsForDisplay()}
					assessmentCompleted={resultsData.assessmentCompleted}
					detailedResultsPath="/applicant/results"
				/>
			) : (
				// Show profile completion or assessment info
				renderMainContent()
			)}
		</div>
	);
};

export default ApplicantDashboard;
