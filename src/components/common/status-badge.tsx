import type React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
	| "success"
	| "fail"
	| "waiting"
	| "pending"
	| "reviewing"
	| "default";

interface StatusBadgeProps {
	status: StatusType;
	className?: string;
	label?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
	status,
	className,
	label,
}) => {
	// Determine background and text colors based on status
	const getStatusStyles = (status: StatusType) => {
		switch (status) {
			case "success":
				return "bg-green-100 text-green-800";
			case "fail":
				return "bg-red-100 text-red-800";
			case "waiting":
				return "bg-amber-100 text-amber-800";
			case "pending":
				return "bg-blue-100 text-blue-800";
			case "reviewing":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Determine the display label if not provided
	const getStatusLabel = (status: StatusType) => {
		switch (status) {
			case "success":
				return "Success";
			case "fail":
				return "Fail";
			case "waiting":
				return "Waiting";
			case "pending":
				return "Pending";
			case "reviewing":
				return "Reviewing";
			default:
				return "Unknown";
		}
	};

	const displayLabel = label || getStatusLabel(status);
	const statusStyles = getStatusStyles(status);

	return (
		<span
			className={cn(
				"inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full",
				statusStyles,
				className,
			)}
		>
			{displayLabel}
		</span>
	);
};

export default StatusBadge;
