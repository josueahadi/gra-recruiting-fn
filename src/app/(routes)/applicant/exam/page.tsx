"use client";

import AssessmentIntro from "@/components/applicant/exam/assessment-intro";
import ProfileBlockMessage from "@/components/applicant/exam/profile-block-message";
import AppLayoutWrapper from "@/components/layout/app-layout-wrapper";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function ExamPage() {
	const router = useRouter();
	const [isProfileComplete, setIsProfileComplete] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkProfileStatus = async () => {
			setIsLoading(true);
			try {
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

				setIsProfileComplete(profileCompletion === 100);
			} catch (error) {
				console.error("Error checking profile status:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkProfileStatus();
	}, []);

	const handleStartExam = () => {
		router.push("/applicant/assessment");
	};

	if (isLoading) {
		return (
			<AppLayoutWrapper>
				<div className="bg-white rounded-lg p-6 shadow-sm">
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
					</div>
				</div>
			</AppLayoutWrapper>
		);
	}

	return (
		<AppLayoutWrapper>
			<div className="bg-white rounded-lg shadow-sm py-10 md:py-20">
				{isProfileComplete ? (
					<AssessmentIntro
						title="GROW RWANDA RECRUITMENT ASSESSMENT"
						description="The Grow Rwanda Recruitment Assessment is designed to evaluate candidates based on their knowledge and reasoning skills. The exam consists of two sections:"
						sections={[
							{
								title: "section 1",
								description: "Multiple Choice",
								timeInMinutes: 35,
								questionCount: 30,
							},
							{
								title: "section 2",
								description: "Short Essay",
								timeInMinutes: 25,
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
					<ProfileBlockMessage
						title="First complete your profile to unlock the assessment"
						buttonText="Complete Your Profile"
						showImage={true}
					/>
				)}
			</div>
		</AppLayoutWrapper>
	);
}
