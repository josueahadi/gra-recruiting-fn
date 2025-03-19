"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

interface EssayQuestionProps {
	questionNumber: number;
	totalQuestions: number;
	questionText: string;
	questionImageUrl?: string;
	answer: string;
	onAnswerChange: (answer: string) => void;
	onSubmit: () => void;
}

/**
 * Component to display essay questions
 */
const EssayQuestion: React.FC<EssayQuestionProps> = ({
	questionNumber,
	totalQuestions,
	questionText,
	questionImageUrl,
	answer,
	onAnswerChange,
	onSubmit,
}) => {
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

			{/* Answer textarea */}
			<div className="mb-8">
				<p className="text-gray-500 mb-2">Enter Your Answer Here</p>
				<Textarea
					value={answer}
					onChange={(e) => onAnswerChange(e.target.value)}
					placeholder="Type your answer here..."
					className="min-h-[200px] border-gray-300 focus:border-blue-400 p-4"
				/>
			</div>

			{/* Navigation */}
			<div className="flex justify-end mt-8">
				<Button
					onClick={onSubmit}
					className="bg-[#4A90B9] hover:bg-[#3A80A9] text-white px-8"
				>
					{questionNumber === totalQuestions ? "Submit" : "Next"}
				</Button>
			</div>
		</div>
	);
};

export default EssayQuestion;
