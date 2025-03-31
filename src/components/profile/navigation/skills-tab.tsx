import type React from "react";
import DepartmentSection from "@/components/profile/sections/department";
import SkillsSection from "@/components/profile/sections/skills";
import LanguagesSection from "@/components/profile/sections/languages";
import { Separator } from "@/components/ui/separator";
import type { Skill, LanguageProficiency } from "@/hooks/use-profile";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";

interface SkillsTabProps {
	technicalSkills: Skill[];
	softSkills: Skill[];
	languages: LanguageProficiency[];
	department?: string;
	canEdit?: boolean;
	onUpdate: (data: {
		technical: Skill[];
		soft: Skill[];
		languages: LanguageProficiency[];
		department?: string;
	}) => void;
}

/**
 * SkillsTab component to be used in the profile navigation
 */
const SkillsTab: React.FC<SkillsTabProps> = ({
	technicalSkills = [],
	softSkills = [],
	languages = [],
	department,
	canEdit = true,
	onUpdate,
}) => {
	// Ensure we have arrays and combine them
	const combinedSkills = [
		...(Array.isArray(technicalSkills) ? technicalSkills : []),
		...(Array.isArray(softSkills) ? softSkills : []),
	];

	// Department update handler
	const handleDepartmentUpdate = (updatedDepartment?: string) => {
		onUpdate({
			technical: technicalSkills || [],
			soft: softSkills || [],
			languages: languages || [],
			department: updatedDepartment,
		});
	};

	// Skills update handler
	const handleSkillsUpdate = (updatedSkills: Skill[]) => {
		// All skills are treated as technical skills in this implementation
		onUpdate({
			technical: updatedSkills,
			soft: [], // Keeping this for backward compatibility
			languages: languages || [],
			department,
		});
	};

	// Languages update handler
	const handleLanguagesUpdate = (updatedLanguages: LanguageProficiency[]) => {
		onUpdate({
			technical: technicalSkills || [],
			soft: softSkills || [],
			languages: updatedLanguages,
			department,
		});
	};

	return (
		<>
			<h1 className="text-2xl font-bold text-primary-base mb-6">
				Skills & Competence
			</h1>

			<DepartmentSection
				department={department}
				canEdit={canEdit}
				onUpdate={handleDepartmentUpdate}
			/>

			<div className="md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div>

			<SkillsSection
				skills={combinedSkills}
				canEdit={canEdit}
				onUpdate={handleSkillsUpdate}
			/>

			<div className="md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div>

			<LanguagesSection
				languages={languages || []}
				canEdit={canEdit}
				onUpdate={handleLanguagesUpdate}
			/>

			{/* Navigation buttons */}
			<ProfileNavigationButtons />
		</>
	);
};

export default SkillsTab;
