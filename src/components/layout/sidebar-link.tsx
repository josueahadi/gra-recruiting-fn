"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import type React from "react";

export interface SidebarLinkProps {
	href: string;
	label: string;
	icon: React.ReactNode;
	isActive: boolean;
	onClick?: () => void;
	className?: string;
	isMobile?: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
	href,
	label,
	icon,
	isActive,
	onClick,
	className,
	isMobile,
}) => {
	return (
		<li>
			{!isMobile ? (
				<Link
					href={href}
					className={cn(
						"flex items-center px-10 py-3 text-base transition-colors font-semibold rounded-lg",
						isActive
							? "bg-gradient-to-tr from-primary-dark to-primary-base text-white"
							: "text-primary-dark border-transparent hover:bg-gray-100 hover:border-primary-light",
						className,
					)}
					onClick={onClick}
				>
					{icon}
					<span className="ml-2">{label}</span>
				</Link>
			) : (
				<Link
					href={href}
					className={cn(
						"flex items-center px-6 py-4 text-base font-medium transition-colors border-l-4",
						isActive
							? "bg-primary-base bg-opacity-10 text-primary-base border-primary-base"
							: "text-gray-700 border-transparent hover:bg-gray-100 hover:border-primary-light",
						className,
					)}
					onClick={onClick}
				>
					{icon}
					<span className="ml-2">{label}</span>
				</Link>
			)}
		</li>
	);
};

export default SidebarLink;
