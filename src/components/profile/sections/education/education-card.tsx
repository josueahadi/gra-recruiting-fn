import type React from "react";
import { X } from "lucide-react";
import type { Education } from "@/hooks/use-profile";

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
	return (
		<div className="p-4 bg-blue-50 rounded-md mb-4 relative">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-semibold text-lg">
						{education.institution} - {education.degree}
					</h3>
					<p className="text-gray-600">{education.program}</p>
					<p className="text-sm text-gray-500">
						{education.startYear} - {education.endYear}
					</p>
				</div>

				{canEdit && (
					<button
						type="button"
						onClick={() => onRemove(education.id)}
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
