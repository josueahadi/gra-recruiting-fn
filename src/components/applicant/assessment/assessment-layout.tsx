"use client";

import AppHeader from "@/components/layout/app-header";
import BackgroundPattern from "@/components/layout/background-pattern";
import { LayoutProvider, useLayout } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import AssessmentSidebar from "./assessment-sidebar";

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

	const [timeLeft, setTimeLeft] = useState("00:15:00");
	useEffect(() => {
		setTimeLeft("00:15:00");
	}, []);

	const sections = [
		{ id: 1, title: "One", description: "Multiple Choice", questionCount: 15 },
		{ id: 2, title: "Two", description: "Short Essay", questionCount: 5 },
	];

	return (
		<div className="flex min-h-screen bg-[#E0F5FF]">
			<BackgroundPattern />

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

			<div
				className={cn(
					"flex-1 flex flex-col relative z-10",
					showNavigation && "md:ml-80",
				)}
			>
				<AppHeader
					title={pageTitle}
					userType="applicant"
					userName={userName}
					avatarSrc={avatarSrc}
					onMenuToggle={toggleMobileMenu}
					showMobileMenu={showNavigation}
				/>

				<main className="flex-1 p-4 md:p-12">
					<div className="bg-white rounded-lg shadow-sm">{children}</div>
				</main>
			</div>
		</div>
	);
};

const AssessmentLayout: React.FC<AssessmentLayoutProps> = (props) => {
	return (
		<LayoutProvider>
			<AssessmentLayoutInner {...props} />
		</LayoutProvider>
	);
};

export default AssessmentLayout;
