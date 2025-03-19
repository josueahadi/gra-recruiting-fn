"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
	onSearch: (value: string) => void;
	placeholder?: string;
	initialValue?: string;
	className?: string;
	debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	placeholder = "Search...",
	initialValue = "",
	className,
	debounceMs = 300,
}) => {
	const [searchValue, setSearchValue] = useState(initialValue);
	const [debouncedValue, setDebouncedValue] = useState(initialValue);

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	// Clear search
	const handleClear = () => {
		setSearchValue("");
		onSearch("");
	};

	// Handle debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(searchValue);
		}, debounceMs);

		return () => {
			clearTimeout(timer);
		};
	}, [searchValue, debounceMs]);

	// Call onSearch when debouncedValue changes
	useEffect(() => {
		onSearch(debouncedValue);
	}, [debouncedValue, onSearch]);

	return (
		<div className={cn("relative", className)}>
			<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<Search className="h-4 w-4 text-gray-400" />
			</div>
			<Input
				placeholder={placeholder}
				value={searchValue}
				onChange={handleChange}
				className="pl-10 pr-10"
			/>
			{searchValue && (
				<Button
					variant="ghost"
					size="icon"
					onClick={handleClear}
					className="absolute inset-y-0 right-0 flex items-center pr-3 h-full"
				>
					<X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
				</Button>
			)}
		</div>
	);
};

export default SearchBar;
