"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Trash2, FileEdit } from "lucide-react";
import type React from "react";

export interface ActionButton {
	icon: "view" | "edit" | "delete" | "custom";
	customIcon?: React.ReactNode;
	onClick: () => void;
	className?: string;
	label?: string;
	tooltip?: string;
}

interface TableActionsProps {
	actions: ActionButton[];
	className?: string;
}

/**
 * Reusable component for rendering action buttons in tables
 */
const TableActions: React.FC<TableActionsProps> = ({ actions, className }) => {
	// Map of icons to their components
	const iconMap = {
		view: <Eye className="h-4 w-4" />,
		edit: <FileEdit className="h-4 w-4" />,
		delete: <Trash2 className="h-4 w-4" />,
	};

	// Map of default colors for different action types
	const colorMap = {
		view: "text-blue-500 hover:text-blue-700",
		edit: "text-amber-500 hover:text-amber-700",
		delete: "text-red-500 hover:text-red-700",
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{actions.map((action, index) => (
				<Button
					key={`action-${
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						index
					}`}
					variant="ghost"
					size="icon"
					onClick={action.onClick}
					className={cn(
						action.icon !== "custom" && colorMap[action.icon],
						action.className,
					)}
					title={action.tooltip}
					aria-label={action.label || action.icon}
				>
					{action.icon === "custom" ? action.customIcon : iconMap[action.icon]}
				</Button>
			))}
		</div>
	);
};

export default TableActions;
