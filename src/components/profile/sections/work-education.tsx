import type React from "react";
import { Separator } from "@/components/ui/separator";
import type { Education, WorkExperience } from "@/types/profile";
import EducationSection from "./education";
import ExperienceSection from "./experience";

interface WorkEducationSectionProps {
	education: Education[];
	experience: WorkExperience[];
	canEdit: boolean;
	onUpdate: (data: {
		education: Education[];
		experience: WorkExperience[];
	}) => void;
}

const WorkEducationSection: React.FC<WorkEducationSectionProps> = ({
	education,
	experience,
	canEdit,
	onUpdate,
}) => {
	const handleExperienceUpdate = (updatedExperience: WorkExperience[]) => {
		onUpdate({
			education,
			experience: updatedExperience,
		});
	};

	return (
		<div className="space-y-8">
			<EducationSection education={education} canEdit={canEdit} />

			<div className="md:px-10">
				<Separator className="my-8" />
			</div>

			<ExperienceSection
				experience={experience}
				canEdit={canEdit}
				onUpdate={handleExperienceUpdate}
			/>
		</div>
	);
};

export default WorkEducationSection;
