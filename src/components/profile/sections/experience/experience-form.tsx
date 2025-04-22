import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import type { WorkExperience } from "@/hooks/use-profile";
import { Label } from "@/components/ui/label";

interface ExperienceFormProps {
	onAddExperience: (experience: Omit<WorkExperience, "id">) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ onAddExperience }) => {
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
				responsibilities: employmentType || "Full-time",
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
					/>
				</div>
				<div>
					<Label className="block text-sm font-medium mb-1">End date</Label>
					<Input
						type="date"
						placeholder="dd-mm-yyyy"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
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
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label className="block text-sm font-medium mb-1">
						Employment Type
					</Label>
					<select
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
						value={employmentType}
						onChange={(e) => setEmploymentType(e.target.value)}
					>
						<option value="">Select Employment Type</option>
						<option value="Full-time">Full-time</option>
						<option value="Part-time">Part-time</option>
						<option value="Contract">Contract</option>
						<option value="Internship">Internship</option>
						<option value="Freelance">Freelance</option>
					</select>
				</div>
				<div>
					<Label className="block text-sm font-medium mb-1">Country</Label>
					<Input
						placeholder="Country"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						required
					/>
				</div>
			</div>

			<Button
				type="submit"
				className="w-full bg-primary-base hover:bg-custom-skyBlue text-white"
			>
				<Plus className="h-4 w-4 mr-2" />
				Add Work Experience
			</Button>
		</form>
	);
};

export default ExperienceForm;
