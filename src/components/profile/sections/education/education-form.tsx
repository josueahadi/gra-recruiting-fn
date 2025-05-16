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

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, i) => currentYear - i);

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
	const [startDay, setStartDay] = useState(
		initialData?.dateJoined
			? String(new Date(initialData.dateJoined).getDate())
			: "",
	);
	const [startMonth, setStartMonth] = useState(
		initialData?.dateJoined
			? String(new Date(initialData.dateJoined).getMonth() + 1)
			: "",
	);
	const [startYear, setStartYear] = useState(
		initialData?.dateJoined
			? String(new Date(initialData.dateJoined).getFullYear())
			: "",
	);
	const [endDay, setEndDay] = useState(
		initialData?.dateGraduated
			? String(new Date(initialData.dateGraduated).getDate())
			: "",
	);
	const [endMonth, setEndMonth] = useState(
		initialData?.dateGraduated
			? String(new Date(initialData.dateGraduated).getMonth() + 1)
			: "",
	);
	const [endYear, setEndYear] = useState(
		initialData?.dateGraduated
			? String(new Date(initialData.dateGraduated).getFullYear())
			: "",
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			institution &&
			level &&
			program &&
			startDay &&
			startMonth &&
			startYear &&
			endDay &&
			endMonth &&
			endYear
		) {
			const pad = (n: string) => n.padStart(2, "0");
			const dateJoined = `${startYear}-${pad(startMonth)}-${pad(startDay)}`;
			const dateGraduated = `${endYear}-${pad(endMonth)}-${pad(endDay)}`;
			onAddEducation({
				institutionName: institution,
				educationLevel: level as EducationLevel,
				program,
				dateJoined,
				dateGraduated,
			});
			setInstitution("");
			setLevel("");
			setProgram("");
			setStartDay("");
			setStartMonth("");
			setStartYear("");
			setEndDay("");
			setEndMonth("");
			setEndYear("");
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

			<div>
				<Label className="block text-sm font-medium mb-1">Start Date</Label>
				<div className="flex gap-2">
					<Select value={startDay} onValueChange={setStartDay}>
						<SelectTrigger>
							<SelectValue placeholder="Day" />
						</SelectTrigger>
						<SelectContent>
							{days.map((d) => (
								<SelectItem key={d} value={String(d)}>
									{d}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={startMonth} onValueChange={setStartMonth}>
						<SelectTrigger>
							<SelectValue placeholder="Month" />
						</SelectTrigger>
						<SelectContent>
							{months.map((m, i) => (
								<SelectItem key={m} value={String(i + 1)}>
									{m}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={startYear} onValueChange={setStartYear}>
						<SelectTrigger>
							<SelectValue placeholder="Year" />
						</SelectTrigger>
						<SelectContent>
							{years.map((y) => (
								<SelectItem key={y} value={String(y)}>
									{y}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div>
				<Label className="block text-sm font-medium mb-1">End Date</Label>
				<div className="flex gap-2">
					<Select value={endDay} onValueChange={setEndDay}>
						<SelectTrigger>
							<SelectValue placeholder="Day" />
						</SelectTrigger>
						<SelectContent>
							{days.map((d) => (
								<SelectItem key={d} value={String(d)}>
									{d}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={endMonth} onValueChange={setEndMonth}>
						<SelectTrigger>
							<SelectValue placeholder="Month" />
						</SelectTrigger>
						<SelectContent>
							{months.map((m, i) => (
								<SelectItem key={m} value={String(i + 1)}>
									{m}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={endYear} onValueChange={setEndYear}>
						<SelectTrigger>
							<SelectValue placeholder="Year" />
						</SelectTrigger>
						<SelectContent>
							{years.map((y) => (
								<SelectItem key={y} value={String(y)}>
									{y}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex gap-2 justify-end">
				<Button
					type="submit"
					className="bg-primary-base hover:bg-custom-skyBlue text-white font-semibold"
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
