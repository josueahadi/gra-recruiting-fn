import type React from "react";
import DepartmentSection from "@/components/profile/sections/department";
import SkillsSection from "@/components/profile/sections/skills";
import LanguagesSection from "@/components/profile/sections/languages";
import type { Skill, LanguageProficiency } from "@/types/profile";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";

interface SkillsTabProps {
	technicalSkills: Skill[];
	softSkills: Skill[];
	languages: LanguageProficiency[];
	department?: string;
	onUpdate: (data: {
		technical: Skill[];
		soft: Skill[];
		languages: LanguageProficiency[];
		department?: string;
	}) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({
	technicalSkills,
	softSkills,
	languages: initialLanguages,
	department,
	onUpdate,
}) => {
	// Keep a local copy of languages that will be updated by direct API calls
	const [languages, setLanguages] =
		useState<LanguageProficiency[]>(initialLanguages);

	// Sync languages with prop changes
	useEffect(() => {
		setLanguages(initialLanguages);
	}, [initialLanguages]);

	const handleUpdateSkills = async (skills: Skill[]): Promise<boolean> => {
		try {
			onUpdate({
				technical: skills,
				soft: softSkills,
				languages,
				department,
			});
			return true;
		} catch (error) {
			console.error("Error updating skills:", error);
			return false;
		}
	};

	const handleDepartmentChange = (newDepartment: string | undefined) => {
		onUpdate({
			technical: technicalSkills,
			soft: softSkills,
			languages,
			department: newDepartment,
		});
	};

	// This is now just for syncing the local state - API calls happen in the language component
	const handleLanguagesUpdate = useCallback(
		(updatedLanguages: LanguageProficiency[]): Promise<boolean> => {
			setLanguages(updatedLanguages);
			return Promise.resolve(true);
		},
		[],
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
				skills={technicalSkills}
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
			/>

			<ProfileNavigationButtons />
		</>
	);
};

export default SkillsTab;
