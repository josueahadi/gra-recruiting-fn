"use client";

import AssessmentIntro from "@/components/applicant/exam/assessment-intro";
import ProfileBlockMessage from "@/components/applicant/exam/profile-block-message";
import AppLayout from "@/components/layout/app-layout-updated";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

/**
 * The main exam page component - shows either exam intro or profile block message
 * This is what's displayed when user clicks on "Exam" in the sidebar
 */
export default function ExamPage() {
	const router = useRouter();
	const [isProfileComplete, setIsProfileComplete] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Check if the profile is complete when component mounts
	useEffect(() => {
		const checkProfileStatus = async () => {
			setIsLoading(true);
			try {
				// In a real app, this would be an API call
				// const response = await fetch('/api/profile/status');
				// const data = await response.json();
				// setIsProfileComplete(data.isComplete);

				// For demo purposes, check localStorage or URL params
				const urlParams = new URLSearchParams(window.location.search);
				const completionParam = urlParams.get("completion");
				const savedCompletion = localStorage.getItem("profileCompletion");

				let profileCompletion = 0;

				if (completionParam) {
					profileCompletion = Number.parseInt(completionParam, 10);
					localStorage.setItem("profileCompletion", completionParam);
				} else if (savedCompletion) {
					profileCompletion = Number.parseInt(savedCompletion, 10);
				}

				// Profile is complete when 100%
				setIsProfileComplete(profileCompletion === 100);
			} catch (error) {
				console.error("Error checking profile status:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkProfileStatus();
	}, []);

	// Handle starting the exam
	const handleStartExam = () => {
		// Navigate to the assessment page instead of a specific question URL
		router.push("/applicant/assessment");
	};

	// Show loading state
	if (isLoading) {
		return (
			<AppLayout userType="applicant">
				<div className="bg-white rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
					</div>
				</div>
			</AppLayout>
		);
	}

	return (
		<AppLayout userType="applicant">
			<div className="bg-white rounded-lg shadow-sm py-10 md:py-20">
				{isProfileComplete ? (
					// Show exam introduction if profile is complete
					<AssessmentIntro
						title="GROW RWANDA RECRUITMENT ASSESSMENT"
						description="The Grow Rwanda Recruitment Assessment is designed to evaluate candidates based on their knowledge and reasoning skills. The exam consists of two sections:"
						sections={[
							{
								title: "section 1",
								description: "Multiple Choice",
								timeInMinutes: 20,
								questionCount: 15,
							},
							{
								title: "section 2",
								description: "Short Essay",
								timeInMinutes: 10,
								questionCount: 5,
							},
						]}
						warningText={[
							"Once a section begins, candidates cannot go back to previous questions.",
							"The system will automatically submit all answers when time runs out.",
						]}
						buttonText="Start Exam"
						onStartExam={handleStartExam}
					/>
				) : (
					// Show message to complete profile
					<ProfileBlockMessage
						title="First complete your profile to unlock the assessment"
						buttonText="Complete Your Profile"
						showImage={true}
					/>
				)}
			</div>
		</AppLayout>
	);
}
