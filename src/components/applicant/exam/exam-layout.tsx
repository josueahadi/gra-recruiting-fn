import type React from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import Link from "next/link";
import QuestionNavigation from "@/components/applicant/exam/question-navigation";

interface ExamLayoutProps {
	children: ReactNode;
	userName?: string;
	currentSectionId?: number;
	currentQuestionNumber?: number;
	totalQuestions?: number;
	answeredQuestions?: number[];
	timeInMinutes?: number;
	onTimeUp?: () => void;
	onQuestionSelect?: (questionNumber: number) => void;
	showNavigation?: boolean;
}

/**
 * Layout component for all exam pages
 * Manages the outer structure, navigation, and timer
 */
const ExamLayout: React.FC<ExamLayoutProps> = ({
	children,
	userName = "John Doe",
	currentSectionId = 1,
	currentQuestionNumber = 1,
	totalQuestions = 15,
	answeredQuestions = [],
	timeInMinutes = 20,
	onTimeUp,
	onQuestionSelect,
	showNavigation = true,
}) => {
	// Define sections
	const sections = [
		{ id: 1, title: "One", description: "Multiple Choice" },
		{ id: 2, title: "Two", description: "Short Essay" },
	];

	return (
		<div className="min-h-screen bg-mint-50 flex flex-col">
			{/* Header with logo and user info */}
			<header className="w-full px-8 py-4 bg-white shadow-sm mb-6">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					{/* Logo */}
					<Link href="/applicant/dashboard" className="flex items-center">
						<Image
							src="/brand/growrwanda-logo-horizontal-orientation_black.svg"
							alt="Grow Rwanda Logo"
							width={180}
							height={40}
							priority
						/>
					</Link>

					<div className="text-2xl font-semibold text-gray-700">Exam</div>

					{/* User profile and notifications */}
					<div className="flex items-center space-x-6">
						{/* Notification icon */}
						<button type="button" className="relative p-2">
							<Bell className="h-5 w-5 text-gray-600" />
							<span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
								1
							</span>
						</button>

						{/* User avatar */}
						<div className="flex items-center">
							<Avatar className="h-10 w-10">
								<AvatarImage src="/images/avatar.jpg" alt={userName} />
								<AvatarFallback>
									{userName
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</div>
			</header>

			{/* Main content area */}
			<main className="flex-1 py-4 px-4 md:px-8 max-w-7xl mx-auto w-full">
				<div className="flex gap-6 h-full">
					{/* Side navigation - only shown if needed */}
					{showNavigation && (
						<div className="hidden md:block w-72">
							<QuestionNavigation
								sections={sections}
								currentSectionId={currentSectionId}
								currentQuestionNumber={currentQuestionNumber}
								totalQuestions={totalQuestions}
								answeredQuestions={answeredQuestions}
								timeInMinutes={timeInMinutes}
								onTimeUp={onTimeUp}
								onQuestionSelect={onQuestionSelect}
							/>
						</div>
					)}

					{/* Main content */}
					<div className="flex-1 bg-white rounded-xl p-6 shadow-sm">
						{children}
					</div>
				</div>
			</main>
		</div>
	);
};

export default ExamLayout;
