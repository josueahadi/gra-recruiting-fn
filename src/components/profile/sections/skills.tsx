import type React from "react";
import { useCallback } from "react";
import SkillsDisplay from "./skills/skills-display";
import SkillsInput from "./skills/skills-input";
import type { Skill } from "@/types/profile";

interface SkillsSectionProps {
	skills: Skill[];
	canEdit?: boolean;
	onUpdate: (skills: Skill[]) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
	skills,
	canEdit,
	onUpdate,
}) => {
	const handleSkillsChange = useCallback(
		(updatedSkills: Skill[]) => {
			onUpdate(updatedSkills);
		},
		[onUpdate],
	);

	return (
		<div className="mb-8 md:px-10">
			{canEdit ? (
				<SkillsInput skills={skills} onChange={handleSkillsChange} />
			) : (
				<SkillsDisplay skills={skills} />
			)}
		</div>
	);
};

export default SkillsSection;
