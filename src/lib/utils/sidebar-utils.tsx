import type { SidebarItemType } from "@/components/layout//app-sidebar";
import {
	BarChart,
	CircleUserRound,
	FileText,
	HelpCircle,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";

export function getSidebarLinks(
	userType: "applicant" | "admin",
): SidebarItemType[] {
	console.log(`[sidebar-utils] Getting sidebar links for userType: ${userType}`);
	
	const dashboardIcon = <LayoutDashboard className="h-5 w-5" />;
	const profileIcon = <CircleUserRound className="h-5 w-5" />;
	const examIcon = <FileText className="h-5 w-5" />;
	const applicantsIcon = <Users className="h-5 w-5" />;
	const questionsIcon = <HelpCircle className="h-5 w-5" />;
	const resultsIcon = <BarChart className="h-5 w-5" />;
	const settingsIcon = <Settings className="h-5 w-5" />;

	let links: SidebarItemType[];
	
	if (userType === "applicant") {
		links = [
			{ label: "Dashboard", href: "/applicant/dashboard", icon: dashboardIcon },
			{
				label: "Profile",
				href: "/applicant",
				icon: profileIcon,
				activeSection: "/applicant",
			},
			{ label: "Exam", href: "/applicant/exam", icon: examIcon },
			{ label: "Settings", href: "/applicant/settings", icon: settingsIcon },
		];
	} else {
		links = [
			{ label: "Dashboard", href: "/admin/dashboard", icon: dashboardIcon },
			{ label: "Applicants", href: "/admin/applicants", icon: applicantsIcon },
			{ label: "Questions", href: "/admin/questions", icon: questionsIcon },
			{ label: "Results", href: "/admin/results", icon: resultsIcon },
			{ label: "Settings", href: "/admin/settings", icon: settingsIcon },
		];
	}
	
	console.log(`[sidebar-utils] Returning links for ${userType}:`, { 
		linkCount: links.length,
		firstLink: links[0]?.href
	});
	
	return links;
}

export function isLinkActive(pathname: string, link: SidebarItemType): boolean {
	if (pathname === link.href) return true;

	if (link.href.includes("dashboard") && pathname !== link.href) return false;

	if (link.href.includes("/exam") && pathname.includes("/exam")) return true;

	if (link.activeSection && pathname.includes(link.activeSection)) {
		if (pathname.includes("dashboard") || 
		    pathname.includes("exam") || 
		    pathname.includes("settings"))
			return false;

		return true;
	}

	return false;
}
