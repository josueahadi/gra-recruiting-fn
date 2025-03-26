"use client";

import AppHeader from "@/components/layout/app-header";
import BackgroundPattern from "@/components/layout/background-pattern";
import { Brand } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutProvider, useLayout } from "@/lib/utils";
import { Timer, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface AssessmentSidebarProps {
	currentSectionId?: number;
	currentQuestionNumber?: number;
	answeredQuestions?: number[];
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
}

/**
 * Assessment sidebar component with timer and question navigation
 */
const AssessmentSidebar: React.FC<AssessmentSidebarProps> = ({
	currentSectionId = 1,
	currentQuestionNumber = 1,
	answeredQuestions = [],
	timeLeft,
	onQuestionSelect,
	sections,
	isMobileMenuOpen,
	onMobileMenuClose,
}) => {
	// Desktop sidebar
	const renderSidebar = (mobile = false) => (
		<aside
			className={cn(
				mobile
					? "fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 overflow-y-auto"
					: "hidden md:block w-80 bg-white shadow-md fixed h-screen overflow-y-auto z-10",
			)}
		>
			<div className="pt-5 px-5 flex flex-col items-center">
				{/* Header with logo and close button for mobile */}
				<div
					className={cn(
						"mb-12 w-full",
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

				{/* Timer */}
				<div className="bg-[#E0F5FF] rounded-lg p-6 mb-10">
					<div className="text-[#009879] text-3xl font-bold flex items-center justify-center">
						<Timer className="mr-2" />
						{timeLeft}
					</div>
				</div>

				{/* Sections with question navigation */}
				{sections.map((section) => (
					<div key={section.id} className="mb-6 w-full">
						<h2 className="text-base font-medium mb-3">
							Section {section.title} - {section.description}
						</h2>
						<div className="grid grid-cols-5 gap-2 mb-4">
							{Array.from(
								{ length: section.questionCount },
								(_, i) => i + 1,
							).map((num) => (
								<button
									key={`section${section.id}-${num}`}
									type="button"
									onClick={() => {
										onQuestionSelect?.(num);
										if (mobile) onMobileMenuClose();
									}}
									className={cn(
										"h-8 w-8 rounded-md text-sm font-medium flex items-center justify-center",
										currentSectionId === section.id &&
											num === currentQuestionNumber
											? "bg-[#4A90B9] text-white"
											: answeredQuestions.includes(num) &&
													currentSectionId === section.id
												? "bg-gray-200 text-gray-800"
												: "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100",
									)}
								>
									{num}
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</aside>
	);

	return (
		<>
			{/* Desktop sidebar */}
			{renderSidebar(false)}

			{/* Mobile sidebar overlay */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
					{renderSidebar(true)}
				</div>
			)}
		</>
	);
};

/**
 * Main assessment layout component that wraps with context providers
 */
const AssessmentLayout: React.FC<AssessmentLayoutProps> = (props) => {
	return (
		<LayoutProvider>
			<AssessmentLayoutInner {...props} />
		</LayoutProvider>
	);
};

export default AssessmentLayout;

interface AssessmentLayoutProps {
	children: React.ReactNode;
	userName?: string;
	avatarSrc?: string;
	currentSectionId?: number;
	currentQuestionNumber?: number;
	answeredQuestions?: number[];
	onQuestionSelect?: (questionNumber: number) => void;
	showNavigation?: boolean;
	pageTitle?: string;
}

/**
 * Inner component that uses the layout context
 */
const AssessmentLayoutInner: React.FC<AssessmentLayoutProps> = ({
	children,
	userName = "John Doe",
	avatarSrc = "/images/avatar.jpg",
	currentSectionId = 1,
	currentQuestionNumber = 1,
	answeredQuestions = [],
	onQuestionSelect,
	showNavigation = true,
	pageTitle = "Exam",
}) => {
	const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useLayout();

	// State for timer (in a real app, this would be from the server)
	const [timeLeft, setTimeLeft] = useState("00:15:00");

	// Mock timer countdown (would be replaced with actual countdown logic)
	useEffect(() => {
		// Just for demo - not actually counting down
		setTimeLeft("00:15:00");
	}, []);

	// For section configuration
	const sections = [
		{ id: 1, title: "One", description: "Multiple Choice", questionCount: 15 },
		{ id: 2, title: "Two", description: "Short Essay", questionCount: 5 },
	];

	return (
		<div className="flex min-h-screen bg-[#E0F5FF]">
			{/* Background pattern */}
			<BackgroundPattern />

			{/* Sidebar component - only shown if showNavigation is true */}
			{showNavigation && (
				<AssessmentSidebar
					currentSectionId={currentSectionId}
					currentQuestionNumber={currentQuestionNumber}
					answeredQuestions={answeredQuestions}
					timeLeft={timeLeft}
					onQuestionSelect={onQuestionSelect}
					sections={sections}
					isMobileMenuOpen={isMobileMenuOpen}
					onMobileMenuClose={closeMobileMenu}
				/>
			)}

			{/* Main content container */}
			<div
				className={cn(
					"flex-1 flex flex-col relative z-10",
					showNavigation && "md:ml-80",
				)}
			>
				{/* Top header */}
				<AppHeader
					title={pageTitle}
					userType="applicant"
					userName={userName}
					avatarSrc={avatarSrc}
					onMenuToggle={toggleMobileMenu}
					showMobileMenu={showNavigation}
				/>

				{/* Main content */}
				<main className="flex-1 p-4 md:p-12">
					<div className="bg-white rounded-lg shadow-sm">{children}</div>
				</main>
			</div>
		</div>
	);
};
