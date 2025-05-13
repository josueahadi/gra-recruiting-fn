import type React from "react";
import { useCallback, useEffect, useState } from "react";
import DepartmentSection from "@/components/profile/sections/department";
import SkillsSection from "@/components/profile/sections/skills";
import LanguagesSection from "@/components/profile/sections/languages";
import type { Skill, LanguageProficiency } from "@/types/profile";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";
import { Separator } from "@/components/ui/separator";
import { showToast } from "@/services/toast";

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
	onAddLanguage?: (
		language: string,
		proficiencyLevel: number,
	) => Promise<boolean>;
}

const SkillsTab: React.FC<SkillsTabProps> = ({
	skills: initialSkills,
	languages: initialLanguages,
	department,
	onUpdate,
	onUpdateLanguage,
	onDeleteLanguage,
	onAddLanguage,
}) => {
	const [skills, setSkills] = useState<Skill[]>(initialSkills);
	const [languages, setLanguages] =
		useState<LanguageProficiency[]>(initialLanguages);
	const [, setIsProcessing] = useState(false);

	useEffect(() => {
		setSkills(initialSkills);
		setLanguages(initialLanguages);
	}, [initialSkills, initialLanguages]);

	const handleDepartmentChange = useCallback(
		(newDepartment?: string) => {
			onUpdate(skills, languages, newDepartment);
		},
		[skills, languages, onUpdate],
	);

	const handleSkillsUpdate = useCallback(
		async (updatedSkills: Skill[]): Promise<boolean> => {
			try {
				setIsProcessing(true);
				setSkills(updatedSkills);
				onUpdate(updatedSkills, languages, department);
				return true;
			} catch (error) {
				console.error("Error updating skills:", error);
				showToast({
					title: "Failed to update skills",
					variant: "error",
				});
				return false;
			} finally {
				setIsProcessing(false);
			}
		},
		[languages, department, onUpdate],
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
				onUpdate={handleSkillsUpdate}
			/>

			<div className="md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div>

			<LanguagesSection
				languages={languages}
				canEdit={true}
				onUpdateLanguage={onUpdateLanguage}
				onDeleteLanguage={onDeleteLanguage}
				onAddLanguage={onAddLanguage}
			/>

			<ProfileNavigationButtons />
		</>
	);
};

export default SkillsTab;
