import type React from "react";
import DepartmentSection from "@/components/profile/sections/department";
import SkillsSection from "@/components/profile/sections/skills";
import LanguagesSection from "@/components/profile/sections/languages";
import type { Skill, LanguageProficiency } from "@/hooks/use-profile";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/hooks/use-profile";

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
	languages,
	department,
	onUpdate,
}) => {
	const { addLanguage, updateLanguage, deleteLanguage } = useProfile({
		userType: "applicant",
	});

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

	const handleUpdateSoftSkills = async (skills: Skill[]): Promise<boolean> => {
		try {
			onUpdate({
				technical: technicalSkills,
				soft: skills,
				languages,
				department,
			});
			return true;
		} catch (error) {
			console.error("Error updating soft skills:", error);
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

	const handleLanguagesUpdate = (updatedLanguages: LanguageProficiency[]) => {
		onUpdate({
			technical: technicalSkills,
			soft: softSkills,
			languages: updatedLanguages,
			department,
		});
	};

	const handleDeleteLanguage = async (
		languageName: string,
	): Promise<boolean> => {
		try {
			return await deleteLanguage(languageName);
		} catch (error) {
			console.error("Error in handleDeleteLanguage:", error);
			return false;
		}
	};

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

			<LanguagesSection languages={languages} canEdit={true} />

			<ProfileNavigationButtons />
		</>
	);
};

export default SkillsTab;
