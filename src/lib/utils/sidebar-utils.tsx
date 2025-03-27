import type { SidebarItemType } from "@/components/layout//app-sidebar";
import {
	BarChart,
	CircleUserRound,
	FileText,
	HelpCircle,
	LayoutDashboard,
	LogOut,
	Users,
} from "lucide-react";

/**
 * Gets sidebar links based on user type
 */
export function getSidebarLinks(
	userType: "applicant" | "admin",
): SidebarItemType[] {
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

/**
 * Determines if a link is active based on the current pathname
 */
export function isLinkActive(pathname: string, link: SidebarItemType): boolean {
	// Exact match for paths
	if (pathname === link.href) return true;

	// For dashboard links, don't match with other sections
	if (link.href.includes("dashboard") && pathname !== link.href) return false;

	// For exam links, match any exam-related path
	if (link.href.includes("/exam") && pathname.includes("/exam")) return true;

	// For profile links, check the active section
	if (link.activeSection && pathname.includes(link.activeSection)) {
		// Don't mark profile as active when viewing dashboard or exam
		if (pathname.includes("dashboard") || pathname.includes("exam"))
			return false;

		return true;
	}

	return false;
}
