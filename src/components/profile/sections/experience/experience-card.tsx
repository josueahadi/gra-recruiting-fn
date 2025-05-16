import type React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { WorkExperience } from "@/types/profile";

interface ExperienceCardProps {
	experience: WorkExperience;
	onRemove: (id: string) => void;
	canEdit: boolean;
	onEdit?: (experience: WorkExperience) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
	experience,
	onRemove,
	canEdit,
	onEdit,
}) => {
	// Format date string to Month Year (e.g., Jan 2021)
	const formatDateToMonthYear = (dateStr?: string | null): string => {
		if (!dateStr) return "Present";
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			year: "numeric",
		}).format(date);
	};

	// Format employment type to human-readable format
	const formatEmploymentType = (type?: string): string => {
		if (!type) return "";

		const typeMap: Record<string, string> = {
			FULL_TIME: "Full-time",
			PART_TIME: "Part-time",
			CONTRACT: "Contract",
			INTERNSHIP: "Internship",
			FREELANCE: "Freelance",
		};

		return typeMap[type] || type;
	};

	// Get formatted date range (Start - End)
	const getFormattedDateRange = (): React.ReactNode => {
		const startDate = formatDateToMonthYear(experience.startDate);
		const endDate = experience.endDate
			? formatDateToMonthYear(experience.endDate)
			: "Present";

		return `${startDate} - ${endDate}`;
	};

	return (
		<div className="bg-blue-50 rounded-xl p-6 flex items-center justify-between">
			<div className="flex-1">
				{/* Job title at the top */}
				<h3 className="text-lg font-bold text-gray-900">
					{experience.jobTitle}
				</h3>

				{/* Company name and employment type */}
				<p className="text-gray-700">
					{experience.companyName}
					{experience.employmentType && (
						<span className="ml-2 text-gray-500">
							• {formatEmploymentType(experience.employmentType)}
						</span>
					)}
				</p>

				{/* Date range and location */}
				<div className="flex items-center text-sm text-gray-500 mt-1">
					<span className="mr-2">{experience.country}</span>
					<span className="bg-gray-300 rounded-full w-1 h-1 mx-1" />
					<span>{getFormattedDateRange()}</span>
				</div>
			</div>

			{/* Edit/delete buttons */}
			<div className="flex-shrink-0">
				{canEdit && (
					<Popover>
						<PopoverTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								className="h-8 w-8 p-0"
								aria-label="Edit or delete experience"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" className="w-32 p-1">
							<button
								type="button"
								className="flex items-center w-full px-2 py-2 text-sm hover:bg-blue-100 rounded transition-colors"
								onClick={() => onEdit && onEdit(experience)}
							>
								<Pencil className="h-4 w-4 mr-2 text-gray-600" /> Edit
							</button>
							<button
								type="button"
								className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
								onClick={() =>
									experience.id ? onRemove(experience.id.toString()) : null
								}
							>
								<Trash2 className="h-4 w-4 mr-2" /> Delete
							</button>
						</PopoverContent>
					</Popover>
				)}
			</div>
		</div>
	);
};

export default ExperienceCard;
