"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type ProfileTab = {
	label: string;
	href: string;
	shortLabel?: string;
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
			shortLabel: "Profile",
			href: "/applicant",
		},
		{
			label: "Skills & Competence",
			shortLabel: "Skills",
			href: "/applicant/skills",
		},
		{
			label: "Work & Education",
			shortLabel: "Work/Edu",
			href: "/applicant/education",
		},
		{
			label: "Documents",
			shortLabel: "Docs",
			href: "/applicant/documents",
		},
	];

	const isTabActive = (href: string): boolean => {
		if (href === "/applicant" && pathname === "/applicant") return true;

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
							"text-xs md:text-base text-center py-4 px-4 transition-colors font-semibold",
							isTabActive(tab.href)
								? "bg-gradient-to-tr from-primary-dark to-primary-base text-white"
								: "bg-white text-primary-shades-800 hover:bg-gray-50",
						)}
					>
						<span className="hidden sm:block">{tab.label}</span>
						<span className="block sm:hidden">
							{tab.shortLabel || tab.label}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
};
