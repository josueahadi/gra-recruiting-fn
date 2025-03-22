import type React from "react";
import Timer from "@/components/applicant/exam/timer";
import { cn } from "@/lib/utils";

interface QuestionNavigationProps {
	sections: {
		id: number;
		title: string;
		description: string;
	}[];
	currentSectionId: number;
	currentQuestionNumber: number;
	totalQuestions: number;
	answeredQuestions: number[];
	timeInMinutes: number;
	onTimeUp?: () => void;
	onQuestionSelect?: (questionNumber: number) => void;
}

/**
 * Navigation sidebar for exam questions
 * Shows timer, question progress, and section information
 */
const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
	sections,
	currentSectionId,
	currentQuestionNumber,
	totalQuestions,
	answeredQuestions,
	timeInMinutes,
	onTimeUp,
	onQuestionSelect,
}) => {
	// Generate array of question numbers
	const questionNumbers = Array.from(
		{ length: totalQuestions },
		(_, i) => i + 1,
	);

	// Find current section
	const currentSection =
		sections.find((section) => section.id === currentSectionId) || sections[0];

	return (
		<div className="bg-mint-50 rounded-xl p-4 flex flex-col h-full max-w-xs">
			{/* Timer */}
			<Timer
				initialTimeInMinutes={timeInMinutes}
				onTimeUp={onTimeUp}
				className="mb-8"
			/>

			{/* Sections */}
			<div className="mb-6">
				{sections.map((section) => (
					<div
						key={section.id}
						className={cn(
							"py-3 px-4 mb-2 rounded-md transition-all",
							section.id === currentSectionId
								? "bg-primary-base text-white"
								: "bg-white text-gray-700",
						)}
					>
						<h3 className="flex items-center text-sm">
							<span className="font-medium">Section {section.title}:</span>
							<span className="ml-2">{section.description}</span>
						</h3>
					</div>
				))}
			</div>

			{/* Question navigation grid */}
			<div className="mt-auto">
				<h3 className="text-gray-600 mb-2">Questions</h3>
				<div className="grid grid-cols-5 gap-2">
					{questionNumbers.map((num) => (
						<button
							type="button"
							key={num}
							onClick={() => onQuestionSelect && onQuestionSelect(num)}
							className={cn(
								"h-8 w-8 rounded-md text-sm font-medium flex items-center justify-center",
								num === currentQuestionNumber
									? "bg-primary-base text-white"
									: answeredQuestions.includes(num)
										? "bg-gray-200 text-gray-800"
										: "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100",
							)}
						>
							{num}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default QuestionNavigation;
