// components/layout/app-sidebar.tsx
"use client";

import { Brand } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSidebarLinks, isLinkActive } from "@/lib/utils";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import type React from "react";
import SidebarLink from "./sidebar-link";

export interface SidebarItemType {
	label: string;
	href: string;
	icon: React.ReactNode;
	activeSection?: string;
}

export interface AppSidebarProps {
	userType: "applicant" | "admin";
	isMobileMenuOpen?: boolean;
	onMobileMenuClose?: () => void;
	customLinks?: SidebarItemType[];
	className?: string;
	mobileClassName?: string;
}

/**
 * Reusable sidebar component that adapts based on user type
 */
export const AppSidebar: React.FC<AppSidebarProps> = ({
	userType,
	isMobileMenuOpen = false,
	onMobileMenuClose,
	customLinks,
	className,
	mobileClassName,
}) => {
	const pathname = usePathname();

	// Use custom links or generate default ones based on user type
	const links = customLinks || getSidebarLinks(userType);

	// Desktop sidebar
	const renderSidebar = (mobile = false) => (
		<aside
			className={cn(
				mobile
					? "fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50"
					: "hidden md:block w-60 bg-white shadow-md fixed h-screen overflow-y-auto",
				mobile ? mobileClassName : className,
			)}
		>
			<div
				className={cn(
					"pt-5 px-5 flex flex-col gap-8 md:gap-20 justify-center items-center",
					mobile ? "px-0" : "",
				)}
			>
				<div
					className={cn(
						"flex items-center justify-between md:justify-center w-full",
						mobile ? "px-6 pb-6 border-b" : "",
					)}
				>
					<Brand />
					{mobile && (
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-700"
							onClick={onMobileMenuClose}
							aria-label="Close menu"
						>
							<X className="h-6 w-6" />
						</Button>
					)}
				</div>
				<nav className="h-full w-full">
					<ul className="md:flex md:flex-col md:gap-4">
						{links.map((link) => (
							<SidebarLink
								key={link.href}
								href={link.href}
								label={link.label}
								icon={link.icon}
								isActive={isLinkActive(pathname, link)}
								onClick={mobile ? onMobileMenuClose : undefined}
								isMobile={mobile}
							/>
						))}
					</ul>
				</nav>
			</div>
		</aside>
	);

	return (
		<>
			{/* Desktop Sidebar */}
			{renderSidebar(false)}

			{/* Mobile Sidebar Overlay */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
					{renderSidebar(true)}
				</div>
			)}
		</>
	);
};

export default AppSidebar;
