"use client";

import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Option {
	id: number;
	optionText?: string;
	optionImageUrl?: string;
}

interface MultipleChoiceQuestionProps {
	questionNumber: number;
	totalQuestions: number;
	questionText: string;
	questionImageUrl?: string;
	options: Option[];
	onSelectOption: (optionId: number) => void;
	onNextQuestion: () => void;
	selectedOptionId?: number;
}

/**
 * Component to display multiple choice questions
 */
const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
	questionNumber,
	totalQuestions,
	questionText,
	questionImageUrl,
	options,
	onSelectOption,
	onNextQuestion,
	selectedOptionId,
}) => {
	const hasLetterOptions = options.length <= 4;

	// Get letter for option (A, B, C, D)
	const getLetterForOption = (index: number) => {
		return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
	};

	return (
		<div className="p-6 md:p-8">
			{/* Question header */}
			<div className="mb-8">
				<span className="text-gray-600 text-lg">{questionNumber}. </span>
				<span className="text-lg font-medium">{questionText}</span>
			</div>

			{/* Question image if available */}
			{questionImageUrl && (
				<div className="mb-8 flex justify-center">
					<div className="relative h-64 w-full max-w-xl">
						<Image
							src={questionImageUrl}
							alt="Question image"
							fill
							className="object-contain rounded-lg"
						/>
					</div>
				</div>
			)}

			{/* Options with letters (A,B,C,D) */}
			{hasLetterOptions ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{options.map((option, index) => (
						<div
							key={option.id}
							onClick={() => onSelectOption(option.id)}
							className={cn(
								"p-6 rounded-lg border-2 cursor-pointer transition-all flex items-center",
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
								<div className="flex-1 relative h-24">
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
			) : (
				// If more than 4 options, display them in a grid without letters
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					{options.map((option) => (
						<div
							key={option.id}
							onClick={() => onSelectOption(option.id)}
							className={cn(
								"p-4 rounded-lg border-2 cursor-pointer transition-all text-center",
								selectedOptionId === option.id
									? "border-[#4A90B9] bg-blue-50"
									: "border-gray-200 hover:border-gray-300",
							)}
						>
							{option.optionText && <div>{option.optionText}</div>}

							{option.optionImageUrl && (
								<div className="relative h-24 w-full">
									<Image
										src={option.optionImageUrl}
										alt="Option image"
										fill
										className="object-contain"
									/>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{/* Navigation */}
			<div className="flex justify-end mt-8">
				<Button
					onClick={onNextQuestion}
					className="bg-[#4A90B9] hover:bg-[#3A80A9] text-white px-8"
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default MultipleChoiceQuestion;
