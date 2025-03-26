"use client";

import AppHeader from "@/components/layout/app-header";
import AssessmentSidebar from "./assessment-sidebar";
import BackgroundPattern from "@/components/layout/background-pattern";
import { LayoutProvider, useLayout } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type React from "react";
import { useState, useEffect } from "react";

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
