"use client";

import { ProfileNavigation } from "@/components/applicant/profile/profile-tabs";
import AppHeader from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import BackgroundPattern from "@/components/layout/background-pattern";
import { LayoutProvider, useLayout } from "@/lib/utils";
import { getPageTitle } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type UserType = "applicant" | "admin";

interface AppLayoutProps {
	children: ReactNode;
	userType: UserType;
	userName?: string;
	avatarSrc?: string;
}

/**
 * Inner component that uses the layout context
 */
const AppLayoutInner: React.FC<AppLayoutProps> = ({
	children,
	userType,
	userName = "John Doe",
	avatarSrc = "/images/avatar.jpg",
}) => {
	const pathname = usePathname();
	const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useLayout();

	// Determine if we should show the profile navigation tabs
	const shouldShowProfileNav =
		userType === "applicant" &&
		(pathname === "/applicant" ||
			pathname === "/applicant/skills" ||
			pathname === "/applicant/education" ||
			pathname === "/applicant/documents");

	// Get the page title based on the current path
	const pageTitle = getPageTitle(pathname, userType);

	return (
		<div className="flex min-h-screen bg-[#E0F5FF]">
			{/* Background pattern */}
			<BackgroundPattern />

			{/* Sidebar component */}
			<AppSidebar
				userType={userType}
				isMobileMenuOpen={isMobileMenuOpen}
				onMobileMenuClose={closeMobileMenu}
			/>

			{/* Main Content Container */}
			<div className="flex-1 flex flex-col pb-32 md:ml-60 relative z-10">
				{/* Header component */}
				<AppHeader
					title={pageTitle}
					userType={userType}
					userName={userName}
					avatarSrc={avatarSrc}
					onMenuToggle={toggleMobileMenu}
				/>

				{/* Main Content */}
				<main className="flex-1 p-4 md:p-12">
					{/* Profile Navigation Tabs - Only shown on profile pages */}
					{shouldShowProfileNav && (
						<div className="mb-5">
							<ProfileNavigation />
						</div>
					)}
					<div className="mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
};

/**
 * Main layout component that wraps the app with context providers
 */
const AppLayout: React.FC<AppLayoutProps> = (props) => {
	return (
		<LayoutProvider>
			<AppLayoutInner {...props} />
		</LayoutProvider>
	);
};

export default AppLayout;
