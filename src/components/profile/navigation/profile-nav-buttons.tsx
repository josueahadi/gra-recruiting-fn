import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@/components/icons";

const ProfileNavigationButtons: React.FC = () => {
	const pathname = usePathname();

	const routes = [
		{ path: "/applicant", label: "User Profile", shortLabel: "Profile" },
		{
			path: "/applicant/skills",
			label: "Skills & Competence",
			shortLabel: "Skills",
		},
		{
			path: "/applicant/education",
			label: "Work & Education",
			shortLabel: "Work/Edu",
		},
		{ path: "/applicant/documents", label: "Documents", shortLabel: "Docs" },
	];

	const currentIndex = routes.findIndex(
		(route) =>
			pathname === route.path ||
			(route.path !== "/applicant" && pathname?.startsWith(route.path)),
	);

	const prevRoute = currentIndex > 0 ? routes[currentIndex - 1] : null;
	const nextRoute =
		currentIndex < routes.length - 1 ? routes[currentIndex + 1] : null;

	return (
		<div className="flex justify-between mt-10 md:mt-14 py-4 md:py-6">
			{prevRoute ? (
				<Link
					href={prevRoute.path}
					className="flex items-center text-primary-base border border-primary-base font-semibold px-3 py-2 md:px-6 md:py-3 rounded-lg transition-colors text-sm md:text-base"
				>
					<ArrowLeft className="h-3 w-4 md:h-4 md:w-6 mr-1 md:mr-2" />
					<span className="hidden sm:inline">{prevRoute.label}</span>
					<span className="sm:hidden">{prevRoute.shortLabel}</span>
				</Link>
			) : (
				<div />
			)}

			{nextRoute ? (
				<Link
					href={nextRoute.path}
					className="flex items-center text-white font-semibold bg-primary-base hover:bg-custom-skyBlue transition-colors px-3 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base"
				>
					<span className="hidden sm:inline">{nextRoute.label}</span>
					<span className="sm:hidden">{nextRoute.shortLabel}</span>
					<ArrowRight
						className="h-3 w-4 md:h-4 md:w-6 ml-1 md:ml-2"
						color="#FFFFFF"
					/>
				</Link>
			) : (
				<div />
			)}
		</div>
	);
};

export default ProfileNavigationButtons;
