"use client";

import DateRangePicker from "@/components/common/date-range-picker";
import FilterDropdown from "@/components/common/filter-dropdown";
import SearchBar from "@/components/common/search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type React from "react";

export interface FilterConfig {
	type: "search" | "dropdown" | "dateRange" | "button" | "custom";
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	props?: any;
	width?: string;
	align?: "left" | "right";
	render?: () => React.ReactNode;
}

interface FilterBarProps {
	filters: FilterConfig[];
	onClear?: () => void;
	clearDisabled?: boolean;
	className?: string;
	hasAddButton?: boolean;
	addButtonProps?: {
		label: string;
		onClick: () => void;
		icon?: React.ReactNode;
	};
}

/**
 * Reusable filter bar component that can be configured with different filter types
 */
const FilterBar: React.FC<FilterBarProps> = ({
	filters,
	onClear,
	clearDisabled = false,
	className,
	hasAddButton = false,
	addButtonProps,
}) => {
	// Sort filters by alignment (left then right)
	const sortedFilters = [...filters].sort((a, b) => {
		if (a.align === "right" && b.align !== "right") return 1;
		if (a.align !== "right" && b.align === "right") return -1;
		return 0;
	});

	return (
		<div className={cn("flex flex-col md:flex-row gap-4 mb-6", className)}>
			{sortedFilters.map((filter, index) => (
				<div
					key={`filter-${
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						index
					}`}
					className={cn(
						filter.width ||
							(filter.type === "search"
								? "w-full md:w-1/3"
								: "w-full md:w-1/5"),
						filter.align === "right" && "md:ml-auto",
					)}
				>
					{filter.type === "search" && (
						<SearchBar
							onSearch={filter.props.onSearch}
							placeholder={filter.props.placeholder || "Search..."}
							initialValue={filter.props.initialValue}
						/>
					)}

					{filter.type === "dropdown" && (
						<FilterDropdown
							options={filter.props.options}
							value={filter.props.value}
							onChange={filter.props.onChange}
						/>
					)}

					{filter.type === "dateRange" && (
						<DateRangePicker
							fromDate={filter.props.fromDate}
							toDate={filter.props.toDate}
							onFromDateChange={filter.props.onFromDateChange}
							onToDateChange={filter.props.onToDateChange}
							fromPlaceholder={filter.props.fromPlaceholder || "From Date"}
							toPlaceholder={filter.props.toPlaceholder || "To Date"}
						/>
					)}

					{filter.type === "button" && (
						<Button
							variant={filter.props.variant || "outline"}
							onClick={filter.props.onClick}
							className={cn("h-10", filter.props.className)}
							disabled={filter.props.disabled}
						>
							{filter.props.icon && (
								<span className="mr-2">{filter.props.icon}</span>
							)}
							{filter.props.label}
						</Button>
					)}

					{filter.type === "custom" && filter.render && filter.render()}
				</div>
			))}

			{onClear && (
				<div className="flex items-end ml-auto">
					<Button
						variant="outline"
						onClick={onClear}
						className="h-10"
						disabled={clearDisabled}
					>
						Clear
					</Button>
				</div>
			)}

			{hasAddButton && addButtonProps && (
				<div className="flex items-end">
					<Button
						className="h-10 bg-primary-base hover:bg-primary-shades-500"
						onClick={addButtonProps.onClick}
					>
						{addButtonProps.icon || <Plus className="h-4 w-4 mr-2" />}
						{addButtonProps.label}
					</Button>
				</div>
			)}
		</div>
	);
};

export default FilterBar;
