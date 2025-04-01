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
	return (
		<div className="p-4 bg-blue-50 rounded-md mb-4 relative">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-semibold text-lg">{experience.role}</h3>
					<p className="text-gray-600">
						{experience.company} · {experience.responsibilities}
					</p>
					<p className="text-sm text-gray-500">{experience.duration}</p>
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
