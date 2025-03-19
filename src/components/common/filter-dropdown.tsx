"use client";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type React from "react";

export interface FilterOption {
	value: string;
	label: string;
}

interface FilterDropdownProps {
	options: FilterOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	options,
	value,
	onChange,
	placeholder = "Filter",
	label,
	className,
}) => {
	const handleChange = (newValue: string) => {
		onChange(newValue);
	};

	return (
		<div className={cn("flex flex-col space-y-1.5", className)}>
			{label && (
				<Label className="text-xs font-medium text-gray-600">{label}</Label>
			)}
			<Select value={value} onValueChange={handleChange}>
				<SelectTrigger className="h-10">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default FilterDropdown;
