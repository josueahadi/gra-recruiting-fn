"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
	title?: string;
	description?: string;
	titleClassName?: string;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	headerActions?: React.ReactNode;
}

/**
 * Reusable content card component for consistently styled sections
 */
const ContentCard: React.FC<ContentCardProps> = ({
	title,
	description,
	titleClassName,
	children,
	className,
	contentClassName,
	headerActions,
}) => {
	return (
		<div className={cn("bg-white rounded-lg p-6", className)}>
			{(title || headerActions) && (
				<div className="flex justify-between items-center mb-6">
					<div>
						{title && (
							<h2
								className={cn(
									"text-xl font-semibold text-primary-base",
									titleClassName,
								)}
							>
								{title}
							</h2>
						)}
						{description && (
							<p className="text-sm text-gray-500 mt-1">{description}</p>
						)}
					</div>
					{headerActions && (
						<div className="flex items-center space-x-2">{headerActions}</div>
					)}
				</div>
			)}

			<div className={contentClassName}>{children}</div>
		</div>
	);
};

export default ContentCard;
