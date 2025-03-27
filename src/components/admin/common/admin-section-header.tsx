"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";

interface AdminSectionHeaderProps {
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	icon?: React.ReactNode;
	className?: string;
	actionButtonVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
	actionButtonClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
}

/**
 * Reusable section header component for admin pages
 */
const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({
	title,
	description,
	actionLabel,
	onAction,
	icon,
	className,
	actionButtonVariant = "default",
	actionButtonClassName,
	titleClassName,
	descriptionClassName,
}) => {
	return (
		<div
			className={cn(
				"flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-white rounded-lg",
				className,
			)}
		>
			<div>
				<h1 className={cn("text-2xl font-bold text-gray-800", titleClassName)}>
					{title}
				</h1>
				{description && (
					<p className={cn("mt-1 text-gray-500", descriptionClassName)}>
						{description}
					</p>
				)}
			</div>

			{actionLabel && onAction && (
				<Button
					variant={actionButtonVariant}
					onClick={onAction}
					className={cn("mt-4 md:mt-0", actionButtonClassName)}
				>
					{icon && <span className="mr-2">{icon}</span>}
					{actionLabel}
				</Button>
			)}
		</div>
	);
};

export default AdminSectionHeader;
