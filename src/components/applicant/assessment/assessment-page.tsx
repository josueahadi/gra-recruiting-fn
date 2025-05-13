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

	const [currentSectionId, setCurrentSectionId] = useState(1);
	const [currentQuestionNum, setCurrentQuestionNum] = useState(1);

	const [questionMapping, setQuestionMapping] = useState<{
		[key: string]: Question[];
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
	const [answeredQuestions, setAnsweredQuestions] = useState<{
		[key: string]: number[];
	}>({
		"1": [],
		"2": [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [examCompleted, setExamCompleted] = useState(false);

	const sectionType =
		currentSectionId === 1 ? "multiple-choice" : "short-essay";
	const totalQuestions = currentSectionId === 1 ? 15 : 5;

	useEffect(() => {
		const initializeQuestionMapping = () => {
			const savedMapping = localStorage.getItem(QUESTION_MAPPING_KEY);

			if (savedMapping) {
				setQuestionMapping(JSON.parse(savedMapping));
			} else {
				const questionsBySection = getQuestionsBySection();

				const section1Questions = [...questionsBySection["1"]].sort(
					() => Math.random() - 0.5,
				);
				const section2Questions = [...questionsBySection["2"]].sort(
					() => Math.random() - 0.5,
				);

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

				localStorage.setItem(QUESTION_MAPPING_KEY, JSON.stringify(newMapping));
				setQuestionMapping(newMapping);
			}
		};

		if (params?.sectionId) {
			const initialSectionId = Number.parseInt(params.sectionId, 10) || 1;
			setCurrentSectionId(initialSectionId);
		}

		initializeQuestionMapping();
	}, [params, getQuestionsBySection]);

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

				if (Object.keys(questionMapping).length > 0) {
					const sectionQuestions = questionMapping[currentSectionId.toString()];
					const mappedQuestion = sectionQuestions?.find(
						(q) => q.displayId === currentQuestionNum,
					);

					if (mappedQuestion) {
						setQuestionText(mappedQuestion.text);
						setQuestionImageUrl(mappedQuestion.imageUrl);

						if (mappedQuestion.section === "Multiple Choice") {
							const mcQuestion = mappedQuestion as MCQuestion;
							if (mcQuestion.choices && Array.isArray(mcQuestion.choices)) {
								const formattedOptions = mcQuestion.choices.map(
									(choice: Choice) => ({
										id: choice.id,
										optionText: choice.text,
										optionImageUrl: choice.imageUrl,
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

	const handleSelectOption = (optionId: string | number) => {
		setSelectedOptionId(optionId.toString());
		localStorage.setItem(
			`s${currentSectionId}_q${currentQuestionNum}_mc`,
			optionId.toString(),
		);
	};

	const handleEssayChange = (text: string) => {
		setEssayAnswer(text);
		localStorage.setItem(
			`s${currentSectionId}_q${currentQuestionNum}_essay`,
			text,
		);
	};

	const completeExam = () => {
		setExamCompleted(true);
		localStorage.setItem(EXAM_COMPLETION_KEY, "true");
		localStorage.removeItem("assessmentCompleted");
	};

	const resetExam = () => {
		localStorage.removeItem(EXAM_COMPLETION_KEY);
		localStorage.removeItem(EXAM_SECTION_ANSWERS_KEY);
		localStorage.removeItem(QUESTION_MAPPING_KEY);

		for (let s = 1; s <= 2; s++) {
			const questionCount = s === 1 ? 15 : 5;
			for (let q = 1; q <= questionCount; q++) {
				localStorage.removeItem(`s${s}_q${q}_mc`);
				localStorage.removeItem(`s${s}_q${q}_essay`);
			}
		}
		window.location.href = "/applicant/exam";
	};

	const handleQuestionSelect = (questionNum: number) => {
		setCurrentQuestionNum(questionNum);

		/* Production code:
    const maxSeenQuestion = Math.max(
      currentQuestionNum,
      ...(answeredQuestions[currentSectionId.toString()] || [0]),
    );

    if (questionNum <= maxSeenQuestion + 1) {
      setCurrentQuestionNum(questionNum);
    }
    */
	};

	const handleNextQuestion = () => {
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

	if (isLoading) {
		return (
			<AssessmentLayout showNavigation={true}>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
				</div>
			</AssessmentLayout>
		);
	}

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
