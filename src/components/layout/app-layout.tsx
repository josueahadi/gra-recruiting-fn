"use client";

import { ProfileNavigation } from "@/components/applicant/profile-tabs";
import { Notifications } from "@/components/common/notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brand } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
	BarChart,
	CircleUserRound,
	FileText,
	HelpCircle,
	LayoutDashboard,
	LogOut,
	Menu,
	User,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { type ReactNode, useEffect, useState } from "react";

export type UserType = "applicant" | "admin";

interface SidebarLink {
	label: string;
	href: string;
	icon: React.ReactNode;
	activeSection?: string;
}

interface AppLayoutProps {
	children: ReactNode;
	userType: UserType;
}

const BackgroundPattern = () => {
	return (
		<div
			className="fixed inset-0 z-0 opacity-100 pointer-events-none"
			style={{
				backgroundImage: "url('/images/growpattern-01-vertical.svg')",
				backgroundSize: "contain",
				backgroundRepeat: "repeat",
			}}
		/>
	);
};

const AppLayout: React.FC<AppLayoutProps> = ({ children, userType }) => {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Determine navigation links based on user type
	const navigationLinks = getSidebarLinks(userType);

	// Determine if we should show the profile navigation tabs
	const shouldShowProfileNav =
		userType === "applicant" &&
		(pathname === "/applicant" ||
			pathname === "/applicant/skills" ||
			pathname === "/applicant/education" ||
			pathname === "/applicant/documents");

	const handleLogout = () => {
		console.log("Logging out...");
		// Implement logout logic here
	};

	return (
		<div className="flex min-h-screen bg-[#E0F5FF]">
			<BackgroundPattern />
			{/* Sidebar - Desktop */}
			<aside className="hidden md:block w-60 bg-white shadow-md fixed h-screen overflow-y-auto">
				<div className="pt-5 px-5 flex flex-col gap-20 justify-center items-center">
					<div className="">
						<Brand />
					</div>
					<nav className="h-full w-full">
						<ul className="flex flex-col gap-4">
							{navigationLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className={cn(
											"flex items-center px-10 py-3 text-base transition-colors font-semibold rounded-lg",
											isLinkActive(pathname, link)
												? "bg-gradient-to-tr from-primary-dark to-primary-base  bg-opacity-10 text-white"
												: "text-primary-dark border-transparent hover:bg-gray-100 hover:border-primary-light",
										)}
									>
										{link.icon}
										<span className="ml-2">{link.label}</span>
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</aside>

			{/* Mobile menu - Slide out when open */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
					<div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
						<div className="p-6 border-b">
							<div className="flex items-center justify-between">
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
						</div>
						<nav>
							<ul className="py-4">
								{navigationLinks.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className={cn(
												"flex items-center px-6 py-4 text-base font-medium transition-colors border-l-4",
												isLinkActive(pathname, link)
													? "bg-primary-base bg-opacity-10 text-primary-base border-primary-base"
													: "text-gray-700 border-transparent hover:bg-gray-100 hover:border-primary-light",
											)}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											{link.icon}
											<span className="ml-2">{link.label}</span>
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</div>
			)}

			{/* Main Content Container */}
			<div className="flex-1 flex flex-col pb-32 md:ml-60 relative z-10">
				{/* Top Header */}
				<header className="pt-5 px-4 md:px-12">
					<div className=" mx-auto flex justify-between items-center">
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="icon"
								className="text-gray-700 md:hidden mr-2"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								<Menu className="h-6 w-6" />
							</Button>
							<h1 className="text-2xl font-semibold text-primary-shades-800">
								{getPageTitle(pathname, userType)}
							</h1>
						</div>

						<div className="flex items-center gap-4">
							<Notifications />

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="p-0 h-auto">
										<Avatar className="h-10 w-10 border-2 border-primary-light cursor-pointer">
											<AvatarImage src="/images/avatar.jpg" alt="User" />
											<AvatarFallback>
												{userType === "admin" ? "AD" : "JD"}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuItem asChild>
										<Link
											href={
												userType === "admin" ? "/admin/profile" : "/applicant"
											}
											className="cursor-pointer"
										>
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

				{/* Main Content */}
				<main className="flex-1 p-4 md:p-12">
					{/* Profile Navigation Tabs - Only shown on profile pages */}
					{shouldShowProfileNav && (
						<div className=" mb-5">
							<ProfileNavigation />
						</div>
					)}
					<div className="mx-auto ">{children}</div>
				</main>
			</div>
		</div>
	);
};

// Helper function to determine if a link is active
function isLinkActive(pathname: string, link: SidebarLink): boolean {
	// Exact match for paths
	if (pathname === link.href) return true;

	// For dashboard links, don't match with other sections
	if (link.href.includes("dashboard") && pathname !== link.href) return false;

	// For profile links, check the active section
	if (link.activeSection && pathname.includes(link.activeSection)) {
		// Don't mark profile as active when viewing dashboard
		if (pathname.includes("dashboard")) return false;

		return true;
	}

	return false;
}

// Get page title from pathname
function getPageTitle(pathname: string, userType: UserType): string {
	if (userType === "admin") {
		if (pathname.includes("/dashboard")) return "Dashboard";
		if (pathname.includes("/applicants")) return "Applicants";
		if (pathname.includes("/questions")) return "Questions";
		if (pathname.includes("/results")) return "Results";
		return "Dashboard";
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		if (pathname.includes("/dashboard")) return "Dashboard";
		if (pathname.includes("/exam")) return "Exam";
		if (pathname === "/applicant") return "Profile";
		if (pathname.includes("/skills")) return "Skills & Competence";
		if (pathname.includes("/education")) return "Work & Education";
		if (pathname.includes("/documents")) return "Documents & Portfolio";
		return (
			pathname.split("/").pop()?.charAt(0).toUpperCase() +
				pathname.split("/").pop()?.slice(1) || "Dashboard"
		);
	}
}

// Helper function to get sidebar links based on user type
function getSidebarLinks(userType: UserType): SidebarLink[] {
	const dashboardIcon = <LayoutDashboard className="h-5 w-5" />;
	const profileIcon = <CircleUserRound className="h-5 w-5" />;
	const examIcon = <FileText className="h-5 w-5" />;
	const applicantsIcon = <Users className="h-5 w-5" />;
	const questionsIcon = <HelpCircle className="h-5 w-5" />;
	const resultsIcon = <BarChart className="h-5 w-5" />;
	const logoutIcon = <LogOut className="h-5 w-5" />;

	if (userType === "applicant") {
		return [
			{ label: "Dashboard", href: "/applicant/dashboard", icon: dashboardIcon },
			{
				label: "Profile",
				href: "/applicant",
				icon: profileIcon,
				activeSection: "/applicant",
			},
			{ label: "Exam", href: "/applicant/exam", icon: examIcon },
			{ label: "Logout", href: "/logout", icon: logoutIcon },
		];
	}
	return [
		{ label: "Dashboard", href: "/admin/dashboard", icon: dashboardIcon },
		{ label: "Applicants", href: "/admin/applicants", icon: applicantsIcon },
		{ label: "Questions", href: "/admin/questions", icon: questionsIcon },
		{ label: "Results", href: "/admin/results", icon: resultsIcon },
		{ label: "Logout", href: "/logout", icon: logoutIcon },
	];
}

export default AppLayout;
