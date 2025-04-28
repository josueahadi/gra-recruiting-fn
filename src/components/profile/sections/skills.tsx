import type React from "react";
import { useState, useCallback } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import type { Skill } from "@/hooks/use-profile";
import SkillsInput from "./skills/skills-input";
import SkillsDisplay from "./skills/skills-display";
import { showToast } from "@/services/toast";

interface SkillsSectionProps {
	skills: Skill[];
	canEdit: boolean;
	onUpdate: (skills: Skill[]) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
	skills: initialSkills,
	canEdit,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [skills, setSkills] = useState<Skill[]>(initialSkills || []);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleEdit = useCallback(() => {
		setIsEditing(true);
	}, []);

	const handleSave = useCallback(async () => {
		try {
			setIsSubmitting(true);

			setIsEditing(false);

			await onUpdate(skills);

			showToast({
				title: "Skills updated successfully",
				variant: "success",
			});
		} catch (error) {
			setIsEditing(true);
			setSkills(initialSkills);
			showToast({
				title: "Failed to update skills. Please try again.",
				variant: "error",
			});
			console.error("Error updating skills:", error);
		} finally {
			setIsSubmitting(false);
		}
	}, [skills, onUpdate, initialSkills]);

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setSkills(initialSkills);
	}, [initialSkills]);

	const generateUniqueId = useCallback(() => {
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).substring(2, 9);
		return `skill-${timestamp}-${randomStr}`;
	}, []);

	const handleAddSkill = useCallback(
		(skillName: string) => {
			if (
				skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())
			) {
				showToast({
					title: "This skill already exists",
					variant: "error",
				});
				return;
			}

			let newId = generateUniqueId();
			while (skills.some((s) => s.id === newId)) {
				newId = generateUniqueId();
			}

			setSkills((prevSkills) => [
				...prevSkills,
				{ id: newId, name: skillName },
			]);
		},
		[skills, generateUniqueId],
	);

	const handleRemoveSkill = useCallback((id: string) => {
		setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));
	}, []);

	return (
		<ProfileSection
			title="Skills"
			canEdit={canEdit}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
			isSubmitting={isSubmitting}
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
