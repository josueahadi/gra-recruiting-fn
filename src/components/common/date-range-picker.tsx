"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface DateRangePickerProps {
	fromDate: Date | undefined;
	toDate: Date | undefined;
	onFromDateChange: (date: Date | undefined) => void;
	onToDateChange: (date: Date | undefined) => void;
	label?: string;
	fromPlaceholder?: string;
	toPlaceholder?: string;
	className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
	fromDate,
	toDate,
	onFromDateChange,
	onToDateChange,
	label,
	fromPlaceholder = "From date",
	toPlaceholder = "To date",
	className,
}) => {
	const [isFromOpen, setIsFromOpen] = useState(false);
	const [isToOpen, setIsToOpen] = useState(false);

	const formatDate = (date: Date | undefined) => {
		return date ? format(date, "PPP") : "";
	};

	return (
		<div className={cn("flex flex-col space-y-1.5", className)}>
			{label && (
				<Label className="text-xs font-medium text-gray-600">{label}</Label>
			)}
			<div className="flex space-x-2">
				<Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"w-full justify-start text-left font-normal h-10",
								!fromDate && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{fromDate ? formatDate(fromDate) : fromPlaceholder}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={fromDate}
							onSelect={(date) => {
								onFromDateChange(date);
								setIsFromOpen(false);
							}}
							disabled={(date) => (toDate ? date > toDate : false)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>

				<Popover open={isToOpen} onOpenChange={setIsToOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"w-full justify-start text-left font-normal h-10",
								!toDate && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{toDate ? formatDate(toDate) : toPlaceholder}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={toDate}
							onSelect={(date) => {
								onToDateChange(date);
								setIsToOpen(false);
							}}
							disabled={(date) => (fromDate ? date < fromDate : false)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default DateRangePicker;
