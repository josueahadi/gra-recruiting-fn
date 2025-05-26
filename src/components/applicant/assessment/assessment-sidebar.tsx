"use client";

import { Brand } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Timer, X } from "lucide-react";
import type React from "react";

interface AssessmentSidebarProps {
	currentSectionId?: number;
	currentQuestionNumber?: number;
	answeredQuestions?: Record<string, number[]>;
	timeLeft: string;
	onQuestionSelect?: (questionNumber: number) => void;
	sections: Array<{
		id: number;
		title: string;
		description: string;
		questionCount: number;
	}>;
	isMobileMenuOpen: boolean;
	onMobileMenuClose: () => void;
	className?: string;
	mobileClassName?: string;
}

function isTimeWarning(timeLeft: string) {
	const [h, m, s] = timeLeft.split(":").map(Number);
	return h === 0 && (m < 5 || (m === 5 && s === 0));
}

export const AssessmentSidebar: React.FC<AssessmentSidebarProps> = ({
	currentSectionId = 1,
	currentQuestionNumber = 1,
	answeredQuestions = {},
	timeLeft,
	onQuestionSelect,
	sections,
	isMobileMenuOpen,
	onMobileMenuClose,
	className,
	mobileClassName,
}) => {
	const renderSidebar = (mobile = false) => (
		<aside
			className={cn(
				mobile
					? "fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 overflow-y-auto"
					: "hidden md:block w-80 bg-white shadow-md fixed h-screen overflow-y-auto z-10",
				mobile ? mobileClassName : className,
			)}
		>
			<div className="pt-5 px-5 flex flex-col items-center">
				<div
					className={cn(
						"mb-12 w-full flex items-center justify-center",
						mobile && "flex items-center justify-between border-b pb-4",
					)}
				>
					<Brand />
					{mobile && (
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-700"
							onClick={onMobileMenuClose}
							aria-label="Close menu"
						>
							<X className="h-6 w-6" />
						</Button>
					)}
				</div>

				<div className="bg-[#E0F5FF] rounded-lg p-6 mb-10">
					<div
						className={cn(
							isTimeWarning(timeLeft)
								? "text-red-600 animate-pulse"
								: "text-[#009879]",
							"text-3xl font-bold flex items-center justify-center",
						)}
					>
						<Timer className="mr-2" />
						{timeLeft}
					</div>
				</div>

				{sections.map((section) => {
					const sectionIdStr = section.id.toString();
					const sectionAnsweredQuestions = Array.isArray(
						answeredQuestions?.[sectionIdStr],
					)
						? answeredQuestions[sectionIdStr]
						: [];
					const isSectionComplete =
						sectionAnsweredQuestions.length === section.questionCount;
					const isPreviousSection = section.id < currentSectionId;
					const isNextSection = section.id > currentSectionId;
					const isCurrentSection = section.id === currentSectionId;
					const isSectionDisabled = isNextSection && !isSectionComplete;

					return (
						<div
							key={section.id}
							className={cn("mb-6", isSectionDisabled && "opacity-50")}
						>
							<h2 className="text-base font-medium mb-3">
								Section {section.title} - {section.description}
								{isSectionComplete && (
									<span className="ml-2 text-sm text-green-600">
										(Completed)
									</span>
								)}
							</h2>
							<div className="grid grid-cols-5 gap-2 mb-4">
								{Array.from(
									{ length: section.questionCount },
									(_, i) => i + 1,
								).map((num) => {
									const isAnswered = sectionAnsweredQuestions.includes(num);
									const isCurrentQuestion =
										isCurrentSection && num === currentQuestionNumber;
									const isPreviousSectionQuestion = isPreviousSection;
									const isNextSectionQuestion = isNextSection;

									// Only allow navigation to:
									// - The current question
									// - The next unanswered question (if previous is answered)
									// All previous questions (answered) and future questions are disabled
									const maxAnswered = Math.max(...sectionAnsweredQuestions, 0);
									const isQuestionDisabled =
										isPreviousSectionQuestion ||
										(isNextSectionQuestion && !isSectionComplete) ||
										(isAnswered && !isCurrentQuestion) ||
										(!isAnswered &&
											!isCurrentQuestion &&
											num > maxAnswered + 1);

									return (
										<button
											key={`section${section.id}-${num}`}
											type="button"
											onClick={() => {
												if (!isQuestionDisabled) {
													onQuestionSelect?.(num);
													if (mobile) onMobileMenuClose();
												}
											}}
											className={cn(
												"h-8 w-8 rounded-md text-sm font-medium flex items-center justify-center",
												isCurrentQuestion
													? "bg-[#4A90B9] text-white"
													: isQuestionDisabled
														? "bg-gray-100 text-gray-400 cursor-not-allowed"
														: isAnswered
															? "bg-gray-200 text-gray-800"
															: "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100",
											)}
											disabled={isQuestionDisabled}
										>
											{num}
										</button>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</aside>
	);

	return (
		<>
			{renderSidebar(false)}

			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
					{renderSidebar(true)}
				</div>
			)}
		</>
	);
};

export default AssessmentSidebar;
