import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";

interface Option {
	id: string;
	text?: string;
	imageUrl?: string;
}

interface MultipleChoiceQuestionProps {
	questionNumber: number;
	totalQuestions: number;
	questionText: string;
	questionImageUrl?: string;
	options: Option[];
	selectedOptionId?: string;
	onSelectOption: (optionId: string) => void;
	onNextQuestion: () => void;
	sectionTitle?: string;
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
	sectionTitle = "Section one - Multiple Choice",
	buttonText = "Next Question",
}) => {
	// Determine if we should use letter options (A, B, C, D)
	const hasLetterOptions = options.length <= 4;

	// Get letter for option (A, B, C, D)
	const getLetterForOption = (index: number) => {
		return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
	};

	return (
		<div className="flex flex-col h-full">
			{/* Section title */}
			<div className="mb-6 border-b pb-2">
				<h2 className="text-lg text-primary-600">{sectionTitle}</h2>
			</div>

			{/* Question number and text */}
			<div className="mb-8">
				<h3 className="text-2xl mb-4">Q: {questionNumber}</h3>
				<p className="text-lg">{questionText}</p>
			</div>

			{/* Question image if provided */}
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

			{/* Options with letters (A, B, C, D) */}
			{hasLetterOptions ? (
				<div className="space-y-4 mb-8">
					{options.map((option, index) => (
						<div
							key={option.id}
							onClick={() => onSelectOption(option.id)}
							className={cn(
								"p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center",
								selectedOptionId === option.id
									? "border-primary-base bg-primary-50"
									: "border-gray-200 hover:border-gray-300",
							)}
						>
							<div
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-semibold",
									selectedOptionId === option.id
										? "bg-primary-base text-white"
										: "bg-gray-100 text-gray-700",
								)}
							>
								{getLetterForOption(index)}
							</div>

							{option.text && <div className="flex-1">{option.text}</div>}

							{option.imageUrl && (
								<div className="flex-1 relative h-24">
									<Image
										src={option.imageUrl}
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
									? "border-primary-base bg-primary-50"
									: "border-gray-200 hover:border-gray-300",
							)}
						>
							{option.text && <div>{option.text}</div>}

							{option.imageUrl && (
								<div className="relative h-24 w-full">
									<Image
										src={option.imageUrl}
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

			{/* Navigation button */}
			<div className="flex justify-end mt-auto">
				<Button
					onClick={onNextQuestion}
					className="bg-primary-base hover:bg-primary-dark flex items-center"
					disabled={!selectedOptionId}
				>
					{buttonText}
					<MoveRight className="w-5 h-5 ml-2" />
				</Button>
			</div>
		</div>
	);
};

export default MultipleChoiceQuestion;
