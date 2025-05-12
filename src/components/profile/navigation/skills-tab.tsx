import type React from "react";
import DepartmentSection from "@/components/profile/sections/department";
import SkillsSection from "@/components/profile/sections/skills";
import LanguagesSection from "@/components/profile/sections/languages";
import type { Skill, LanguageProficiency } from "@/types/profile";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";

interface SkillsTabProps {
	skills: Skill[];
	languages: LanguageProficiency[];
	department?: string;
	onUpdate: (
		skills: Skill[],
		languages: LanguageProficiency[],
		department?: string,
	) => void;
	onUpdateLanguage?: (
		languageId: number,
		language: string,
		proficiencyLevel: number,
	) => Promise<boolean>;
	onDeleteLanguage?: (languageId: number) => Promise<boolean>;
}

const SkillsTab: React.FC<SkillsTabProps> = ({
	skills,
	languages: initialLanguages,
	department,
	onUpdate,
	onUpdateLanguage,
	onDeleteLanguage,
}) => {
	const [languages, setLanguages] =
		useState<LanguageProficiency[]>(initialLanguages);

	useEffect(() => {
		setLanguages(initialLanguages);
	}, [initialLanguages]);

	const handleUpdateSkills = async (
		updatedSkills: Skill[],
	): Promise<boolean> => {
		try {
			onUpdate(updatedSkills, languages, department);
			return true;
		} catch (error) {
			console.error("Error updating skills:", error);
			return false;
		}
	};

	const handleDepartmentChange = (newDepartment: string | undefined) => {
		onUpdate(skills, languages, newDepartment);
	};

	const handleLanguagesUpdate = useCallback(
		(updatedLanguages: LanguageProficiency[]): Promise<boolean> => {
			setLanguages(updatedLanguages);
			onUpdate(skills, updatedLanguages, department);
			return Promise.resolve(true);
		},
		[onUpdate, skills, department],
	);

	return (
		<>
			<h1 className="text-2xl font-bold text-primary-base mb-6">Skills</h1>

			<DepartmentSection
				department={department}
				canEdit={true}
				onUpdate={handleDepartmentChange}
			/>

			<div className="md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div>

			<SkillsSection
				skills={skills}
				canEdit={true}
				onUpdate={handleUpdateSkills}
			/>

			<div className="md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div>

			<LanguagesSection
				languages={languages}
				canEdit={true}
				onUpdate={handleLanguagesUpdate}
				onUpdateLanguage={onUpdateLanguage}
				onDeleteLanguage={onDeleteLanguage}
			/>

			<ProfileNavigationButtons />
		</>
	);
};

export default SkillsTab;
