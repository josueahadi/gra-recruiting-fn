"use client";

import EssayQuestion from "@/components/assessment/essay-qn";
import MultipleChoiceQuestion from "@/components/assessment/multiple-choice-qn";
import SectionSidebar from "@/components/assessment/section-sidebar";
import type React from "react";

interface AssessmentPageProps {
	section: "multiple-choice" | "short-essay";
	currentQuestion: number;
	totalQuestions: number;
	timeLeft: string;
	answeredQuestions: number[];
	questionText: string;
	questionImageUrl?: string;
	options?: Array<{
		id: number;
		optionText?: string;
		optionImageUrl?: string;
	}>;
	essayAnswer?: string;
	selectedOptionId?: number;
	onSelectOption?: (optionId: number) => void;
	onAnswerChange?: (answer: string) => void;
	onNextQuestion: () => void;
	onQuestionSelect?: (questionNumber: number) => void;
}

/**
 * Component that combines the sidebar and question display
 */
const AssessmentPage: React.FC<AssessmentPageProps> = ({
	section,
	currentQuestion,
	totalQuestions,
	timeLeft,
	answeredQuestions,
	questionText,
	questionImageUrl,
	options = [],
	essayAnswer = "",
	selectedOptionId,
	onSelectOption = () => {},
	onAnswerChange = () => {},
	onNextQuestion,
	onQuestionSelect,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 min-h-[600px]">
			{/* Sidebar */}
			<div className="md:col-span-1 p-4">
				<SectionSidebar
					currentSection={section}
					currentQuestion={currentQuestion}
					totalQuestions={totalQuestions}
					timeLeft={timeLeft}
					answeredQuestions={answeredQuestions}
					onQuestionSelect={onQuestionSelect}
				/>
			</div>

			{/* Main question area */}
			<div className="md:col-span-3 lg:col-span-4 border-l">
				{section === "multiple-choice" ? (
					<MultipleChoiceQuestion
						questionNumber={currentQuestion}
						totalQuestions={totalQuestions}
						questionText={questionText}
						questionImageUrl={questionImageUrl}
						options={options}
						selectedOptionId={selectedOptionId}
						onSelectOption={onSelectOption}
						onNextQuestion={onNextQuestion}
					/>
				) : (
					<EssayQuestion
						questionNumber={currentQuestion}
						totalQuestions={totalQuestions}
						questionText={questionText}
						questionImageUrl={questionImageUrl}
						answer={essayAnswer}
						onAnswerChange={onAnswerChange}
						onSubmit={onNextQuestion}
					/>
				)}
			</div>
		</div>
	);
};

export default AssessmentPage;
