import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import type { Skill } from "@/hooks/use-profile";
import SkillsInput from "./skills/skills-input";
import SkillsDisplay from "./skills/skills-display";

interface SkillsSectionProps {
	skills: Skill[]; // Combined skills array
	canEdit: boolean;
	onUpdate: (skills: Skill[]) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
	skills: initialSkills,
	canEdit,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [skills, setSkills] = useState<Skill[]>(initialSkills);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		onUpdate(skills);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setSkills(initialSkills);
	};

	const handleAddSkill = (skillName: string) => {
		setSkills([...skills, { id: Date.now().toString(), name: skillName }]);
	};

	const handleRemoveSkill = (id: string) => {
		setSkills(skills.filter((skill) => skill.id !== id));
	};

	return (
		<ProfileSection
			title="Skills"
			canEdit={canEdit}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="md:px-4">
				{isEditing ? (
					<SkillsInput
						skills={skills}
						onAddSkill={handleAddSkill}
						onRemoveSkill={handleRemoveSkill}
						title=""
						placeholder="Enter Skill"
					/>
				) : (
					<SkillsDisplay
						skills={skills}
						title=""
						emptyMessage="No skills added yet"
					/>
				)}
			</div>
		</ProfileSection>
	);
};

export default SkillsSection;
