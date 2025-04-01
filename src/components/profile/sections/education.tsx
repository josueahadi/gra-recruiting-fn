import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import EducationForm from "./education/education-form";
import EducationCard from "./education/education-card";
import type { Education } from "@/hooks/use-profile";

interface EducationSectionProps {
	education: Education[];
	canEdit: boolean;
	onUpdate: (education: Education[]) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({
	education: initialEducation,
	canEdit,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [education, setEducation] = useState<Education[]>(
		initialEducation || [],
	);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		onUpdate(education);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEducation(initialEducation || []);
	};

	const handleAddEducation = (newEducation: Omit<Education, "id">) => {
		const educationWithId = {
			...newEducation,
			id: Date.now().toString(),
		};

		setEducation([...education, educationWithId]);
	};

	const handleRemoveEducation = (id: string) => {
		setEducation(education.filter((edu) => edu.id !== id));
	};

	return (
		<ProfileSection
			title="Education"
			canEdit={canEdit}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="space-y-6">
				{/* Education List */}
				<div className="space-y-2">
					{education.length > 0 ? (
						education.map((edu) => (
							<EducationCard
								key={edu.id}
								education={edu}
								onRemove={handleRemoveEducation}
								canEdit={isEditing}
							/>
						))
					) : (
						<p className="text-gray-500 italic py-2">
							No education history added yet.
						</p>
					)}
				</div>

				{/* Add Education Form (only shown when editing) */}
				{isEditing && (
					<div className="mt-6 p-4 border border-dashed rounded-md">
						<h3 className="text-lg font-medium mb-4">Add Education</h3>
						<EducationForm onAddEducation={handleAddEducation} />
					</div>
				)}
			</div>
		</ProfileSection>
	);
};

export default EducationSection;
