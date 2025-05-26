"use client";

import AssessmentIntro from "@/components/applicant/exam/assessment-intro";
import ProfileBlockMessage from "@/components/applicant/exam/profile-block-message";
import AppLayoutWrapper from "@/components/layout/app-layout-wrapper";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { questionsService } from "@/services/questions";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

export default function ExamPage() {
	const router = useRouter();
	const [isProfileComplete, setIsProfileComplete] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

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

	const handleStartExam = async () => {
		setIsFetchingQuestions(true);
		setFetchError(null);
		try {
			await questionsService.getExamQuestions();
			router.push("/applicant/assessment");
		} catch (error: unknown) {
			let message = "Failed to fetch exam questions.";
			if (typeof error === "object" && error !== null) {
				const err = error as {
					response?: { data?: { message?: string } };
					message?: string;
				};
				message = err.response?.data?.message || err.message || message;
			}
			setFetchError(message);
		} finally {
			setIsFetchingQuestions(false);
		}
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

				{/* Loading spinner for fetching questions */}
				{isFetchingQuestions && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
						<div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base mb-4" />
							<p className="text-lg font-semibold">Preparing your exam...</p>
						</div>
					</div>
				)}

				{/* Error modal if fetching questions fails */}
				<Dialog open={!!fetchError}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Unable to Start Exam</DialogTitle>
						</DialogHeader>
						<p>{fetchError}</p>
						<DialogFooter>
							<button
								type="button"
								className="bg-primary-base text-white px-4 py-2 rounded"
								onClick={() => setFetchError(null)}
							>
								Close
							</button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AppLayoutWrapper>
	);
}
