"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionSidebar from "@/components/applicant/exam/section-sidebar";
import MultipleChoiceQuestion from "@/components/applicant/exam/questions/multiple-choice";
import EssayQuestion from "@/components/applicant/exam/questions/essay";
import ExamCompletion from "@/components/applicant/exam/exam-completion";

interface AssessmentPageProps {
	sectionId?: string;
	questionNumber?: string;
}

/**
 * The main assessment page component
 * Displays questions and navigation based on section and question number
 */
const AssessmentPage: React.FC<AssessmentPageProps> = ({
	sectionId = "1",
	questionNumber = "1",
}) => {
	const router = useRouter();

	// Convert to numbers for easier comparisons
	const currentSectionId = Number.parseInt(sectionId);
	const currentQuestionNum = Number.parseInt(questionNumber);

	// State for question content and user responses
	const [questionText, setQuestionText] = useState("");
	const [questionImageUrl, setQuestionImageUrl] = useState<
		string | undefined
	>();
	const [options, setOptions] = useState<
		Array<{
			id: string | number;
			optionText?: string;
			optionImageUrl?: string;
		}>
	>([]);
	const [selectedOptionId, setSelectedOptionId] = useState<string | number>("");
	const [essayAnswer, setEssayAnswer] = useState("");
	const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
	const [timeLeft, setTimeLeft] = useState("00:15:00");
	const [isLoading, setIsLoading] = useState(true);
	const [examCompleted, setExamCompleted] = useState(false);

	// Determine section type and total questions
	const sectionType =
		currentSectionId === 1 ? "multiple-choice" : "short-essay";
	const totalQuestions = currentSectionId === 1 ? 15 : 5;

	// Mock timer (in a real app, implement actual countdown)
	useEffect(() => {
		// In a real implementation, set up a proper countdown timer
		// For now, just use a static value
		setTimeLeft("00:15:00");

		// Clean up timer if needed
		return () => {
			// Clear any timers if needed
		};
	}, []);

	// Fetch question data when section or question changes
	useEffect(() => {
		const fetchQuestionData = async () => {
			setIsLoading(true);
			try {
				// In a real app, this would be an API call
				// const response = await fetch(`/api/exam/section/${sectionId}/question/${questionNumber}`);
				// const data = await response.json();

				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Set dummy question data based on section and question number
				if (currentSectionId === 1) {
					// Multiple choice questions
					if (currentQuestionNum === 9) {
						// Logic question example from Image 2
						setQuestionText(
							'All 2-legged animals are "Zelopes", No brown furred Animals have 2 legs. Which statement is true:',
						);
						setOptions([
							{ id: "a", optionText: "No Zelopes have brown fur" },
							{ id: "b", optionText: "Some Zelopes may have brown fur" },
							{ id: "c", optionText: "All 2-legged animals have white fur" },
							{ id: "d", optionText: "All Zelopes have brown fur" },
						]);
					} else if (currentQuestionNum === 10) {
						// Visual question example from Image 3
						setQuestionText(
							"Select the correct pattern that should go in the empty space:",
						);
						setQuestionImageUrl("/images/pattern-question.jpg");
						setOptions([
							{ id: "a", optionImageUrl: "/images/pattern-a.jpg" },
							{ id: "b", optionImageUrl: "/images/pattern-b.jpg" },
							{ id: "c", optionImageUrl: "/images/pattern-c.jpg" },
							{ id: "d", optionImageUrl: "/images/pattern-d.jpg" },
						]);
					} else {
						// Generic multiple choice question
						setQuestionText(
							`This is multiple choice question ${currentQuestionNum} in section 1.`,
						);
						setOptions([
							{
								id: "a",
								optionText: `Option A for question ${currentQuestionNum}`,
							},
							{
								id: "b",
								optionText: `Option B for question ${currentQuestionNum}`,
							},
							{
								id: "c",
								optionText: `Option C for question ${currentQuestionNum}`,
							},
							{
								id: "d",
								optionText: `Option D for question ${currentQuestionNum}`,
							},
						]);
					}
				} else {
					// Essay questions
					if (currentQuestionNum === 1) {
						// Resume question example from Image 4
						setQuestionText(
							"A well-structured resume is one of the most important tools for job seekers. It helps employers quickly assess a candidate's qualifications and suitability for a role. When creating a resume, what is the primary purpose it should serve in a job application?",
						);
					} else {
						// Generic essay question
						setQuestionText(
							`This is essay question ${currentQuestionNum} in section 2.`,
						);
					}
				}

				// Get answered questions from localStorage
				const savedAnswers = localStorage.getItem(
					`section_${sectionId}_answers`,
				);
				if (savedAnswers) {
					setAnsweredQuestions(JSON.parse(savedAnswers));
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching question:", error);
				setIsLoading(false);
			}
		};

		fetchQuestionData();
	}, [sectionId, questionNumber, currentSectionId, currentQuestionNum]);

	// Handle option selection for multiple choice questions
	const handleSelectOption = (optionId: string | number) => {
		setSelectedOptionId(optionId);
	};

	// Handle text input for essay questions
	const handleEssayChange = (text: string) => {
		setEssayAnswer(text);
	};

	// Handle time up event
	const handleTimeUp = () => {
		// Auto-submit current section and move to next section or completion
		if (currentSectionId === 1) {
			router.push(`/applicant/exam/assessment/section/2/question/1`);
		} else {
			setExamCompleted(true);
			localStorage.setItem("assessmentCompleted", "true");
		}
	};

	// Handle question navigation from sidebar
	const handleQuestionSelect = (questionNum: number) => {
		// Only allow navigation to questions that have been seen/answered
		if (
			answeredQuestions.includes(questionNum) ||
			questionNum === currentQuestionNum
		) {
			router.push(
				`/applicant/exam/assessment/section/${sectionId}/question/${questionNum}`,
			);
		}
	};

	// Handle next question button click
	const handleNextQuestion = () => {
		// Save answer (in a real app, this would be an API call)
		console.log(
			"Saving answer:",
			sectionType === "multiple-choice" ? selectedOptionId : essayAnswer,
		);

		// Update answered questions list
		const updatedAnsweredQuestions = [...answeredQuestions];
		if (!updatedAnsweredQuestions.includes(currentQuestionNum)) {
			updatedAnsweredQuestions.push(currentQuestionNum);
		}
		setAnsweredQuestions(updatedAnsweredQuestions);
		localStorage.setItem(
			`section_${sectionId}_answers`,
			JSON.stringify(updatedAnsweredQuestions),
		);

		// Reset current answer for next question
		setSelectedOptionId("");
		setEssayAnswer("");

		// Navigate to next question or next section
		if (currentQuestionNum < totalQuestions) {
			// Go to next question
			router.push(
				`/applicant/exam/assessment/section/${sectionId}/question/${currentQuestionNum + 1}`,
			);
		} else if (currentSectionId === 1) {
			// First section completed, go to second section
			router.push(`/applicant/exam/assessment/section/2/question/1`);
		} else {
			// All sections completed
			setExamCompleted(true);
			localStorage.setItem("assessmentCompleted", "true");
		}
	};

	// Show exam completion screen if exam is finished
	if (examCompleted) {
		return <ExamCompletion />;
	}

	// Show loading indicator while fetching question data
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base"></div>
			</div>
		);
	}

	// Render the main assessment interface
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 min-h-[600px]">
			{/* Sidebar with question navigation */}
			<div className="md:col-span-1 p-4">
				<SectionSidebar
					currentSection={sectionType}
					currentQuestion={currentQuestionNum}
					totalQuestions={totalQuestions}
					timeLeft={timeLeft}
					answeredQuestions={answeredQuestions}
					onQuestionSelect={handleQuestionSelect}
				/>
			</div>

			{/* Main question content */}
			<div className="md:col-span-3 lg:col-span-4 border-l p-6">
				{sectionType === "multiple-choice" ? (
					<MultipleChoiceQuestion
						questionNumber={currentQuestionNum}
						totalQuestions={totalQuestions}
						questionText={questionText}
						questionImageUrl={questionImageUrl}
						options={options}
						selectedOptionId={selectedOptionId}
						onSelectOption={handleSelectOption}
						onNextQuestion={handleNextQuestion}
						buttonText={
							currentQuestionNum === totalQuestions && currentSectionId === 2
								? "Submit"
								: "Next Question"
						}
					/>
				) : (
					<EssayQuestion
						questionNumber={currentQuestionNum}
						totalQuestions={totalQuestions}
						questionText={questionText}
						questionImageUrl={questionImageUrl}
						answer={essayAnswer}
						onAnswerChange={handleEssayChange}
						onSubmit={handleNextQuestion}
						buttonText={
							currentQuestionNum === totalQuestions ? "Submit" : "Next Question"
						}
					/>
				)}
			</div>
		</div>
	);
};

export default AssessmentPage;
