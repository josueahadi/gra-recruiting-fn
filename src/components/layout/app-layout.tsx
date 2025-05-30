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

const AppLayoutInner: React.FC<AppLayoutProps> = ({
	children,
	userType,
	userName = "John Doe",
	avatarSrc,
}) => {
	const pathname = usePathname();
	const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useLayout();

	const shouldShowProfileNav =
		userType === "applicant" &&
		(pathname === "/applicant" ||
			pathname === "/applicant/skills" ||
			pathname === "/applicant/education" ||
			pathname === "/applicant/documents");

	const pageTitle = getPageTitle(pathname, userType);

	return (
		<div className="flex min-h-screen bg-[#E0F5FF]">
			<BackgroundPattern />

			<AppSidebar
				userType={userType}
				isMobileMenuOpen={isMobileMenuOpen}
				onMobileMenuClose={closeMobileMenu}
			/>

			<div className="flex-1 flex flex-col pb-32 md:ml-60 relative z-10">
				<AppHeader
					title={pageTitle}
					userType={userType}
					userName={userName}
					avatarSrc={avatarSrc}
					onMenuToggle={toggleMobileMenu}
				/>

				<main className="flex-1 p-4 md:p-12">
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

const AppLayout: React.FC<AppLayoutProps> = (props) => {
	return (
		<LayoutProvider>
			<AppLayoutInner {...props} />
		</LayoutProvider>
	);
};

export default AppLayout;
