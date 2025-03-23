import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EssayQuestionProps {
	questionNumber: number;
	totalQuestions: number;
	questionText: string;
	questionImageUrl?: string;
	answer: string;
	onAnswerChange: (answer: string) => void;
	onSubmit: () => void;
	buttonText?: string;
}

/**
 * Component for rendering essay questions with text input
 * Matches the design in the screenshots
 */
const EssayQuestion: React.FC<EssayQuestionProps> = ({
	questionNumber,
	totalQuestions,
	questionText,
	questionImageUrl,
	answer,
	onAnswerChange,
	onSubmit,
	buttonText,
}) => {
	// Set button text based on whether this is the last question
	const defaultButtonText =
		questionNumber === totalQuestions ? "Submit" : "Next Question";

	return (
		<div className="flex flex-col h-full p-6">
			{/* Section title */}
			<div className="mb-6 border-b pb-2">
				<h2 className="text-lg text-gray-600">Section Two - Short Essay</h2>
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

			{/* Answer textarea */}
			<div className="mb-8 flex-grow">
				<Textarea
					value={answer}
					onChange={(e) => onAnswerChange(e.target.value)}
					placeholder="Type your answer here..."
					className="min-h-[200px] h-full border-gray-300 focus:border-blue-400 p-4 resize-none"
				/>
			</div>

			{/* Navigation */}
			<div className="flex justify-end mt-auto">
				<Button
					onClick={onSubmit}
					className="bg-[#4A90B9] hover:bg-[#3A80A9] text-white px-8 py-2 rounded-md flex items-center"
					disabled={!answer.trim()}
				>
					{buttonText || defaultButtonText}
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

export default EssayQuestion;
