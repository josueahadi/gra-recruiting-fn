"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";

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
	className,
}) => {
	const [isFromOpen, setIsFromOpen] = useState(false);
	const [isToOpen, setIsToOpen] = useState(false);
	const [fromInputValue, setFromInputValue] = useState("");
	const [toInputValue, setToInputValue] = useState("");
	const [fromInputError, setFromInputError] = useState(false);
	const [toInputError, setToInputError] = useState(false);

	// Update input values when date props change
	useEffect(() => {
		setFromInputValue(fromDate ? format(fromDate, "dd/MM/yyyy") : "");
		setFromInputError(false);
	}, [fromDate]);

	useEffect(() => {
		setToInputValue(toDate ? format(toDate, "dd/MM/yyyy") : "");
		setToInputError(false);
	}, [toDate]);

	// Format the date and handle potential zeros insertion
	const formatDateInput = (value: string): string => {
		// Remove any non-digit or non-slash characters
		let cleaned = value.replace(/[^\d/]/g, "");

		// Handle automatic formatting with slashes
		if (cleaned.length > 0) {
			// Don't add automatic slashes for incomplete sections
			if (cleaned.length === 2 && !cleaned.includes("/")) {
				cleaned = `${cleaned}/`;
			} else if (cleaned.length === 5 && cleaned.split("/").length === 2) {
				cleaned = `${cleaned}/`;
			}

			// Ensure we don't have more than 2 slashes
			const parts = cleaned.split("/");
			if (parts.length > 3) {
				cleaned = `${parts[0]}/${parts[1]}/${parts.slice(2).join("")}`;
			}

			// Prevent adding zeros to the year part automatically
			if (parts.length === 3) {
				// Keep year part as typed, don't pad with zeros
				cleaned = `${parts[0]}/${parts[1]}/${parts[2].substring(0, 4)}`;
			}
		}

		return cleaned;
	};

	// Parse manually entered dates
	const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		const value = formatDateInput(rawValue);
		setFromInputValue(value);

		if (value.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
			try {
				const parsedDate = parse(value, "dd/MM/yyyy", new Date());
				if (isValid(parsedDate)) {
					onFromDateChange(parsedDate);
					setFromInputError(false);
				} else {
					setFromInputError(true);
				}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				setFromInputError(true);
			}
		} else if (value === "") {
			onFromDateChange(undefined);
			setFromInputError(false);
		} else {
			// Don't show error for incomplete input
			setFromInputError(false);
			if (fromDate) onFromDateChange(undefined);
		}
	};

	const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		const value = formatDateInput(rawValue);
		setToInputValue(value);

		if (value.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
			try {
				const parsedDate = parse(value, "dd/MM/yyyy", new Date());
				if (isValid(parsedDate)) {
					onToDateChange(parsedDate);
					setToInputError(false);
				} else {
					setToInputError(true);
				}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				setToInputError(true);
			}
		} else if (value === "") {
			onToDateChange(undefined);
			setToInputError(false);
		} else {
			// Don't show error for incomplete input
			setToInputError(false);
			if (toDate) onToDateChange(undefined);
		}
	};

	return (
		<div className={cn("flex flex-col space-y-1.5", className)}>
			{label && (
				<div className="flex items-center justify-between">
					<Label className="text-xs font-medium text-gray-600">{label}</Label>
					<span className="text-xs text-gray-500">Format: DD/MM/YYYY</span>
				</div>
			)}
			<div className="flex space-x-2">
				<div className="relative flex-1">
					<Input
						value={fromInputValue}
						onChange={handleFromInputChange}
						placeholder="DD/MM/YYYY"
						className={cn("pr-10", fromInputError && "border-red-500")}
					/>
					{fromInputError && (
						<div className="absolute right-10 top-0 h-full flex items-center">
							<AlertCircle className="h-4 w-4 text-red-500" />
						</div>
					)}
					<Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full w-10"
							>
								<CalendarIcon className="h-4 w-4" />
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
				</div>

				<div className="relative flex-1">
					<Input
						value={toInputValue}
						onChange={handleToInputChange}
						placeholder="DD/MM/YYYY"
						className={cn("pr-10", toInputError && "border-red-500")}
					/>
					{toInputError && (
						<div className="absolute right-10 top-0 h-full flex items-center">
							<AlertCircle className="h-4 w-4 text-red-500" />
						</div>
					)}
					<Popover open={isToOpen} onOpenChange={setIsToOpen}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full w-10"
							>
								<CalendarIcon className="h-4 w-4" />
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
		</div>
	);
};

export default DateRangePicker;
