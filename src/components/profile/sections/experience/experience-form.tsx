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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (company && role) {
			const startYear = startDate
				? new Date(startDate).getFullYear().toString()
				: "";
			const endYear = endDate
				? new Date(endDate).getFullYear().toString()
				: "Present";

			onAddExperience({
				company,
				role,
				duration: `${startYear} - ${endYear}`,
				responsibilities: employmentType || "Full-time",
			});

			// Reset form
			setCompany("");
			setStartDate("");
			setEndDate("");
			setRole("");
			setEmploymentType("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label className="block text-sm font-medium mb-1">Company Name</Label>
				<Input
					placeholder="Enter your institution's name"
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
				</div>
			</div>

			<div>
				<Label className="block text-sm font-medium mb-1">Role</Label>
				<Input
					placeholder="Enter your program"
					value={role}
					onChange={(e) => setRole(e.target.value)}
					required
				/>
			</div>

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
