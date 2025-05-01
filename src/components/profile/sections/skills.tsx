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
	onUpdate: (skills: Skill[]) => Promise<boolean>;
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

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setSkills(initialSkills);
	}, [initialSkills]);

	// Save changes (batch update)
	const handleSave = useCallback(async () => {
		if (skills.length > 20) {
			showToast({
				title: "Too many skills. Maximum 20 allowed.",
				variant: "error",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const success = await onUpdate(skills);

			if (success) {
				setIsEditing(false);
				showToast({
					title: "Skills updated successfully",
					variant: "success",
				});
			} else {
				throw new Error("Failed to update skills");
			}
		} catch (error) {
			console.error("Error updating skills:", error);
			setSkills(initialSkills);

			showToast({
				title: "Failed to update skills. Please try again.",
				variant: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	}, [skills, onUpdate, initialSkills]);

	// Handle skills changes from direct API component
	const handleSkillsChange = useCallback((updatedSkills: Skill[]) => {
		setSkills(updatedSkills);
	}, []);

	return (
		<ProfileSection
			title="Skills"
			canEdit={canEdit}
			isEditing={isEditing}
			isSubmitting={isSubmitting}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="md:px-4">
				{isEditing ? (
					<SkillsInput
						skills={skills}
						onSkillsChange={handleSkillsChange}
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
