import type React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Education } from "@/types/education-experience";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface EducationCardProps {
	education: Education;
	onRemove: (id: string) => void;
	canEdit: boolean;
	onEdit?: (education: Education) => void;
}

const EducationCard: React.FC<EducationCardProps> = ({
	education,
	onRemove,
	canEdit,
	onEdit,
}) => {
	// Format the education level
	const formatEducationLevel = (level?: string) => {
		if (!level) return "";

		// Map the education level API values to user-friendly display values
		const educationLevelMap: Record<string, string> = {
			HIGH_SCHOOL: "High School",
			ASSOCIATE: "Associate Degree",
			BACHELOR: "Bachelor's Degree",
			MASTER: "Master's Degree",
			DOCTORATE: "Doctorate",
			OTHER: "Other",
		};

		return (
			educationLevelMap[level] ||
			level
				.split("_")
				.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
				)
				.join(" ")
		);
	};

	// Format date or return placeholder
	const formatDateToMonthYear = (dateStr?: string | null): string => {
		if (!dateStr) return "N/A";
		const date = new Date(dateStr);
		return date.toLocaleString("default", { month: "short", year: "numeric" });
	};

	return (
		<div className="p-4 bg-blue-50 rounded-md mb-4 relative">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-semibold text-lg">
						{education.institutionName} -{" "}
						{formatEducationLevel(education.educationLevel)}
					</h3>
					<p className="text-gray-600">{education.program}</p>
					<p className="text-sm text-gray-500">
						{formatDateToMonthYear(education.dateJoined)} -{" "}
						{formatDateToMonthYear(education.dateGraduated)}
					</p>
				</div>

				{canEdit && (
					<Popover>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="p-2 rounded-full hover:bg-blue-100 text-primary-base"
								aria-label="More actions"
							>
								<MoreVertical className="h-5 w-5" />
							</button>
						</PopoverTrigger>
						<PopoverContent align="end" className="w-32 p-1">
							<button
								type="button"
								className="flex items-center w-full px-2 py-2 text-sm hover:bg-blue-100 rounded transition-colors"
								onClick={() => onEdit?.(education)}
							>
								<Pencil className="h-4 w-4 mr-2 text-gray-600" /> Edit
							</button>
							<button
								type="button"
								className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
								onClick={() => onRemove(education.id || "")}
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

export default EducationCard;
