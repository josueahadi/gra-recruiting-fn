"use client";

import type React from "react";
import type { Education, WorkExperience } from "@/hooks/use-profile";
import WorkEducationSection from "@/components/profile/sections/work-education";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";

interface WorkEducationTabProps {
	education: Education[];
	experience: WorkExperience[];
	onUpdate: (data: {
		education: Education[];
		experience: WorkExperience[];
	}) => void;
}

/**
 * Component for Work & Education tab in applicant view
 */
const WorkEducationTab: React.FC<WorkEducationTabProps> = ({
	education,
	experience,
	onUpdate,
}) => {
	return (
		<>
			<h1 className="text-2xl font-bold text-primary-base mb-6">
				Work & Education
			</h1>

			<WorkEducationSection
				education={education}
				experience={experience}
				canEdit={true}
				onUpdate={onUpdate}
			/>

			<ProfileNavigationButtons />
		</>
	);
};

export default WorkEducationTab;
