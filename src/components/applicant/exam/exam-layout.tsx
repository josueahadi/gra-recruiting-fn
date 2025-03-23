"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, LogOut, Menu, Timer, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brand } from "@/components/ui/brand";
import Notifications from "@/components/common/notifications";

interface AdaptiveExamLayoutProps {
	children: React.ReactNode;
	userName?: string;
	currentSectionId?: number;
	currentQuestionNumber?: number;
	answeredQuestions?: number[];
	onQuestionSelect?: (questionNumber: number) => void;
	showNavigation?: boolean;
	pageTitle?: string;
}

/**
 * A layout component for exam pages that adapts the app layout structure
 * Reuses the same structural components from AppLayout for consistency
 * Now with mobile sidebar support
 */
const AdaptiveExamLayout: React.FC<AdaptiveExamLayoutProps> = ({
	children,
	userName = "John Doe",
	currentSectionId = 1,
	currentQuestionNumber = 1,
	answeredQuestions = [],
	onQuestionSelect,
	showNavigation = true,
	pageTitle = "Exam",
}) => {
	// State for timer (in a real app, this would be from the server)
	const [timeLeft, setTimeLeft] = useState("00:15:00");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

	const handleLogout = () => {
		console.log("Logging out...");
		// Implement logout logic
	};

	return (
		<div className="flex min-h-screen bg-[#E0F5FF]">
			{/* Background pattern */}
			<div
				className="fixed inset-0 z-0 opacity-100 pointer-events-none"
				style={{
					backgroundImage: "url('/images/growrwanda-pattern-01-vertical.svg')",
					backgroundSize: "contain",
					backgroundRepeat: "repeat",
				}}
			/>

			{/* Sidebar - Desktop */}
			<aside className="hidden md:block w-60 bg-white shadow-md fixed h-screen overflow-y-auto z-10">
				<div className="pt-5 px-5 flex flex-col">
					{/* Logo */}
					<div className="mb-12">
						<Brand />
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
						<div key={section.id} className="mb-6">
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
										onClick={() => onQuestionSelect && onQuestionSelect(num)}
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

			{/* Mobile menu - Slide out when open */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
					<div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg overflow-y-auto">
						<div className="p-4 border-b flex items-center justify-between">
							<Brand />
							<Button
								variant="ghost"
								size="icon"
								className="text-gray-700"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<X className="h-6 w-6" />
							</Button>
						</div>

						{/* Timer for mobile */}
						<div className="px-4 py-6">
							<div className="bg-[#E0F5FF] rounded-lg p-4">
								<div className="text-[#009879] text-2xl font-bold flex items-center justify-center">
									<svg
										className="w-5 h-5 mr-2"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12 8V12L15 15"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
										<circle
											cx="12"
											cy="12"
											r="9"
											stroke="currentColor"
											strokeWidth="2"
										/>
									</svg>
									{timeLeft}
								</div>
							</div>
						</div>

						{/* Sections with question navigation for mobile */}
						<div className="px-4 py-2">
							{sections.map((section) => (
								<div key={section.id} className="mb-6">
									<h2 className="text-base font-medium mb-3">
										Section {section.title} - {section.description}
									</h2>
									<div className="grid grid-cols-5 gap-2 mb-4">
										{Array.from(
											{ length: section.questionCount },
											(_, i) => i + 1,
										).map((num) => (
											<button
												key={`mobile-section${section.id}-${num}`}
												type="button"
												onClick={() => {
													onQuestionSelect && onQuestionSelect(num);
													setIsMobileMenuOpen(false);
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
					</div>
				</div>
			)}

			{/* Main content container */}
			<div
				className={cn(
					"flex-1 flex flex-col relative z-10",
					showNavigation && "md:ml-60",
				)}
			>
				{/* Top header */}
				<header className="py-4 px-4 md:px-12 shadow-sm">
					<div className="mx-auto flex justify-between items-center">
						<div className="flex items-center">
							{/* Mobile menu toggle */}
							<Button
								variant="ghost"
								size="icon"
								className="text-gray-700 md:hidden mr-2"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								<Menu className="h-6 w-6" />
							</Button>
							<h1 className="text-2xl font-semibold text-primary-shades-800">
								{pageTitle}
							</h1>
						</div>

						<div className="flex items-center gap-4">
							{/* Notification bell */}
							<Notifications />

							{/* User dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="p-0 h-auto">
										<Avatar className="h-10 w-10 border-2 border-primary-light cursor-pointer">
											<AvatarImage src="/images/avatar.jpg" alt="User" />
											<AvatarFallback>
												{userName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuItem asChild>
										<Link href="/applicant" className="cursor-pointer">
											<User className="mr-2 h-4 w-4" />
											<span>Account</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleLogout}
										className="cursor-pointer"
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>

				{/* Main content */}
				<main className="flex-1 p-4 md:p-12">
					<div className="bg-white rounded-lg shadow-sm">{children}</div>
				</main>
			</div>
		</div>
	);
};

export default AdaptiveExamLayout;
