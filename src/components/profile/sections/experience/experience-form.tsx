import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { WorkExperience } from "@/types/profile";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

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

const employmentTypes = [
	{ value: "FULL_TIME", label: "Full-time" },
	{ value: "PART_TIME", label: "Part-time" },
	{ value: "CONTRACT", label: "Contract" },
	{ value: "INTERNSHIP", label: "Internship" },
	{ value: "FREELANCE", label: "Freelance" },
];

// Sample list of countries - you can replace with a more comprehensive list
const countries = [
	"Rwanda",
	"Kenya",
	"Uganda",
	"Tanzania",
	"United States",
	"Canada",
	"United Kingdom",
	"Germany",
	"France",
	"China",
	"Japan",
	"Australia",
	"India",
	"South Africa",
	"Nigeria",
];

const experienceFormSchema = z.object({
	jobTitle: z.string().min(1, "Job title is required"),
	companyName: z.string().min(1, "Company name is required"),
	employmentType: z.string().min(1, "Employment type is required"),
	country: z.string().min(1, "Country is required"),
	startDay: z.string().min(1, "Day is required"),
	startMonth: z.string().min(1, "Month is required"),
	startYear: z.string().min(1, "Year is required"),
	endDay: z.string().optional(),
	endMonth: z.string().optional(),
	endYear: z.string().optional(),
	isCurrent: z.boolean().default(false),
});

type ExperienceFormData = z.infer<typeof experienceFormSchema>;

