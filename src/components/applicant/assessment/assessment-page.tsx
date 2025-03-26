"use client";

import ExamCompletion from "@/components/applicant/assessment/exam-completion";
import AdaptiveExamLayout from "@/components/applicant/assessment/assessment-page-layout";
import EssayQuestion from "@/components/applicant/assessment/questions/essay";
import MultipleChoiceQuestion from "@/components/applicant/assessment/questions/multiple-choice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface AssessmentPageProps {
	params?: {
		sectionId?: string;
	};
}
interface BaseQuestion {
	id: number;
	text: string;
	imageUrl?: string;
	displayId?: number;
	originalId?: number;
	type: string; // This is important for type narrowing
}

interface MultipleChoiceQuestionType extends BaseQuestion {
	type: "multiple-choice";
	options: Array<{
		id: string;
		optionText?: string;
		optionImageUrl?: string;
	}>;
}

interface EssayQuestionType extends BaseQuestion {
	type: "essay";
	// No options for essay questions
}

// Union type for all question types
type Question = MultipleChoiceQuestionType | EssayQuestionType;

// Constants for localStorage keys
const EXAM_COMPLETION_KEY = "examCompletion";
const EXAM_SECTION_ANSWERS_KEY = "examSectionAnswers";
const QUESTION_MAPPING_KEY = "questionMapping";

