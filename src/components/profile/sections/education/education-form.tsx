import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Education, EducationLevel } from "@/types/education-experience";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DateRangePicker from "@/components/common/date-range-picker";
import { convertUIDateToApiDate } from "@/lib/utils/date-utils";

interface EducationFormProps {
	onAddEducation: (education: Omit<Education, "id">) => void;
	isSubmitting?: boolean;
}

const EDUCATION_LEVELS: EducationLevel[] = [
	"HIGH_SCHOOL",
	"ASSOCIATE",
	"BACHELOR",
	"MASTER",
	"DOCTORATE",
];

// Format the education level for display
const formatEducationLevel = (level: string) => {
	const educationLevelMap: Record<string, string> = {
		HIGH_SCHOOL: "High School",
		ASSOCIATE: "Associate Degree",
		BACHELOR: "Bachelor's Degree",
		MASTER: "Master's Degree",
		DOCTORATE: "Doctorate",
	};

	return (
		educationLevelMap[level] ||
		level
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ")
	);
};

const EducationForm: React.FC<
	EducationFormProps & {
		initialData?: Education;
		isEdit?: boolean;
		onCancel?: () => void;
	}
> = ({
	onAddEducation,
	isSubmitting = false,
	initialData,
	isEdit = false,
	onCancel,
}) => {
	const [institution, setInstitution] = useState(
		initialData?.institutionName || "",
	);
	const [level, setLevel] = useState<EducationLevel | "">(
		initialData?.educationLevel
			? (initialData.educationLevel as EducationLevel)
			: "",
	);
	const [program, setProgram] = useState(initialData?.program || "");
	const [dateJoined, setDateJoined] = useState<Date | undefined>(
		initialData?.dateJoined ? new Date(initialData.dateJoined) : undefined,
	);
	const [dateGraduated, setDateGraduated] = useState<Date | undefined>(
		initialData?.dateGraduated
			? new Date(initialData.dateGraduated)
			: undefined,
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (institution && level && program && dateJoined && dateGraduated) {
			onAddEducation({
				institutionName: institution,
				educationLevel: level as EducationLevel,
				program,
				dateJoined: convertUIDateToApiDate(dateJoined.toISOString()),
				dateGraduated: convertUIDateToApiDate(dateGraduated.toISOString()),
			});

			// Reset form
			setInstitution("");
			setLevel("");
			setProgram("");
			setDateJoined(undefined);
			setDateGraduated(undefined);
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

			<div>
				<Label className="block text-sm font-medium mb-1">
					Education Level
				</Label>
				<Select
					value={level}
					onValueChange={(value) => setLevel(value as EducationLevel)}
					required
				>
					<SelectTrigger>
						<SelectValue placeholder="Select education level" />
					</SelectTrigger>
					<SelectContent>
						{EDUCATION_LEVELS.map((level) => (
							<SelectItem key={level} value={level}>
								{formatEducationLevel(level)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="block text-sm font-medium mb-1">Program</Label>
				<Input
					placeholder="Enter your program"
					value={program}
					onChange={(e) => setProgram(e.target.value)}
					required
				/>
			</div>

			<DateRangePicker
				fromDate={dateJoined}
				toDate={dateGraduated}
				onFromDateChange={setDateJoined}
				onToDateChange={setDateGraduated}
				label="Education Period"
				fromPlaceholder="Start date (DD/MM/YYYY)"
				toPlaceholder="End date (DD/MM/YYYY)"
			/>

			<p className="text-xs text-gray-500 -mt-2">
				If you are currently enrolled, leave the end date field empty.
			</p>

			<div className="flex gap-2">
				<Button
					type="submit"
					className="bg-primary-base hover:bg-custom-skyBlue text-white"
					disabled={isSubmitting}
				>
					{isEdit ? "Save Changes" : "Add Education"}
				</Button>
				{isEdit && onCancel && (
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				)}
			</div>
		</form>
	);
};

export default EducationForm;
