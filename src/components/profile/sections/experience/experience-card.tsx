import type React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { WorkExperience } from "@/types/profile";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

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
	const formatEmploymentType = (type?: string) => {
		if (!type) return "";

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
				.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
				)
				.join(" ")
		);
	};

	const formatDuration = (duration: string) => {
		if (duration.includes("(") && duration.includes(")")) {
			const [dateRange, calculatedDuration] = duration.split("(");
			return (
				<>
					<span>{dateRange.trim()}</span>
					<span className="text-gray-500">
						{" "}
						({calculatedDuration.replace(")", "")})
					</span>
				</>
			);
		}

		return <span>{duration}</span>;
	};

	return (
		<div className="p-4 bg-blue-50 rounded-md mb-4 relative">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-semibold text-lg">{experience.role}</h3>
					<p className="text-gray-600">
						{experience.company} ·{" "}
						{formatEmploymentType(experience.responsibilities)}
					</p>
					<p className="text-sm text-gray-500">
						{formatDuration(experience.duration)}
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
								onClick={() => onEdit?.(experience)}
							>
								<Pencil className="h-4 w-4 mr-2 text-gray-600" /> Edit
							</button>
							<button
								type="button"
								className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
								onClick={() => onRemove(experience.id)}
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
