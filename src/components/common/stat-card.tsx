import { cn } from "@/lib/utils";
import type React from "react";
import type { ReactNode } from "react";

interface StatCardProps {
	title: string;
	value: number | string;
	icon: ReactNode;
	className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	icon,
	className,
}) => {
	return (
		<div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
			<div className="flex items-center gap-4">
				<div className="flex-shrink-0 text-blue-500">{icon}</div>
				<div>
					<div className="text-3xl font-bold text-blue-500">{value}</div>
					<div className="text-gray-600 text-sm">{title}</div>
				</div>
			</div>
		</div>
	);
};

export default StatCard;
