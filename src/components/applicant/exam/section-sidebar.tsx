"use client";

import { cn } from "@/lib/utils";
import type React from "react";

interface SectionSidebarProps {
	currentSection: "multiple-choice" | "short-essay";
	currentQuestion: number;
	totalQuestions: number;
	timeLeft: string;
	answeredQuestions: number[];
	onQuestionSelect?: (questionNumber: number) => void;
}

/**
 * Sidebar component for navigating between questions
 */
const SectionSidebar: React.FC<SectionSidebarProps> = ({
	currentSection,
	currentQuestion,
	totalQuestions,
	timeLeft,
	answeredQuestions,
	onQuestionSelect,
}) => {
	// Generate an array of question numbers from 1 to totalQuestions
	const questionNumbers = Array.from(
		{ length: totalQuestions },
		(_, i) => i + 1,
	);

	// Determine the section names based on the current section
	const sectionOneName =
		currentSection === "multiple-choice"
			? "Multiple Choice"
			: "Multiple Choice";
	const sectionTwoName =
		currentSection === "short-essay" ? "Short Essay" : "Short Essay";

	return (
		<div className="bg-white rounded-lg p-6 flex flex-col h-full">
			<h2 className="text-xl font-bold mb-6">Exam Sections</h2>

			{/* Section One */}
			<div
				className={cn(
					"py-3 px-4 mb-3 rounded-md transition-colors",
					currentSection === "multiple-choice"
						? "bg-[#4A90B9] text-white"
						: "bg-gray-100 text-gray-800",
				)}
			>
				<div className="flex items-center">
					<span className="font-medium">Section One:</span>
					<span className="ml-2">{sectionOneName}</span>
				</div>
			</div>

			{/* Section Two */}
			<div
				className={cn(
					"py-3 px-4 mb-6 rounded-md transition-colors",
					currentSection === "short-essay"
						? "bg-[#4A90B9] text-white"
						: "bg-gray-100 text-gray-800",
				)}
			>
				<div className="flex items-center">
					<span className="font-medium">Section Two:</span>
					<span className="ml-2">{sectionTwoName}</span>
				</div>
			</div>

			{/* Timer */}
			<div className="mt-4 mb-8">
				<div className="text-center">
					<p className="text-gray-500 mb-2">Time Left</p>
					<div className="relative">
						<div className="bg-[#4A90B9] rounded-full h-24 w-24 flex items-center justify-center mx-auto">
							<svg
								className="absolute top-0 left-0 h-24 w-24 text-white"
								viewBox="0 0 100 100"
							>
								<title>Timer</title>
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
							<span className="text-white text-2xl font-bold">{timeLeft}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Questions navigation */}
			<div className="mt-auto">
				<p className="text-gray-500 mb-4">Questions</p>
				<div className="grid grid-cols-5 gap-2">
					{questionNumbers.map((num) => (
						<button
							type="button"
							key={num}
							onClick={() => onQuestionSelect && onQuestionSelect(num)}
							className={cn(
								"h-8 w-8 rounded-md text-sm font-medium flex items-center justify-center",
								num === currentQuestion
									? "bg-[#4A90B9] text-white"
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

export default SectionSidebar;
