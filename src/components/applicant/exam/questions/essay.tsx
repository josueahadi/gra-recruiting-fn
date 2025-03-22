import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoveRight } from "lucide-react";

interface EssayQuestionProps {
	questionNumber: number;
	totalQuestions: number;
	questionText: string;
	questionImageUrl?: string;
	answer: string;
	onAnswerChange: (answer: string) => void;
	onSubmit: () => void;
	sectionTitle?: string;
	buttonText?: string;
	placeholder?: string;
}

/**
 * Component for rendering essay questions with text input
 */
const EssayQuestion: React.FC<EssayQuestionProps> = ({
	questionNumber,
	totalQuestions,
	questionText,
	questionImageUrl,
	answer,
	onAnswerChange,
	onSubmit,
	sectionTitle = "Section Two - Short Essay",
	buttonText,
	placeholder = "Type your answer here...",
}) => {
	// Set button text based on whether this is the last question
	const defaultButtonText =
		questionNumber === totalQuestions ? "Submit" : "Next Question";

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

			{/* Answer textarea */}
			<div className="mb-8 flex-grow">
				<p className="text-gray-500 mb-2">Enter Your Answer Here</p>
				<Textarea
					value={answer}
					onChange={(e) => onAnswerChange(e.target.value)}
					placeholder={placeholder}
					className="min-h-[200px] h-full border-gray-300 focus:border-blue-400 p-4 resize-none"
				/>
			</div>

			{/* Navigation */}
			<div className="flex justify-end mt-auto">
				<Button
					onClick={onSubmit}
					className="bg-primary-base hover:bg-primary-dark flex items-center"
					disabled={!answer.trim()}
				>
					{buttonText || defaultButtonText}
					<MoveRight className="w-5 h-5 ml-2" />
				</Button>
			</div>
		</div>
	);
};

export default EssayQuestion;