// Define question bank with all possible questions
const questionBank: { [key: string]: Question[] } = {
	"1": [
		// Section 1 - Multiple Choice
		{
			id: 1,
			type: "multiple-choice",
			text: "Which of the following best defines function composition in programming?",
			options: [
				{
					id: "a",
					optionText:
						"The process of combining two or more functions to create a new function",
				},
				{
					id: "b",
					optionText:
						"Writing comments in your code to explain what a function does",
				},
				{
					id: "c",
					optionText:
						"Creating multiple similar functions with different names",
				},
				{
					id: "d",
					optionText: "A design pattern for organizing code into modules",
				},
			],
		},
		{
			id: 2,
			type: "multiple-choice",
			text: "What does the acronym API stand for?",
			options: [
				{ id: "a", optionText: "Application Programming Interface" },
				{ id: "b", optionText: "Automated Programming Interface" },
				{ id: "c", optionText: "Application Protocol Interface" },
				{ id: "d", optionText: "Advanced Programming Interface" },
			],
		},
		{
			id: 3,
			type: "multiple-choice",
			text: "Which data structure would be most efficient for implementing a dictionary?",
			options: [
				{ id: "a", optionText: "Array" },
				{ id: "b", optionText: "Hash Table" },
				{ id: "c", optionText: "Linked List" },
				{ id: "d", optionText: "Stack" },
			],
		},
		{
			id: 4,
			type: "multiple-choice",
			text: "What is the time complexity of binary search on a sorted array?",
			options: [
				{ id: "a", optionText: "O(1)" },
				{ id: "b", optionText: "O(log n)" },
				{ id: "c", optionText: "O(n)" },
				{ id: "d", optionText: "O(n²)" },
			],
		},
		{
			id: 5,
			type: "multiple-choice",
			text: "In React, what hook would you use to run code after a component renders?",
			options: [
				{ id: "a", optionText: "useState" },
				{ id: "b", optionText: "useContext" },
				{ id: "c", optionText: "useEffect" },
				{ id: "d", optionText: "useCallback" },
			],
		},
		{
			id: 6,
			type: "multiple-choice",
			text: "What concept does the 'S' in SOLID principles stand for?",
			options: [
				{ id: "a", optionText: "Stateless Design" },
				{ id: "b", optionText: "Single Responsibility" },
				{ id: "c", optionText: "Simplified Architecture" },
				{ id: "d", optionText: "Scalable Programming" },
			],
		},
		{
			id: 7,
			type: "multiple-choice",
			text: "Which is NOT a principle of REST architecture?",
			options: [
				{ id: "a", optionText: "Stateless" },
				{ id: "b", optionText: "Client-Server" },
				{ id: "c", optionText: "Real-time Updates" },
				{ id: "d", optionText: "Uniform Interface" },
			],
		},
		{
			id: 8,
			type: "multiple-choice",
			text: "What database type is MongoDB classified as?",
			options: [
				{ id: "a", optionText: "Relational Database" },
				{ id: "b", optionText: "NoSQL Document Database" },
				{ id: "c", optionText: "Graph Database" },
				{ id: "d", optionText: "In-memory Database" },
			],
		},
		{
			id: 9,
			type: "multiple-choice",
			text: 'All 2-legged animals are "Zelopes", No brown furred Animals have 2 legs. Which statement is true:',
			options: [
				{ id: "a", optionText: "No Zelopes have brown fur" },
				{ id: "b", optionText: "Some Zelopes may have brown fur" },
				{ id: "c", optionText: "All 2-legged animals have white fur" },
				{ id: "d", optionText: "All Zelopes have brown fur" },
			],
		},
		{
			id: 10,
			type: "multiple-choice",
			text: "Select the correct pattern that should go in the empty space:",
			imageUrl: "/images/assessment/pattern-question.png",
			options: [
				{ id: "a", optionImageUrl: "/images/assessment/pattern-a.png" },
				{ id: "b", optionImageUrl: "/images/assessment/pattern-b.png" },
				{ id: "c", optionImageUrl: "/images/assessment/pattern-c.png" },
				{ id: "d", optionImageUrl: "/images/assessment/pattern-d.png" },
			],
		},
		{
			id: 11,
			type: "multiple-choice",
			text: "What problem does the MVC architecture pattern solve?",
			options: [
				{ id: "a", optionText: "Database performance" },
				{ id: "b", optionText: "Network latency" },
				{ id: "c", optionText: "Separation of concerns" },
				{ id: "d", optionText: "Memory management" },
			],
		},
		{
			id: 12,
			type: "multiple-choice",
			text: "What is the purpose of dependency injection?",
			options: [
				{ id: "a", optionText: "To reduce memory usage" },
				{ id: "b", optionText: "To make code more testable" },
				{ id: "c", optionText: "To improve rendering performance" },
				{ id: "d", optionText: "To simplify deployment" },
			],
		},
		{
			id: 13,
			type: "multiple-choice",
			text: "Which of the following is a valid way to optimize React rendering?",
			options: [
				{ id: "a", optionText: "Always use class components" },
				{ id: "b", optionText: "Add more state variables" },
				{
					id: "c",
					optionText: "Use React.memo for pure functional components",
				},
				{ id: "d", optionText: "Avoid using keys in lists" },
			],
		},
		{
			id: 14,
			type: "multiple-choice",
			text: "Which design pattern is React's context API most similar to?",
			options: [
				{ id: "a", optionText: "Factory Pattern" },
				{ id: "b", optionText: "Observer Pattern" },
				{ id: "c", optionText: "Singleton Pattern" },
				{ id: "d", optionText: "Decorator Pattern" },
			],
		},
		{
			id: 15,
			type: "multiple-choice",
			text: "What is the primary purpose of TypeScript?",
			options: [
				{ id: "a", optionText: "To make JavaScript run faster" },
				{ id: "b", optionText: "To add static type checking to JavaScript" },
				{ id: "c", optionText: "To replace JavaScript entirely" },
				{ id: "d", optionText: "To provide UI components" },
			],
		},
	],
	"2": [
		// Section 2 - Essay Questions
		{
			id: 1,
			type: "essay",
			text: "A well-structured resume is one of the most important tools for job seekers. It helps employers quickly assess a candidate's qualifications and suitability for a role. When creating a resume, what is the primary purpose it should serve in a job application?",
		},
		{
			id: 2,
			type: "essay",
			text: "Describe a situation where you had to solve a complex problem. What was your approach and what was the outcome?",
		},
		{
			id: 3,
			type: "essay",
			text: "Explain how you would approach implementing a new feature in a large codebase. What steps would you take from planning to deployment?",
		},
		{
			id: 4,
			type: "essay",
			text: "Discuss a time when you had to work under pressure to meet a deadline. How did you manage your time and what did you learn from the experience?",
		},
		{
			id: 5,
			type: "essay",
			text: "What do you think are the most important qualities for a software developer to possess in today's work environment, and why?",
		},
	],
};

/**
 * The main assessment page component using state-based navigation instead of URL params
 */
export default function AssessmentPage({ params }: AssessmentPageProps) {
	const router = useRouter();

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
				// Create new randomized mapping
				const section1Questions = [...questionBank["1"]].sort(
					() => Math.random() - 0.5,
				);
				const section2Questions = [...questionBank["2"]].sort(
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
	}, [params]);

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

						if (
							currentSectionId === 1 &&
							mappedQuestion.type === "multiple-choice"
						) {
							setOptions(mappedQuestion.options || []);
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
		setSelectedOptionId(optionId);
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

	// Handle time up event
	// const handleTimeUp = () => {
	// 	// Auto-submit current section and move to next section or completion
	// 	if (currentSectionId === 1) {
	// 		setCurrentSectionId(2);
	// 		setCurrentQuestionNum(1);
	// 	} else {
	// 		completeExam();
	// 	}
	// };

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
