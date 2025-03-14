"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/ui/brand";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
	children: React.ReactNode;
	userType: "applicant" | "admin";
}

interface SidebarLink {
	label: string;
	href: string;
	section: string;
}

const applicantLinks: SidebarLink[] = [
	{ label: "User Profile", href: "/applicant", section: "profile" },
	{
		label: "Skills & Competence",
		href: "/applicant/skills",
		section: "skills",
	},
	{
		label: "Work & Education",
		href: "/applicant/education",
		section: "education",
	},
	{
		label: "Documents & Portfolio",
		href: "/applicant/documents",
		section: "documents",
	},
	{
		label: "Account Settings",
		href: "/applicant/settings",
		section: "settings",
	},
];

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
	const pathname = usePathname();
	const links = userType === "applicant" ? applicantLinks : [];
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="min-h-screen flex flex-col bg-[#f0f1fb]">
			{/* Top Navigation - Fixed position, no sticky behavior */}
			<header className="max-w-screen-2xl mx-auto px-3 lg:px-20 w-full py-4">
				<div className="bg-white shadow-md rounded-50 w-full">
					<div className="flex h-12 md:h-[76px] items-center justify-between px-5 md:px-20 w-full">
						<Brand />

						<div className="hidden lg:flex items-center gap-8">
							<Link
								href="/"
								className="text-base font-medium transition-colors text-gray-900 hover:text-primary-base"
							>
								Home
							</Link>
							<Link
								href="/about"
								className="text-base font-medium transition-colors text-gray-900 hover:text-primary-base"
							>
								About Us
							</Link>
							<Link
								href="/results"
								className="text-base font-medium transition-colors text-gray-900 hover:text-primary-base"
							>
								Results
							</Link>
						</div>

						<div className="flex items-center gap-4">
							<button type="button" className="relative">
								<Bell className="h-5 w-5 text-gray-600" />
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
									1
								</span>
							</button>

							<Avatar className="h-10 w-10 border-2 border-primary-light">
								<AvatarImage src="/images/avatar.jpg" alt="User" />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>

							{/* Mobile menu button */}
							<button
								type="button"
								className="p-2 lg:hidden"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Menu</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main content with sidebar */}
			<div className="flex flex-1 mt-8 px-3 md:px-20 gap-6 max-w-screen-2xl mx-auto w-full pb-10">
				{/* Sidebar - Desktop */}
				<aside className="hidden md:block w-64 bg-gradient-to-b from-primary-base to-primary-dark rounded-xl overflow-hidden min-h-[550px]">
					<nav className="h-full pt-4">
						<ul className="flex flex-col">
							{links.map((link) => (
								<li key={link.section}>
									<Link
										href={link.href}
										className={cn(
											"block px-6 py-4 text-base font-medium transition-colors border-l-4",
											pathname === link.href
												? "bg-white bg-opacity-10 text-white border-white"
												: "text-white border-transparent hover:bg-white hover:bg-opacity-5 hover:border-white hover:border-opacity-50",
										)}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</aside>

				{/* Mobile menu - Slide out when open */}
				{isMobileMenuOpen && (
					<div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
						<div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-primary-base to-primary-dark shadow-lg">
							<div className="flex justify-end p-4">
								<button
									type="button"
									onClick={() => setIsMobileMenuOpen(false)}
									className="text-white hover:text-gray-200"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Close</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<nav>
								<ul className="py-4">
									{links.map((link) => (
										<li key={link.section}>
											<Link
												href={link.href}
												className={cn(
													"block px-6 py-4 text-base font-medium transition-colors border-l-4",
													pathname === link.href
														? "bg-white bg-opacity-10 text-white border-white"
														: "text-white border-transparent hover:bg-white hover:bg-opacity-5 hover:border-white hover:border-opacity-50",
												)}
												onClick={() => setIsMobileMenuOpen(false)}
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						</div>
					</div>
				)}

				{/* Main content */}
				<main className="flex-1">
					<div className="bg-white rounded-xl p-4 md:p-8 shadow-sm w-full">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
