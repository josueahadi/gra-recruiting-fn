import type React from "react";
import { X } from "lucide-react";
import type { WorkExperience } from "@/hooks/use-profile";

interface ExperienceCardProps {
	experience: WorkExperience;
	onRemove: (id: string) => void;
	canEdit: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
	experience,
	onRemove,
	canEdit,
}) => {
	// Format the display of duration
	const formatDuration = (duration: string) => {
		// Check if duration already has the LinkedIn format with parentheses
		if (duration.includes("(") && duration.includes(")")) {
			// Extract date range and duration
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

		// If it's just a date range without calculated duration
		return <span>{duration}</span>;
	};

	return (
		<div className="p-4 bg-blue-50 rounded-md mb-4 relative">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-semibold text-lg">{experience.role}</h3>
					<p className="text-gray-600">
						{experience.company} · {experience.responsibilities}
					</p>
					<p className="text-sm text-gray-500">
						{formatDuration(experience.duration)}
					</p>
				</div>

				{canEdit && (
					<button
						type="button"
						onClick={() => onRemove(experience.id)}
						className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
						aria-label="Remove experience"
					>
						<X size={18} />
					</button>
				)}
			</div>
		</div>
	);
};

export default ExperienceCard;
