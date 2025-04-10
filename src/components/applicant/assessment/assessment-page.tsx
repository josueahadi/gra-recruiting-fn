"use client";

import ExamCompletion from "@/components/applicant/assessment/exam-completion";
import EssayQuestion from "@/components/applicant/assessment/questions/essay";
import MultipleChoiceQuestion from "@/components/applicant/assessment/questions/multiple-choice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import AssessmentLayout from "./assessment-layout";
import { useQuestions } from "@/hooks/use-questions";
import {
	type Question,
	type MultipleChoiceQuestion as MCQuestion,
	type Choice,
	EXAM_COMPLETION_KEY,
	EXAM_SECTION_ANSWERS_KEY,
	QUESTION_MAPPING_KEY,
} from "@/types";

interface AssessmentPageProps {
	params?: {
		sectionId?: string;
	};
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
	const router = useRouter();
	const { getQuestionsBySection } = useQuestions();

	// Replace URL parameters with state
	const [currentSectionId, setCurrentSectionId] = useState(1);
	const [currentQuestionNum, setCurrentQuestionNum] = useState(1);

	// State for question mapping
	const [questionMapping, setQuestionMapping] = useState<{
		[key: string]: Question[];
	}>({});

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
	const [answeredQuestions, setAnsweredQuestions] = useState<{
		[key: string]: number[];
	}>({
		"1": [],
		"2": [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [examCompleted, setExamCompleted] = useState(false);

	// Determine section type and total questions
	const sectionType =
		currentSectionId === 1 ? "multiple-choice" : "short-essay";
	const totalQuestions = currentSectionId === 1 ? 15 : 5;

	// Initialize question mapping on first load
	useEffect(() => {
		const initializeQuestionMapping = () => {
			// Check if we already have a mapping
			const savedMapping = localStorage.getItem(QUESTION_MAPPING_KEY);

			if (savedMapping) {
				// Use existing mapping
				setQuestionMapping(JSON.parse(savedMapping));
			} else {
				// Get questions from our centralized data source
				const questionsBySection = getQuestionsBySection();

				// Create new randomized mapping
				const section1Questions = [...questionsBySection["1"]].sort(
					() => Math.random() - 0.5,
				);
				const section2Questions = [...questionsBySection["2"]].sort(
					() => Math.random() - 0.5,
				);

				// Re-assign display IDs (position in exam) but keep original IDs for reference
				const mappedSection1 = section1Questions.map((q, idx) => ({
					...q,
					displayId: idx + 1,
					originalId: q.id,
				}));

				const mappedSection2 = section2Questions.map((q, idx) => ({
					...q,
					displayId: idx + 1,
					originalId: q.id,
				}));

				const newMapping = {
					"1": mappedSection1,
					"2": mappedSection2,
				};

				// Save to localStorage and state
				localStorage.setItem(QUESTION_MAPPING_KEY, JSON.stringify(newMapping));
				setQuestionMapping(newMapping);
			}
		};

		// Check for URL params on initial load, then discard them
		if (params?.sectionId) {
			const initialSectionId = Number.parseInt(params.sectionId, 10) || 1;
			setCurrentSectionId(initialSectionId);
		}

		initializeQuestionMapping();
	}, [params, getQuestionsBySection]);

	// Fetch question data when section or question changes
	useEffect(() => {
		setIsLoading(true);

		const fetchQuestionData = async () => {
			try {
				// Check if the URL has a completion parameter
				const urlParams =
					typeof window !== "undefined"
						? new URLSearchParams(window.location.search)
						: null;
				const showCompletion = urlParams?.get("examCompleted");

				if (showCompletion === "true") {
					setExamCompleted(true);
					setIsLoading(false);
					return;
				}

				// Check if exam was previously completed
				const savedExamCompletion = localStorage.getItem(EXAM_COMPLETION_KEY);
				if (savedExamCompletion === "true") {
					setExamCompleted(true);
					setIsLoading(false);
					return;
				}

				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 300));

				// Find the mapped question
				if (Object.keys(questionMapping).length > 0) {
					const sectionQuestions = questionMapping[currentSectionId.toString()];
					const mappedQuestion = sectionQuestions?.find(
						(q) => q.displayId === currentQuestionNum,
					);

					if (mappedQuestion) {
						// Use the mapped question
						setQuestionText(mappedQuestion.text);
						setQuestionImageUrl(mappedQuestion.imageUrl);

						if (mappedQuestion.section === "Multiple Choice") {
							// Properly type-check and handle multiple choice questions
							const mcQuestion = mappedQuestion as MCQuestion;
							if (mcQuestion.choices && Array.isArray(mcQuestion.choices)) {
								// Map the choices to the format expected by the MultipleChoiceQuestion component
								const formattedOptions = mcQuestion.choices.map(
									(choice: Choice) => ({
										id: choice.id,
										optionText: choice.text, // Map 'text' to 'optionText' as expected by your component
										optionImageUrl: choice.imageUrl, // Map 'imageUrl' to 'optionImageUrl'
									}),
								);
								setOptions(formattedOptions);
							} else {
								console.error(
									"Choices property is missing or not an array",
									mcQuestion,
								);
								setOptions([]);
							}
						}
					} else {
						// Fallback to generic question if mapping failed
						if (currentSectionId === 1) {
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
						} else {
							setQuestionText(
								`This is essay question ${currentQuestionNum} in section 2.`,
							);
						}
					}
				} else {
					// Default questions if mapping isn't ready yet
					if (currentSectionId === 1) {
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
					} else {
						setQuestionText(
							`This is essay question ${currentQuestionNum} in section 2.`,
						);
					}
				}

				// Get saved answers from localStorage
				try {
					const savedAnswersJSON = localStorage.getItem(
						EXAM_SECTION_ANSWERS_KEY,
					);
					if (savedAnswersJSON) {
						const parsedAnswers = JSON.parse(savedAnswersJSON);
						setAnsweredQuestions(parsedAnswers);
					}
				} catch (err) {
					console.error("Error parsing saved answers:", err);
					// Initialize with empty arrays if there's an error
					setAnsweredQuestions({ "1": [], "2": [] });
				}

				// Load saved answer for this question
				const savedSelectedOption = localStorage.getItem(
					`s${currentSectionId}_q${currentQuestionNum}_mc`,
				);
				if (savedSelectedOption && currentSectionId === 1) {
					setSelectedOptionId(savedSelectedOption);
				} else if (currentSectionId === 1) {
					// Clear selected option when moving to a new question
					setSelectedOptionId("");
				}

				const savedEssayAnswer = localStorage.getItem(
					`s${currentSectionId}_q${currentQuestionNum}_essay`,
				);
				if (savedEssayAnswer && currentSectionId === 2) {
					setEssayAnswer(savedEssayAnswer);
				} else if (currentSectionId === 2) {
					// Clear essay answer when moving to a new question
					setEssayAnswer("");
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching question:", error);
				setIsLoading(false);
			}
		};

		fetchQuestionData();
	}, [currentSectionId, currentQuestionNum, questionMapping]);

	// Handle option selection for multiple choice questions
	const handleSelectOption = (optionId: string | number) => {
		setSelectedOptionId(optionId.toString());
		// Save selected option to localStorage with shorter key
		localStorage.setItem(
			`s${currentSectionId}_q${currentQuestionNum}_mc`,
			optionId.toString(),
		);
	};

	// Handle text input for essay questions
	const handleEssayChange = (text: string) => {
		setEssayAnswer(text);
		// Save essay answer to localStorage with shorter key
		localStorage.setItem(
			`s${currentSectionId}_q${currentQuestionNum}_essay`,
			text,
		);
	};

	// Handle completing the exam
	const completeExam = () => {
		setExamCompleted(true);
		localStorage.setItem(EXAM_COMPLETION_KEY, "true");
		// Clear any conflicting parameters
		localStorage.removeItem("assessmentCompleted");
	};

	// Reset exam data (for testing)
	const resetExam = () => {
		// Clear all exam data
		localStorage.removeItem(EXAM_COMPLETION_KEY);
		localStorage.removeItem(EXAM_SECTION_ANSWERS_KEY);
		localStorage.removeItem(QUESTION_MAPPING_KEY);

		// Clear answers for all questions
		for (let s = 1; s <= 2; s++) {
			const questionCount = s === 1 ? 15 : 5;
			for (let q = 1; q <= questionCount; q++) {
				localStorage.removeItem(`s${s}_q${q}_mc`);
				localStorage.removeItem(`s${s}_q${q}_essay`);
			}
		}

		// Reload the page to start fresh
		window.location.href = "/applicant/exam";
	};

	// Handle question navigation from sidebar
	const handleQuestionSelect = (questionNum: number) => {
		// For development purposes, allow clicking on any question
		setCurrentQuestionNum(questionNum);

		/* Production code:
    // Get the highest question number the user has seen
    const maxSeenQuestion = Math.max(
      currentQuestionNum,
      ...(answeredQuestions[currentSectionId.toString()] || [0]),
    );

    // Allow navigation to any previously seen question or the next consecutive question
    if (questionNum <= maxSeenQuestion + 1) {
      setCurrentQuestionNum(questionNum);
    }
    */
	};

	// Handle next question button click
	const handleNextQuestion = () => {
		// Save answer and update answered questions
		const updatedAnsweredQuestions = { ...answeredQuestions };
		const sectionIdStr = currentSectionId.toString();

		if (!updatedAnsweredQuestions[sectionIdStr]?.includes(currentQuestionNum)) {
			if (!updatedAnsweredQuestions[sectionIdStr]) {
				updatedAnsweredQuestions[sectionIdStr] = [];
			}
			updatedAnsweredQuestions[sectionIdStr] = [
				...updatedAnsweredQuestions[sectionIdStr],
				currentQuestionNum,
			];
		}

		setAnsweredQuestions(updatedAnsweredQuestions);
		localStorage.setItem(
			EXAM_SECTION_ANSWERS_KEY,
			JSON.stringify(updatedAnsweredQuestions),
		);

		// Navigate to next question or next section
		if (currentQuestionNum < totalQuestions) {
			// Go to next question
			setCurrentQuestionNum(currentQuestionNum + 1);
		} else if (currentSectionId === 1) {
			// First section completed, go to second section
			setCurrentSectionId(2);
			setCurrentQuestionNum(1);
		} else {
			// All sections completed
			completeExam();
		}
	};

	// Show loading indicator while fetching question data
	if (isLoading) {
		return (
			<AssessmentLayout showNavigation={true}>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
				</div>
			</AssessmentLayout>
		);
	}

	// Show exam completion screen if exam is finished
	if (examCompleted) {
		return (
			<AssessmentLayout
				showNavigation={true}
				currentSectionId={currentSectionId}
				currentQuestionNumber={currentQuestionNum}
				answeredQuestions={answeredQuestions[currentSectionId.toString()] || []}
				onQuestionSelect={handleQuestionSelect}
				pageTitle="Exam Completed"
			>
				<ExamCompletion
					title="Exam Completed"
					message="You have successfully completed the exam. Thank you for your time and effort."
					subtitle="Your results will be available soon"
					buttonText="Back To Dashboard"
					imageUrl="/images/exam-complete.png"
					onButtonClick={() => router.push("/applicant/dashboard")}
				/>

				{/* For development only - reset button */}
				<div className="text-center">
					<button
						type="button"
						onClick={resetExam}
						className="text-sm text-gray-400 hover:text-gray-600 underline"
					>
						Reset Exam (Dev Only)
					</button>
				</div>
			</AssessmentLayout>
		);
	}

	// Render the main assessment interface with the AssessmentLayout
	return (
		<AssessmentLayout
			userName="John Doe"
			currentSectionId={currentSectionId}
			currentQuestionNumber={currentQuestionNum}
			answeredQuestions={answeredQuestions[currentSectionId.toString()] || []}
			onQuestionSelect={handleQuestionSelect}
			showNavigation={true}
		>
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
						currentQuestionNum === totalQuestions
							? "Next Section"
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
		</AssessmentLayout>
	);
}
