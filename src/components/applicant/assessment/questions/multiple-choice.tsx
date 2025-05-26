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

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
	questionNumber,
	questionText,
	questionImageUrl,
	options,
	selectedOptionId,
	onSelectOption,
	onNextQuestion,
	buttonText = "Next Question",
}) => {
	const getLetterForOption = (index: number) => {
		return String.fromCharCode(65 + index); // A, B, C, D, etc.
	};

	return (
		<div className="p-6">
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Question {questionNumber}
				</h2>
				<p
					className="text-gray-700 mb-4"
					dangerouslySetInnerHTML={{ __html: questionText }}
				/>
				{questionImageUrl && (
					<div className="mb-4">
						<Image
							src={questionImageUrl}
							alt="Question"
							width={400}
							height={300}
							className="rounded-lg"
						/>
					</div>
				)}
			</div>

			<div className="space-y-4 mb-8">
				{options.map((option, index) => (
					<button
						key={option.id}
						type="button"
						onClick={() => onSelectOption(option.id)}
						className={cn(
							"w-full p-4 text-left border rounded-lg transition-colors",
							selectedOptionId?.toString() === option.id.toString()
								? "border-primary-base bg-primary-shades-50"
								: "border-gray-200 hover:border-primary-base hover:bg-gray-50",
						)}
					>
						<div className="flex items-start gap-4">
							<div
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
									selectedOptionId?.toString() === option.id.toString()
										? "bg-primary-base text-white"
										: "bg-gray-100 text-gray-600",
								)}
							>
								{getLetterForOption(index)}
							</div>
							<div className="flex-1">
								{option.optionText && (
									<p
										className="text-gray-700"
										dangerouslySetInnerHTML={{ __html: option.optionText }}
									/>
								)}
								{option.optionImageUrl && (
									<div className="mt-2">
										<Image
											src={option.optionImageUrl}
											alt={`Option ${getLetterForOption(index)}`}
											width={200}
											height={150}
											className="rounded-lg"
										/>
									</div>
								)}
							</div>
						</div>
					</button>
				))}
			</div>

			<div className="flex justify-end">
				<Button
					onClick={onNextQuestion}
					disabled={!selectedOptionId}
					className="bg-primary-base hover:bg-primary-base text-white px-8 py-2 rounded-lg"
				>
					{buttonText}
				</Button>
			</div>
		</div>
	);
};

export default MultipleChoiceQuestion;
