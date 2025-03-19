"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type ProfileTab = {
	label: string;
	href: string;
};

interface ProfileNavigationProps {
	className?: string;
}

export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
	className,
}) => {
	const pathname = usePathname();

	const tabs: ProfileTab[] = [
		{
			label: "User Profile",
			href: "/applicant",
		},
		{
			label: "Skills & Competence",
			href: "/applicant/skills",
		},
		{
			label: "Work & Education",
			href: "/applicant/education",
		},
		{
			label: "Documents",
			href: "/applicant/documents",
		},
	];

	// Function to determine if a tab is active based on the current path
	const isTabActive = (href: string): boolean => {
		// Exact match for root applicant route
		if (href === "/applicant" && pathname === "/applicant") return true;

		// For other routes check if the pathname includes the href
		if (href !== "/applicant" && pathname.includes(href)) return true;

		return false;
	};

	return (
		<div className={cn("w-full px-1 py-2", className)}>
			<div className="grid grid-cols-4 overflow-hidden rounded-md shadow-sm gap-1 ">
				{tabs.map((tab) => (
					<Link
						key={tab.href}
						href={tab.href}
						className={cn(
							"text-center py-4 px-4 transition-colors font-medium",
							isTabActive(tab.href)
								? "bg-primary-base text-white"
								: "bg-white text-gray-700 hover:bg-gray-50",
						)}
					>
						{tab.label}
					</Link>
				))}
			</div>
		</div>
	);
};
