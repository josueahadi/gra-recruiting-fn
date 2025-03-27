"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Edit } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";

interface SectionItemProps {
	title: string;
	children: ReactNode;
	showEditButton?: boolean;
	onEdit?: () => void;
	isEditing?: boolean;
	onSave?: () => void;
	className?: string;
	contentClassName?: string;
}

const SectionItem: React.FC<SectionItemProps> = ({
	title,
	children,
	showEditButton = false,
	onEdit,
	isEditing = false,
	onSave,
	className,
	contentClassName,
}) => {
	return (
		<div className={cn("mb-8 last:mb-0", className)}>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-gray-900">{title}</h2>

				{showEditButton && onEdit && (
					<Button
						variant="ghost"
						size="sm"
						onClick={isEditing && onSave ? onSave : onEdit}
						className={cn(
							"text-primary-base hover:text-primary-dark",
							isEditing &&
								"bg-primary-base text-white hover:bg-primary-dark hover:text-white",
						)}
					>
						{isEditing ? (
							<>
								<Check className="h-4 w-4 mr-1" />
								Save
							</>
						) : (
							<>
								<Edit className="h-4 w-4 mr-1" />
								Edit
							</>
						)}
					</Button>
				)}
			</div>

			<div className={cn("px-1", contentClassName)}>{children}</div>

			<div className="mt-6 border-b border-gray-200" />
		</div>
	);
};

export default SectionItem;
