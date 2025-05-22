"use client";

import ExamCompletion from "@/components/applicant/assessment/exam-completion";
import AssessmentUnavailable from "@/components/applicant/assessment/assessment-unavailable";
import EssayQuestion from "@/components/applicant/assessment/questions/essay";
import MultipleChoiceQuestion from "@/components/applicant/assessment/questions/multiple-choice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import AssessmentLayout from "./assessment-layout";
import { useExam } from "@/hooks/use-exam";
import {
	type Question,
	type MultipleChoiceQuestion as MCQuestion,
	type Choice,
	EXAM_COMPLETION_KEY,
	EXAM_SECTION_ANSWERS_KEY,
	QUESTION_MAPPING_KEY,
} from "@/types";
import type { ExamResDto, QuestionResDto } from "@/types/questions";
import { questionsService } from "@/services/questions";
import ExitExamDialog from "./exit-exam-dialog";
import { showToast } from "@/services/toast";
import AppLayoutWrapper from "@/components/layout/app-layout-wrapper";

interface MappedQuestion extends QuestionResDto {
	displayId: number;
	originalId: number;
	text?: string;
	choices?: Array<{
		id: number;
		text: string;
		imageUrl?: string | null;
		isCorrect?: boolean;
	}>;
}

interface AssessmentPageProps {
	params?: {
		sectionId?: string;
	};
}

const REQUIRED_QUESTIONS = {
	section1: 30, // Multiple choice questions
	section2: 5, // Essay questions
};

