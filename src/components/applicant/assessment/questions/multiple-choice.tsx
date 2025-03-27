import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";

interface Option {
	id: string | number;
	optionText?: string;
	optionImageUrl?: string;
}

interface MultipleChoiceQuestionProps {
	questionNumber: number;
	totalQuestions: number;
	questionText: string;
	questionImageUrl?: string;
	options: Option[];
	selectedOptionId?: string | number;
	onSelectOption: (optionId: string | number) => void;
	onNextQuestion: () => void;
	buttonText?: string;
}

/**
 * Component for rendering multiple choice questions
 * Supports both text and image-based options
 */
const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
	questionNumber,
	totalQuestions,
	questionText,
	questionImageUrl,
	options,
	selectedOptionId,
	onSelectOption,
	onNextQuestion,
	buttonText = "Next Question",
}) => {
	// Get letter for option (A, B, C, D)
	const getLetterForOption = (index: number) => {
		return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
	};

	return (
		<div className="flex flex-col h-full p-6">
			{/* Section title */}
			<div className="mb-6 border-b pb-2">
				<h2 className="text-lg text-gray-600">Section one - Multiple Choice</h2>
			</div>

			{/* Question number and text */}
			<div className="mb-8">
				<h3 className="text-2xl mb-4">Q: {questionNumber}</h3>
				<div className="p-6 bg-white rounded-lg border">
					<p className="text-lg">{questionText}</p>

					{/* Question image if provided */}
					{questionImageUrl && (
						<div className="mt-4 flex justify-center">
							<div className="relative h-64 w-full max-w-xl">
								<Image
									src={questionImageUrl}
									alt="Question image"
									fill
									className="object-contain"
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Options with letters (A, B, C, D) */}
			<div className="space-y-4 mb-8">
				{options.map((option, index) => (
					<div
						key={option.id}
						onClick={() => onSelectOption(option.id)}
						className={cn(
							"p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center",
							selectedOptionId === option.id
								? "border-[#4A90B9] bg-blue-50"
								: "border-gray-200 hover:border-gray-300",
						)}
					>
						<div
							className={cn(
								"w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-semibold",
								selectedOptionId === option.id
									? "bg-[#4A90B9] text-white"
									: "bg-gray-100 text-gray-700",
							)}
						>
							{getLetterForOption(index)}
						</div>

						{option.optionText && (
							<div className="flex-1">{option.optionText}</div>
						)}

						{option.optionImageUrl && (
							<div className="flex-1 relative h-24 w-24">
								<Image
									src={option.optionImageUrl}
									alt={`Option ${getLetterForOption(index)}`}
									fill
									className="object-contain"
								/>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Navigation button */}
			<div className="flex justify-end mt-auto">
				<Button
					onClick={onNextQuestion}
					className="bg-[#4A90B9] hover:bg-[#3A80A9] text-white px-8 py-2 rounded-md flex items-center"
					disabled={!selectedOptionId}
				>
					{buttonText}
					<svg
						className="ml-2 w-5 h-5"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5 12H19M12 5L19 12L12 19"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</Button>
			</div>
		</div>
	);
};

export default MultipleChoiceQuestion;
