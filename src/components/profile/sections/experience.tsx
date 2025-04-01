import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import ExperienceForm from "./experience/experience-form";
import ExperienceCard from "./experience/experience-card";
import type { WorkExperience } from "@/hooks/use-profile";

interface ExperienceSectionProps {
	experience: WorkExperience[];
	canEdit: boolean;
	onUpdate: (experience: WorkExperience[]) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
	experience: initialExperience,
	canEdit,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experience, setExperience] = useState<WorkExperience[]>(
		initialExperience || [],
	);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		onUpdate(experience);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setExperience(initialExperience || []);
	};

	const handleAddExperience = (newExperience: Omit<WorkExperience, "id">) => {
		const experienceWithId = {
			...newExperience,
			id: Date.now().toString(),
		};

		setExperience([...experience, experienceWithId]);
	};

	const handleRemoveExperience = (id: string) => {
		setExperience(experience.filter((exp) => exp.id !== id));
	};

	return (
		<ProfileSection
			title="Experience"
			canEdit={canEdit}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="space-y-6">
				{/* Experience List */}
				<div className="space-y-2">
					{experience.length > 0 ? (
						experience.map((exp) => (
							<ExperienceCard
								key={exp.id}
								experience={exp}
								onRemove={handleRemoveExperience}
								canEdit={isEditing}
							/>
						))
					) : (
						<p className="text-gray-500 italic py-2">
							No work experience added yet.
						</p>
					)}
				</div>

				{/* Add Experience Form (only shown when editing) */}
				{isEditing && (
					<div className="mt-6 p-4 border border-dashed rounded-md">
						<h3 className="text-lg font-medium mb-4">Add Experience</h3>
						<ExperienceForm onAddExperience={handleAddExperience} />
					</div>
				)}
			</div>
		</ProfileSection>
	);
};

export default ExperienceSection;
