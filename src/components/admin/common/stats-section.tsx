"use client";

import type React from "react";
import StatCard from "@/components/common/stat-card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
	title: string;
	value: string;
	icon?: React.ReactNode;
	trend?: {
		value: number;
		label: string;
	};
}

interface StatsSectionProps {
	stats: StatCardProps[];
	className?: string;
	gridClassName?: string;
	title?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
	stats,
	className,
	gridClassName,
	title,
}) => {
	return (
		<div className={className}>
			{title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
			<div
				className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", gridClassName)}
			>
				{stats.map((stat, index) => (
					<StatCard
						key={`stat-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						title={stat.title}
						value={stat.value}
						icon={stat.icon}
						trend={stat.trend}
					/>
				))}
			</div>
		</div>
	);
};

export default StatsSection;
