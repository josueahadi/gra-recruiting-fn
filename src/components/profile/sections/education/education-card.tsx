import type React from "react";
import { X } from "lucide-react";
import type { Education } from "@/types/education-experience";

interface EducationCardProps {
	education: Education;
	onRemove: (id: string) => void;
	canEdit: boolean;
}

const EducationCard: React.FC<EducationCardProps> = ({
	education,
	onRemove,
	canEdit,
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
	const formatYear = (dateStr?: string | null) => {
		if (!dateStr) return "N/A";
		try {
			return new Date(dateStr).getFullYear().toString();
		} catch (e) {
			return "N/A";
		}
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
						{formatYear(education.dateJoined)} -{" "}
						{education.dateGraduated
							? formatYear(education.dateGraduated)
							: "Present"}
					</p>
				</div>

				{canEdit && (
					<button
						type="button"
						onClick={() => onRemove(education.id || "")}
						className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
						aria-label="Remove education"
					>
						<X size={18} />
					</button>
				)}
			</div>
		</div>
	);
};

export default EducationCard;
