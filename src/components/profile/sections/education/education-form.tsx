import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import type { Education } from "@/hooks/use-profile";
import { Label } from "@/components/ui/label";

interface EducationFormProps {
	onAddEducation: (education: Omit<Education, "id">) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ onAddEducation }) => {
	const [institution, setInstitution] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [level, setLevel] = useState("");
	const [program, setProgram] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (institution && level) {
			// Format dates to "Month Year" format (e.g., "Jun 2021")
			const formatDate = (dateStr: string) => {
				if (!dateStr) return "";
				const date = new Date(dateStr);
				return date.toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				});
			};

			onAddEducation({
				institution,
				degree: level,
				program,
				startYear: formatDate(startDate),
				endYear: formatDate(endDate) || "Present",
			});

			// Reset form
			setInstitution("");
			setStartDate("");
			setEndDate("");
			setLevel("");
			setProgram("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label className="block text-sm font-medium mb-1">
					Institution Name
				</Label>
				<Input
					placeholder="Enter your institution's name"
					value={institution}
					onChange={(e) => setInstitution(e.target.value)}
					required
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label className="block text-sm font-medium mb-1">Date Joined</Label>
					<Input
						type="date"
						placeholder="dd-mm-yyyy"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						required
					/>
				</div>
				<div>
					<Label className="block text-sm font-medium mb-1">
						Date Graduated
					</Label>
					<Input
						type="date"
						placeholder="dd-mm-yyyy"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						required
					/>
				</div>
			</div>

			<div>
				<Label className="block text-sm font-medium mb-1">Level</Label>
				<select
					className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
					value={level}
					onChange={(e) => setLevel(e.target.value)}
					required
				>
					<option value="">Select Education Level</option>
					<option value="High School">High School</option>
					<option value="Associate Degree">Associate Degree</option>
					<option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
					<option value="Master's Degree">Master&apos;s Degree</option>
					<option value="Doctorate">Doctorate</option>
				</select>
			</div>

			<div>
				<Label className="block text-sm font-medium mb-1">Program</Label>
				<Input
					placeholder="Enter your program"
					value={program}
					onChange={(e) => setProgram(e.target.value)}
				/>
			</div>

			<Button
				type="submit"
				className="w-full bg-primary-base hover:bg-custom-skyBlue text-white"
			>
				<Plus className="h-4 w-4 mr-2" />
				Add Education History
			</Button>
		</form>
	);
};

export default EducationForm;
