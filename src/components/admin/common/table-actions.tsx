"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Trash2, FileEdit, Bot } from "lucide-react";
import type React from "react";

export type ActionIcon = "view" | "delete" | "edit" | "robot";

interface Action {
	icon: ActionIcon;
	onClick: () => void;
	tooltip?: string;
	disabled?: boolean;
}

interface TableActionsProps {
	actions: Action[];
	className?: string;
}

const getIcon = (type: ActionIcon) => {
	switch (type) {
		case "view":
			return <Eye className="h-4 w-4" />;
		case "delete":
			return <Trash2 className="h-4 w-4" />;
		case "edit":
			return <FileEdit className="h-4 w-4" />;
		case "robot":
			return <Bot className="h-4 w-4" />;
		default:
			return null;
	}
};

const getIconColor = (type: ActionIcon) => {
	switch (type) {
		case "view":
			return "text-blue-500 hover:text-blue-700";
		case "delete":
			return "text-red-500 hover:text-red-700";
		case "edit":
			return "text-amber-500 hover:text-amber-700";
		case "robot":
			return "text-indigo-500 hover:text-indigo-700";
		default:
			return "";
	}
};

const TableActions: React.FC<TableActionsProps> = ({ actions, className }) => {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<TooltipProvider>
				{actions.map((action, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className={`${getIconColor(action.icon)} ${
									action.disabled ? "opacity-50 cursor-not-allowed" : ""
								}`}
								onClick={action.onClick}
								disabled={action.disabled}
							>
								{getIcon(action.icon)}
							</Button>
						</TooltipTrigger>
						{action.tooltip && (
							<TooltipContent>
								<p>{action.tooltip}</p>
							</TooltipContent>
						)}
					</Tooltip>
				))}
			</TooltipProvider>
		</div>
	);
};

export default TableActions;