export default function AssessmentPage({ params }: AssessmentPageProps) {
	const router = useRouter();
	const { examData, isLoading: isExamLoading } = useExam();
	const [isLoading, setIsLoading] = useState(true);
	const [isAssessmentAvailable, setIsAssessmentAvailable] = useState(true);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [examCompleted, setExamCompleted] = useState(false);
	const [currentSectionId, setCurrentSectionId] = useState(1);
	const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
	const [answeredQuestions, setAnsweredQuestions] = useState<
		Record<string, number[]>
	>({});
	const [showExitDialog, setShowExitDialog] = useState(false);

	const [questionMapping, setQuestionMapping] = useState<{
		[key: string]: MappedQuestion[];
	}>({});

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

	const sectionType =
		currentSectionId === 1 ? "multiple-choice" : "short-essay";
	const totalQuestions =
		questionMapping[currentSectionId.toString()]?.length || 0;

	const validateQuestions = useCallback(async (data: ExamResDto) => {
		const section1Questions = data.section1?.questions || [];
		const section2Questions = data.section2?.questions || [];

		if (section1Questions.length !== REQUIRED_QUESTIONS.section1) {
			setIsAssessmentAvailable(false);
			setValidationError(
				`Section 1 requires ${REQUIRED_QUESTIONS.section1} questions, but only ${section1Questions.length} are available.`,
			);

			// Notify admin about the issue
			try {
				await questionsService.notifyAdmin({
					message: `An applicant was unable to access the exam because Section 1 has insufficient questions (${section1Questions.length}/${REQUIRED_QUESTIONS.section1}).`,
					type: "INSUFFICIENT_QUESTIONS",
					section: "section1",
					required: REQUIRED_QUESTIONS.section1,
					available: section1Questions.length,
				});
			} catch (error) {
				console.error("Failed to notify admin:", error);
			}
			return false;
		}

		if (section2Questions.length !== REQUIRED_QUESTIONS.section2) {
			setIsAssessmentAvailable(false);
			setValidationError(
				`Section 2 requires ${REQUIRED_QUESTIONS.section2} questions, but only ${section2Questions.length} are available.`,
			);

			// Notify admin about the issue
			try {
				await questionsService.notifyAdmin({
					message: `An applicant was unable to access the exam because Section 2 has insufficient questions (${section2Questions.length}/${REQUIRED_QUESTIONS.section2}).`,
					type: "INSUFFICIENT_QUESTIONS",
					section: "section2",
					required: REQUIRED_QUESTIONS.section2,
					available: section2Questions.length,
				});
			} catch (error) {
				console.error("Failed to notify admin:", error);
			}
			return false;
		}

		setIsAssessmentAvailable(true);
		setValidationError(null);
		return true;
	}, []);

	const handleRetry = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await questionsService.getExamQuestions();
			await validateQuestions(data);
		} catch (error) {
			console.error("Failed to fetch exam questions:", error);
			setValidationError(
				"Failed to fetch exam questions. Please try again later.",
			);
		} finally {
			setIsLoading(false);
		}
	}, [validateQuestions]);

	useEffect(() => {
		if (examData) {
			validateQuestions(examData);
		}
	}, [examData, validateQuestions]);

	useEffect(() => {
		setIsLoading(true);

		const fetchQuestionData = async () => {
			try {
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

				const savedExamCompletion = localStorage.getItem(EXAM_COMPLETION_KEY);
				if (savedExamCompletion === "true") {
					setExamCompleted(true);
					setIsLoading(false);
					return;
				}

				await new Promise((resolve) => setTimeout(resolve, 300));

				console.log("Question Mapping:", questionMapping);
				console.log("Current Section ID:", currentSectionId);
				console.log("Current Question Number:", currentQuestionNum);

				if (Object.keys(questionMapping).length > 0) {
					const sectionQuestions = questionMapping[currentSectionId.toString()];
					console.log("Section Questions:", sectionQuestions);

					const mappedQuestion = sectionQuestions?.find(
						(q) => q.displayId === currentQuestionNum,
					);
					console.log("Mapped Question:", mappedQuestion);

					if (mappedQuestion) {
						setQuestionText(
							mappedQuestion.text || mappedQuestion.description || "",
						);
						setQuestionImageUrl(mappedQuestion.imageUrl || undefined);

						if (currentSectionId === 1 && mappedQuestion.choices) {
							const formattedOptions = mappedQuestion.choices.map((opt) => ({
								id: opt.id,
								optionText: opt.text || "",
								optionImageUrl: opt.imageUrl || undefined,
							}));
							console.log("Formatted Options:", formattedOptions);
							setOptions(formattedOptions);
						} else {
							setOptions([]);
						}
					} else {
						console.warn(
							`Question not found for section ${currentSectionId}, question ${currentQuestionNum}`,
						);
						setQuestionText("");
						setQuestionImageUrl(undefined);
						setOptions([]);
					}
				} else {
					console.warn("No question mapping available");
				}

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
					setAnsweredQuestions({ "1": [], "2": [] });
				}

				const savedSelectedOption = localStorage.getItem(
					`s${currentSectionId}_q${currentQuestionNum}_mc`,
				);
				if (savedSelectedOption && currentSectionId === 1) {
					setSelectedOptionId(savedSelectedOption);
				} else if (currentSectionId === 1) {
					setSelectedOptionId("");
				}

				const savedEssayAnswer = localStorage.getItem(
					`s${currentSectionId}_q${currentQuestionNum}_essay`,
				);
				if (savedEssayAnswer && currentSectionId === 2) {
					setEssayAnswer(savedEssayAnswer);
				} else if (currentSectionId === 2) {
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

	useEffect(() => {
		console.log("Exam Data:", examData);
	}, [examData]);

	useEffect(() => {
		console.log("Initializing question mapping...");
		const initializeQuestionMapping = () => {
			const savedMapping = localStorage.getItem(QUESTION_MAPPING_KEY);
			console.log("Saved Mapping:", savedMapping);

			if (savedMapping) {
				try {
					const parsedMapping = JSON.parse(savedMapping);
					console.log("Parsed Saved Mapping:", parsedMapping);
					setQuestionMapping(parsedMapping);
				} catch (error) {
					console.error("Error parsing saved question mapping:", error);
					localStorage.removeItem(QUESTION_MAPPING_KEY);
				}
			} else if (examData) {
				try {
					console.log("Initializing from exam data:", examData);
					// Use the questions as they come from the API
					const section1Questions =
						examData.section1?.questions?.map((q, idx) => ({
							...q,
							displayId: idx + 1,
							originalId: q.id,
							text: q.description || "",
							choices:
								q.options?.map((opt) => ({
									id: opt.id,
									text: opt.optionText || "",
									imageUrl: opt.optionImageUrl || null,
									isCorrect: false, // We don't need to expose this to the frontend
								})) || [],
						})) || [];

					const section2Questions =
						examData.section2?.questions?.map((q, idx) => ({
							...q,
							displayId: idx + 1,
							originalId: q.id,
							text: q.description || "",
						})) || [];

					const newMapping = {
						"1": section1Questions,
						"2": section2Questions,
					};

					console.log("New Question Mapping:", newMapping);
					localStorage.setItem(
						QUESTION_MAPPING_KEY,
						JSON.stringify(newMapping),
					);
					setQuestionMapping(newMapping);
				} catch (error) {
					console.error("Error initializing question mapping:", error);
					setQuestionMapping({ "1": [], "2": [] });
				}
			}
		};

		if (params?.sectionId) {
			const initialSectionId = Number.parseInt(params.sectionId, 10) || 1;
			setCurrentSectionId(initialSectionId);
		}

		initializeQuestionMapping();
	}, [params, examData]);

	// Handle browser navigation and refresh
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
			return "";
		};

		const handlePopState = (e: PopStateEvent) => {
			e.preventDefault();
			setShowExitDialog(true);
			// Push the current state back to prevent navigation
			window.history.pushState(null, "", window.location.href);
		};

		// Add initial state to prevent back navigation
		window.history.pushState(null, "", window.location.href);

		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	const handleSelectOption = (optionId: string | number) => {
		console.log("Selected option:", optionId); // Debug log
		setSelectedOptionId(optionId.toString());
		localStorage.setItem(
			`s${currentSectionId}_q${currentQuestionNum}_mc`,
			optionId.toString(),
		);

		// Update answered questions
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
			setAnsweredQuestions(updatedAnsweredQuestions);
			localStorage.setItem(
				EXAM_SECTION_ANSWERS_KEY,
				JSON.stringify(updatedAnsweredQuestions),
			);
		}
	};

	const handleEssayChange = (text: string) => {
		setEssayAnswer(text);
		localStorage.setItem(
			`s${currentSectionId}_q${currentQuestionNum}_essay`,
			text,
		);
	};

	const completeExam = async () => {
		try {
			// Format answers for submission
			const multipleChoiceAnswers = [];
			const essayAnswers = [];

			// Get all answers from localStorage
			for (let s = 1; s <= 2; s++) {
				const questionCount = s === 1 ? 30 : 5;
				for (let q = 1; q <= questionCount; q++) {
					const mcAnswer = localStorage.getItem(`s${s}_q${q}_mc`);
					const essayAnswer = localStorage.getItem(`s${s}_q${q}_essay`);

					if (mcAnswer) {
						multipleChoiceAnswers.push({
							questionId: questionMapping[s.toString()][q - 1].originalId,
							optionId: Number.parseInt(mcAnswer, 10),
						});
					} else if (essayAnswer) {
						essayAnswers.push({
							questionId: questionMapping[s.toString()][q - 1].originalId,
							answer: essayAnswer,
						});
					}
				}
			}

			// Submit exam for grading
			await questionsService.submitExam({
				multipleChoiceAnswers,
				essayAnswers,
			});

			setExamCompleted(true);
			localStorage.setItem(EXAM_COMPLETION_KEY, "true");
			localStorage.removeItem("assessmentCompleted");
		} catch (error) {
			console.error("Error submitting exam:", error);
			// Show error toast or handle error appropriately
		}
	};

	const handleNextQuestion = () => {
		// Check if current question is answered
		const isAnswered =
			currentSectionId === 1
				? selectedOptionId !== ""
				: essayAnswer.trim() !== "";

		if (!isAnswered) {
			showToast({
				title: "Please answer the current question",
				description: "You must answer the current question before proceeding.",
				variant: "error",
			});
			return;
		}

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

		if (currentQuestionNum < totalQuestions) {
			setCurrentQuestionNum(currentQuestionNum + 1);
		} else if (currentSectionId === 1) {
			setCurrentSectionId(2);
			setCurrentQuestionNum(1);
		} else {
			completeExam();
		}
	};

	const handleQuestionSelect = (questionNum: number) => {
		// Only allow selecting the current question
		if (questionNum !== currentQuestionNum) {
			return;
		}
		setCurrentQuestionNum(questionNum);
	};

	const handleExitExam = () => {
		// Clear all exam-related data
		localStorage.removeItem(EXAM_COMPLETION_KEY);
		localStorage.removeItem(EXAM_SECTION_ANSWERS_KEY);
		localStorage.removeItem(QUESTION_MAPPING_KEY);

		// Clear section-specific data
		for (let s = 1; s <= 2; s++) {
			const questionCount = s === 1 ? 30 : 5;
			for (let q = 1; q <= questionCount; q++) {
				localStorage.removeItem(`s${s}_q${q}_mc`);
				localStorage.removeItem(`s${s}_q${q}_essay`);
			}
		}

		// Redirect to dashboard
		router.push("/applicant/dashboard");
	};

	// Clear all exam-related data to close off the session when exam is completed
	useEffect(() => {
		if (examCompleted) {
			localStorage.removeItem(EXAM_COMPLETION_KEY);
			localStorage.removeItem(EXAM_SECTION_ANSWERS_KEY);
			localStorage.removeItem(QUESTION_MAPPING_KEY);
			for (let s = 1; s <= 2; s++) {
				const questionCount = s === 1 ? 30 : 5;
				for (let q = 1; q <= questionCount; q++) {
					localStorage.removeItem(`s${s}_q${q}_mc`);
					localStorage.removeItem(`s${s}_q${q}_essay`);
				}
			}
		}
	}, [examCompleted]);

	if (isLoading) {
		return (
			<AssessmentLayout showNavigation={true}>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
				</div>
			</AssessmentLayout>
		);
	}

	if (!isAssessmentAvailable) {
		return (
			<AssessmentLayout showNavigation={true}>
				<AssessmentUnavailable
					title="Assessment Unavailable"
					message={
						validationError ||
						"The assessment is currently unavailable. Please try again later."
					}
					buttonText="Back To Dashboard"
					onButtonClick={() => router.push("/applicant/dashboard")}
					onRetry={handleRetry}
				/>
			</AssessmentLayout>
		);
	}

	if (examCompleted) {
		return (
			<AppLayoutWrapper>
				<div className="flex flex-col items-center justify-center min-h-[60vh]">
					<ExamCompletion
						title="Exam Completed"
						message="You have successfully completed the exam. Thank you for your time and effort."
						subtitle="Your results will be available soon"
						buttonText="Back To Dashboard"
						imageUrl="/images/exam-complete.png"
						onButtonClick={() => router.push("/applicant/dashboard")}
					/>
				</div>
			</AppLayoutWrapper>
		);
	}

	return (
		<>
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

			<ExitExamDialog
				isOpen={showExitDialog}
				onClose={() => setShowExitDialog(false)}
				onConfirm={handleExitExam}
			/>
		</>
	);
}
