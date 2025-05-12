import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import EducationForm from "./education/education-form";
import EducationCard from "./education/education-card";
import type { Education } from "@/types/education-experience";
import { useEducation } from "@/hooks/use-education";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import Modal from "@/components/common/modal";

interface EducationSectionProps {
	education: Education[];
	canEdit: boolean;
}

const EducationSection: React.FC<EducationSectionProps> = ({
	education: initialEducation,
	canEdit,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editEducation, setEditEducation] = useState<Education | null>(null);
	const { addEducation, updateEducation, deleteEducation } = useEducation();

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSaveChanges = () => {
		setIsEditing(false);
	};

	const handleAddEducation = async (newEducation: Omit<Education, "id">) => {
		try {
			await addEducation.mutateAsync(newEducation);
		} catch (error) {
			console.error("Error adding education:", error);
		}
	};

	const handleRemoveEducation = async (id: string) => {
		try {
			const numId = Number(id);
			if (!Number.isNaN(numId)) {
				await deleteEducation.mutateAsync(numId);
			}
		} catch (error) {
			console.error("Error removing education:", error);
		}
	};

	const handleEditEducation = (education: Education) => {
		setEditEducation(education);
	};

	const handleUpdateEducation = async (updated: Omit<Education, "id">) => {
		if (!editEducation?.id) return;
		try {
			await updateEducation.mutateAsync({
				id: Number(editEducation.id),
				data: updated,
			});
			setEditEducation(null);
		} catch (error) {
			console.error("Error updating education:", error);
		}
	};

	const isLoading =
		addEducation.isPending ||
		deleteEducation.isPending ||
		updateEducation.isPending;

	return (
		<>
			<ProfileSection
				title="Education"
				canEdit={canEdit}
				isEditing={isEditing}
				onEdit={handleEdit}
				onCancel={handleCancel}
				isSubmitting={isLoading}
				customActions={
					isEditing && (
						<div className="flex justify-end space-x-4">
							<Button
								variant="outline"
								onClick={handleCancel}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveChanges}
								className="bg-primary-base hover:bg-custom-skyBlue text-white"
								disabled={isLoading}
							>
								<Save className="h-4 w-4 mr-2" />
								Apply Changes
							</Button>
						</div>
					)
				}
			>
				<div className="space-y-6">
					<div className="space-y-2">
						{initialEducation.length > 0 ? (
							initialEducation.map((edu) => (
								<EducationCard
									key={edu.id}
									education={edu}
									onRemove={handleRemoveEducation}
									canEdit={isEditing}
									onEdit={handleEditEducation}
								/>
							))
						) : (
							<p className="text-gray-500 italic py-2">
								No education history added yet.
							</p>
						)}
					</div>

					{isEditing && (
						<div className="mt-6 p-4 border border-dashed rounded-md">
							<h3 className="text-lg font-medium mb-4">Add Education</h3>
							<EducationForm
								onAddEducation={handleAddEducation}
								isSubmitting={addEducation.isPending}
							/>
						</div>
					)}
				</div>
			</ProfileSection>

			<div className="mt-4 flex justify-end">
				{!isEditing && canEdit && (
					<Button onClick={handleEdit} variant="outline" className="mr-2">
						Add Education
					</Button>
				)}
			</div>

			<Modal
				open={!!editEducation}
				onClose={() => setEditEducation(null)}
				title="Edit Education"
			>
				{editEducation && (
					<EducationForm
						initialData={editEducation}
						onAddEducation={handleUpdateEducation}
						isSubmitting={updateEducation.isPending}
						isEdit
						onCancel={() => setEditEducation(null)}
					/>
				)}
			</Modal>
		</>
	);
};

export default EducationSection;
