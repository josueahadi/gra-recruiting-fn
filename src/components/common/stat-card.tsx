import { cn } from "@/lib/utils";
import type React from "react";
import type { ReactNode } from "react";

interface StatCardProps {
	title: string;
	value: number | string;
	icon: ReactNode;
	className?: string;
	trend?: {
		value: number;
		label: string;
	};
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	icon,
	className,
}) => {
	return (
		<div className={cn("bg-white rounded-lg shadow-sm px-12 py-6", className)}>
			<div className="flex items-center gap-4">
				<div className="flex-shrink-0 text-primary-base">{icon}</div>
				<div>
					<div className="text-3xl font-bold text-primary-base">{value}</div>
					<div className="text-black text-base">{title}</div>
				</div>
			</div>
		</div>
	);
};

export default StatCard;
