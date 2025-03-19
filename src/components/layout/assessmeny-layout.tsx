"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

interface AssessmentLayoutProps {
	children: React.ReactNode;
	userName?: string;
}

/**
 * The main layout component for the assessment pages
 */
const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({
	children,
	userName = "John Doe",
}) => {
	return (
		<div className="min-h-screen bg-[#EFF1F9] flex flex-col">
			{/* Header with logo and user info */}
			<header className="w-full px-8 py-4 bg-white rounded-b-3xl shadow-sm">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					{/* Logo */}
					<div className="flex items-center">
						<Image
							src="/brand/growrwanda-logo-horizontal-orientation_black.svg"
							alt="Grow Rwanda Logo"
							width={180}
							height={40}
							priority
						/>
					</div>

					{/* Navigation Links - Hidden on small screens */}
					<div className="hidden md:flex items-center space-x-10">
						<Link
							href="/"
							className="text-gray-800 hover:text-primary-base transition-colors"
						>
							Home
						</Link>
						<Link
							href="/about"
							className="text-gray-800 hover:text-primary-base transition-colors"
						>
							About Us
						</Link>
						<Link
							href="/results"
							className="text-blue-400 hover:text-primary-base transition-colors"
						>
							Results
						</Link>
					</div>

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
							<span className="ml-2 font-medium hidden md:block">
								{userName}
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Main content area */}
			<main className="flex-1 py-8 px-4">
				<div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
					{children}
				</div>
			</main>
		</div>
	);
};

export default AssessmentLayout;
