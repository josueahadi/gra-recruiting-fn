import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdaptiveExamLayout from "@/components/applicant/exam/exam-layout";
import MultipleChoiceQuestion from "@/components/applicant/exam/questions/multiple-choice";
import EssayQuestion from "@/components/applicant/exam/questions/essay";
import ExamCompletion from "@/components/applicant/exam/exam-completion";

interface AssessmentPageProps {
	params: {
		sectionId: string;
		questionNumber: string;
	};
}

// Constants for localStorage keys
const EXAM_COMPLETION_KEY = "examCompletion";
const EXAM_SECTION_ANSWERS_KEY = "examSectionAnswers";

/**
 * The main assessment page component using the adaptive layout
 */
export default function AssessmentPage({ params }: AssessmentPageProps) {
	const { sectionId = "1", questionNumber = "1" } = params;
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

	// Fetch question data when section or question changes
	useEffect(() => {
		const fetchQuestionData = async () => {
			setIsLoading(true);
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
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Set dummy question data based on section and question number
				if (currentSectionId === 1) {
					// Multiple choice questions
					if (currentQuestionNum === 9) {
						// Logic question example
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
						// Visual question example
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
						// Resume question example
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
					`s${sectionId}_q${questionNumber}_mc`,
				);
				if (savedSelectedOption && currentSectionId === 1) {
					setSelectedOptionId(savedSelectedOption);
				}

				const savedEssayAnswer = localStorage.getItem(
					`s${sectionId}_q${questionNumber}_essay`,
				);
				if (savedEssayAnswer && currentSectionId === 2) {
					setEssayAnswer(savedEssayAnswer);
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
		// Save selected option to localStorage with shorter key
		localStorage.setItem(
			`s${sectionId}_q${questionNumber}_mc`,
			optionId.toString(),
		);
	};

	// Handle text input for essay questions
	const handleEssayChange = (text: string) => {
		setEssayAnswer(text);
		// Save essay answer to localStorage with shorter key
		localStorage.setItem(`s${sectionId}_q${questionNumber}_essay`, text);
	};

	// Handle time up event
	const handleTimeUp = () => {
		// Auto-submit current section and move to next section or completion
		if (currentSectionId === 1) {
			router.push(`/applicant/exam/section/2/question/1`);
		} else {
			completeExam();
		}
	};

	// Handle completing the exam
	const completeExam = () => {
		setExamCompleted(true);
		localStorage.setItem(EXAM_COMPLETION_KEY, "true");

		// Clear any conflicting parameters
		localStorage.removeItem("assessmentCompleted");
	};

	// Handle question navigation from sidebar
	const handleQuestionSelect = (questionNum: number) => {
		// Only allow navigation to questions that have been seen/answered
		if (
			answeredQuestions[sectionId]?.includes(questionNum) ||
			questionNum === currentQuestionNum
		) {
			router.push(
				`/applicant/exam/section/${sectionId}/question/${questionNum}`,
			);
		}
	};

	// Handle next question button click
	const handleNextQuestion = () => {
		// Save answer and update answered questions
		const updatedAnsweredQuestions = { ...answeredQuestions };
		if (!updatedAnsweredQuestions[sectionId]?.includes(currentQuestionNum)) {
			if (!updatedAnsweredQuestions[sectionId]) {
				updatedAnsweredQuestions[sectionId] = [];
			}
			updatedAnsweredQuestions[sectionId] = [
				...updatedAnsweredQuestions[sectionId],
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
			router.push(
				`/applicant/exam/section/${sectionId}/question/${currentQuestionNum + 1}`,
			);
		} else if (currentSectionId === 1) {
			// First section completed, go to second section
			router.push("/applicant/exam/section/2/question/1");
		} else {
			// All sections completed
			completeExam();
		}
	};

	// Show loading indicator while fetching question data
	if (isLoading) {
		return (
			<AdaptiveExamLayout showNavigation={true}>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
				</div>
			</AdaptiveExamLayout>
		);
	}

	// Show exam completion screen if exam is finished
	if (examCompleted) {
		return (
			<AdaptiveExamLayout
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
				/>
			</AdaptiveExamLayout>
		);
	}

	// Render the main assessment interface with AdaptiveExamLayout
	return (
		<AdaptiveExamLayout
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
		</AdaptiveExamLayout>
	);
}
