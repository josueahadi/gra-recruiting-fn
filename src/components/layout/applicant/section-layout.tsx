"use client";

import React from "react";
import { Edit2 } from "@/components/icons/edit-2";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SectionLayoutProps {
	title: string;
	children: React.ReactNode;
	topSection?: React.ReactNode;
	className?: string;
	contentClassName?: string;
}

/**
 * A common layout component for dashboard sections
 */
const SectionLayout: React.FC<SectionLayoutProps> = ({
	title,
	children,
	topSection,
	className,
	contentClassName,
}) => {
	return (
		<div className={cn("", className)}>
			{/* Header with title */}
			<div className="mb-6 px-4">
				<h1 className="text-2xl font-bold text-primary-base">{title}</h1>
			</div>

			{/* Optional top section (e.g., user avatar and name) */}
			{topSection && <div className="mb-10 px-4">{topSection}</div>}
			<Separator className="my-8" />

			{/* Main content sections */}
			<div className={cn("", contentClassName)}>
				{React.Children.map(children, (child, index) => {
					if (!React.isValidElement(child)) return child;

					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<React.Fragment key={index}>
							{index > 0 && <Separator className="my-10" />}
							{child}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};

/**
 * A sub-section component for consistent styling within a section
 */
export const SectionItem: React.FC<{
	title: string;
	children: React.ReactNode;
	showEditButton?: boolean;
	onEdit?: () => void;
	className?: string;
	titleClassName?: string;
	contentClassName?: string;
}> = ({
	title,
	children,
	showEditButton = false,
	onEdit,
	className,
	titleClassName,
	contentClassName,
}) => {
	return (
		<div className={cn("mb-10", className)}>
			<div className="flex items-center justify-between mb-6 px-4">
				<h2
					className={cn(
						"text-xl text-primary-base font-semibold",
						titleClassName,
					)}
				>
					{title}
				</h2>
				{showEditButton && (
					<button
						type="button"
						className="text-primary-500 hover:text-primary-600"
						aria-label={`Edit ${title}`}
						onClick={onEdit}
					>
						<Edit2 className="h-5 w-5" />
					</button>
				)}
			</div>
			<div className={cn("px-10", contentClassName)}>{children}</div>
		</div>
	);
};

export default SectionLayout;
