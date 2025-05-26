"use client";

import { Edit2 } from "@/components/icons/edit-2";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";

interface SectionLayoutProps {
	title: string;
	children: React.ReactNode;
	topSection?: React.ReactNode;
	className?: string;
	contentClassName?: string;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
	title,
	children,
	topSection,
	className,
	contentClassName,
}) => {
	return (
		<div
			className={cn(
				"bg-white px-2 py-6 md:px-10 md:py-6 rounded-lg shadow-md",
				className,
			)}
		>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-primary-base">{title}</h1>
			</div>

			{topSection && <div className="mb-10 px-4">{topSection}</div>}
			<Separator className="my-8" />

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
						"text-xl text-primary-shades-500 font-semibold",
						titleClassName,
					)}
				>
					{title}
				</h2>
				{showEditButton && (
					<button
						type="button"
						className="text-primary-shades-500 hover:text-primary-shades-600"
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