interface ExperienceFormProps {
	experience?: WorkExperience;
	initialData?: WorkExperience;
	isEdit?: boolean;
	onAddExperience: (data: Omit<WorkExperience, "id">) => void;
	onCancel?: () => void;
	isSubmitting?: boolean;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
	initialData,
	onAddExperience,
	onCancel,
	isSubmitting = false,
	isEdit = false,
}) => {
	console.log("[ExperienceForm] Rendering form with initialData:", initialData);
	console.log("[ExperienceForm] isEdit:", isEdit);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ExperienceFormData>({
		resolver: zodResolver(experienceFormSchema),
		defaultValues: initialData
			? {
					jobTitle: initialData.jobTitle,
					companyName: initialData.companyName,
					employmentType: initialData.employmentType || "FULL_TIME",
					country: initialData.country || "Rwanda",
					startDay: initialData.startDate
						? String(new Date(initialData.startDate).getDate())
						: "",
					startMonth: initialData.startDate
						? String(new Date(initialData.startDate).getMonth() + 1)
						: "",
					startYear: initialData.startDate
						? String(new Date(initialData.startDate).getFullYear())
						: "",
					endDay: initialData.endDate
						? String(new Date(initialData.endDate).getDate())
						: "",
					endMonth: initialData.endDate
						? String(new Date(initialData.endDate).getMonth() + 1)
						: "",
					endYear: initialData.endDate
						? String(new Date(initialData.endDate).getFullYear())
						: "",
					isCurrent: !initialData.endDate,
				}
			: {
					employmentType: "FULL_TIME",
					country: "Rwanda",
					isCurrent: false,
				},
	});

	const isCurrent = watch("isCurrent");
	const startDay = watch("startDay");
	const startMonth = watch("startMonth");
	const startYear = watch("startYear");
	const endDay = watch("endDay");
	const endMonth = watch("endMonth");
	const endYear = watch("endYear");

	// Validate if end date is not before start date
	const isEndDateBeforeStartDate = (): boolean => {
		if (!startYear || !startMonth || !startDay || isCurrent) return false;
		if (!endYear || !endMonth || !endDay) return false;

		const startDate = new Date(
			Number.parseInt(startYear, 10),
			Number.parseInt(startMonth, 10) - 1,
			Number.parseInt(startDay, 10),
		);
		const endDate = new Date(
			Number.parseInt(endYear, 10),
			Number.parseInt(endMonth, 10) - 1,
			Number.parseInt(endDay, 10),
		);

		return endDate < startDate;
	};

	const handleFormSubmit = (data: ExperienceFormData) => {
		console.log("[ExperienceForm] Form submission data:", data);
		const pad = (n: string) => n.padStart(2, "0");
		const startDate = `${data.startYear}-${pad(data.startMonth)}-${pad(data.startDay)}`;
		let endDate: string | undefined = undefined;

		if (!data.isCurrent && data.endYear && data.endMonth && data.endDay) {
			// Check if end date is before start date
			if (isEndDateBeforeStartDate()) {
				alert("End date cannot be before start date");
				return;
			}
			endDate = `${data.endYear}-${pad(data.endMonth)}-${pad(data.endDay)}`;
		}

		const formattedData: Omit<WorkExperience, "id"> = {
			jobTitle: data.jobTitle,
			companyName: data.companyName,
			employmentType: data.employmentType,
			country: data.country,
			startDate,
			endDate,
		};
		console.log(
			"[ExperienceForm] Formatted data for submission:",
			formattedData,
		);
		onAddExperience(formattedData);
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
			<div>
				<Label htmlFor="jobTitle">Job Title *</Label>
				<Input
					id="jobTitle"
					{...register("jobTitle")}
					placeholder="e.g. Senior Software Engineer"
					className={
						errors.jobTitle ? "border-red-500 focus-visible:ring-red-500" : ""
					}
				/>
				{errors.jobTitle && (
					<p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
				)}
			</div>

			<div>
				<Label htmlFor="companyName">Company Name *</Label>
				<Input
					id="companyName"
					{...register("companyName")}
					placeholder="e.g. Acme Inc."
					className={
						errors.companyName
							? "border-red-500 focus-visible:ring-red-500"
							: ""
					}
				/>
				{errors.companyName && (
					<p className="text-red-500 text-sm mt-1">
						{errors.companyName.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="employmentType">Employment Type *</Label>
				<Select
					value={watch("employmentType")}
					onValueChange={(v) => setValue("employmentType", v)}
				>
					<SelectTrigger
						className={
							errors.employmentType
								? "border-red-500 focus-visible:ring-red-500"
								: ""
						}
					>
						<SelectValue placeholder="Select employment type" />
					</SelectTrigger>
					<SelectContent>
						{employmentTypes.map((type) => (
							<SelectItem key={type.value} value={type.value}>
								{type.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.employmentType && (
					<p className="text-red-500 text-sm mt-1">
						{errors.employmentType.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="country">Country *</Label>
				<Select
					value={watch("country")}
					onValueChange={(v) => setValue("country", v)}
				>
					<SelectTrigger
						className={
							errors.country ? "border-red-500 focus-visible:ring-red-500" : ""
						}
					>
						<SelectValue placeholder="Select country" />
					</SelectTrigger>
					<SelectContent>
						{countries.map((country) => (
							<SelectItem key={country} value={country}>
								{country}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.country && (
					<p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label>Start Date *</Label>
					<div className="flex gap-2">
						<Select
							value={watch("startDay")}
							onValueChange={(v) => setValue("startDay", v)}
						>
							<SelectTrigger
								className={
									errors.startDay
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
							>
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
						<Select
							value={watch("startMonth")}
							onValueChange={(v) => setValue("startMonth", v)}
						>
							<SelectTrigger
								className={
									errors.startMonth
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
							>
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
						<Select
							value={watch("startYear")}
							onValueChange={(v) => setValue("startYear", v)}
						>
							<SelectTrigger
								className={
									errors.startYear
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
							>
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
					{(errors.startDay || errors.startMonth || errors.startYear) && (
						<p className="text-red-500 text-sm mt-1">Start date is required</p>
					)}
				</div>

				<div>
					<Label>End Date {isCurrent ? "(Not Required)" : "*"}</Label>
					<div className="flex gap-2">
						<Select
							value={watch("endDay") || ""}
							onValueChange={(v) => setValue("endDay", v)}
							disabled={isCurrent}
						>
							<SelectTrigger
								className={
									errors.endDay || isEndDateBeforeStartDate()
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
							>
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
						<Select
							value={watch("endMonth") || ""}
							onValueChange={(v) => setValue("endMonth", v)}
							disabled={isCurrent}
						>
							<SelectTrigger
								className={
									errors.endMonth || isEndDateBeforeStartDate()
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
							>
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
						<Select
							value={watch("endYear") || ""}
							onValueChange={(v) => setValue("endYear", v)}
							disabled={isCurrent}
						>
							<SelectTrigger
								className={
									errors.endYear || isEndDateBeforeStartDate()
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
							>
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
					{(errors.endDay || errors.endMonth || errors.endYear) &&
						!isCurrent && (
							<p className="text-red-500 text-sm mt-1">End date is required</p>
						)}
					{isEndDateBeforeStartDate() && (
						<p className="text-red-500 text-sm mt-1">
							End date cannot be before start date
						</p>
					)}
				</div>
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox
					id="isCurrent"
					checked={isCurrent}
					onCheckedChange={(checked) => {
						setValue("isCurrent", !!checked);
						if (checked) {
							setValue("endDay", undefined);
							setValue("endMonth", undefined);
							setValue("endYear", undefined);
						}
					}}
				/>
				<Label htmlFor="isCurrent">I currently work here</Label>
			</div>

			<div className="flex justify-end space-x-2 pt-2">
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					className="bg-primary-base hover:bg-custom-skyBlue text-white font-semibold"
					disabled={isSubmitting || isEndDateBeforeStartDate()}
				>
					{isSubmitting
						? "Saving..."
						: isEdit
							? "Update Experience"
							: "Save Experience"}
				</Button>
			</div>
		</form>
	);
};

export default ExperienceForm;
