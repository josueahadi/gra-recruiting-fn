import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import type { WorkExperience } from "@/hooks/use-profile";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ExperienceFormProps {
	onAddExperience: (experience: Omit<WorkExperience, "id">) => void;
	isSubmitting?: boolean;
}

const EMPLOYMENT_TYPES = [
	"FULL_TIME",
	"PART_TIME",
	"CONTRACT",
	"INTERNSHIP",
	"FREELANCE",
];

// Format the employment type for display
const formatEmploymentType = (type: string) => {
	const employmentTypeMap: Record<string, string> = {
		FULL_TIME: "Full-time",
		PART_TIME: "Part-time",
		CONTRACT: "Contract",
		INTERNSHIP: "Internship",
		FREELANCE: "Freelance",
	};

	return (
		employmentTypeMap[type] ||
		type
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ")
	);
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({
	onAddExperience,
	isSubmitting = false,
}) => {
	const [company, setCompany] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [role, setRole] = useState("");
	const [employmentType, setEmploymentType] = useState("");
	const [country, setCountry] = useState("Rwanda");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (company && role && startDate) {
			// Format dates to "Month Year" format (e.g., "Jun 2021")
			const formatDate = (dateStr: string) => {
				if (!dateStr) return "";
				const date = new Date(dateStr);
				return date.toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				});
			};

			// Calculate duration
			const calculateDuration = () => {
				try {
					const start = new Date(startDate);
					const end = endDate ? new Date(endDate) : new Date();

					// Get total months
					const months =
						(end.getFullYear() - start.getFullYear()) * 12 +
						(end.getMonth() - start.getMonth());

					// Calculate years and remaining months
					const years = Math.floor(months / 12);
					const remainingMonths = months % 12;

					const yearsText =
						years > 0 ? `${years} ${years === 1 ? "yr" : "yrs"}` : "";
					const monthsText =
						remainingMonths > 0
							? `${remainingMonths} ${remainingMonths === 1 ? "mo" : "mos"}`
							: "";

					if (yearsText && monthsText) {
						return `${yearsText} ${monthsText}`;
					}
					if (yearsText) {
						return yearsText;
					}
					if (monthsText) {
						return monthsText;
					}
					return "Less than a month";
				} catch (e) {
					console.error("Error calculating duration:", e);
					return "";
				}
			};

			const formattedStartDate = formatDate(startDate);
			const formattedEndDate = endDate ? formatDate(endDate) : "Present";
			const duration = calculateDuration();

			onAddExperience({
				company,
				role,
				duration: `${formattedStartDate} - ${formattedEndDate}${duration ? ` (${duration})` : ""}`,
				responsibilities: employmentType || "FULL_TIME",
				country,
			});

			// Reset form
			setCompany("");
			setStartDate("");
			setEndDate("");
			setRole("");
			setEmploymentType("");
			setCountry("Rwanda");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label className="block text-sm font-medium mb-1">Company Name</Label>
				<Input
					placeholder="Enter company name"
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					required
					disabled={isSubmitting}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label className="block text-sm font-medium mb-1">Start date</Label>
					<Input
						type="date"
						placeholder="dd-mm-yyyy"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						required
						disabled={isSubmitting}
					/>
				</div>
				<div>
					<Label className="block text-sm font-medium mb-1">End date</Label>
					<Input
						type="date"
						placeholder="dd-mm-yyyy"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						disabled={isSubmitting}
					/>
					<p className="text-xs text-gray-500 mt-1">
						Leave empty if this is your current position
					</p>
				</div>
			</div>

			<div>
				<Label className="block text-sm font-medium mb-1">Role</Label>
				<Input
					placeholder="Your position or title"
					value={role}
					onChange={(e) => setRole(e.target.value)}
					required
					disabled={isSubmitting}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label className="block text-sm font-medium mb-1">
						Employment Type
					</Label>
					<Select
						value={employmentType}
						onValueChange={setEmploymentType}
						disabled={isSubmitting}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select Employment Type" />
						</SelectTrigger>
						<SelectContent>
							{EMPLOYMENT_TYPES.map((type) => (
								<SelectItem key={type} value={type}>
									{formatEmploymentType(type)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label className="block text-sm font-medium mb-1">Country</Label>
					<Input
						placeholder="Country"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						required
						disabled={isSubmitting}
					/>
				</div>
			</div>

			<Button
				type="submit"
				className="w-full bg-primary-base hover:bg-custom-skyBlue text-white"
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						Adding Experience...
					</>
				) : (
					<>
						<Plus className="h-4 w-4 mr-2" />
						Add Work Experience
					</>
				)}
			</Button>
		</form>
	);
};

export default ExperienceForm;
