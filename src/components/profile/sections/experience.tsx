import type React from "react";
import { useState } from "react";
import { useExperience } from "@/hooks/use-experience";
import { Button } from "@/components/ui/button";
import ProfileSection from "@/components/profile/core/profile-section";
import ExperienceForm from "./experience/experience-form";
import ExperienceCard from "./experience/experience-card";
import type { WorkExperience } from "@/types/profile";
import { Save } from "lucide-react";
import Modal from "@/components/common/modal";

interface ExperienceSectionProps {
	experience: WorkExperience[];
	canEdit: boolean;
	onUpdate?: (experience: WorkExperience[]) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
	experience: initialExperience,
	canEdit,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editExperience, setEditExperience] = useState<WorkExperience | null>(
		null,
	);
	const { addExperience, updateExperience, deleteExperience } = useExperience();

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSaveChanges = () => {
		setIsEditing(false);
		if (onUpdate) {
			onUpdate(initialExperience);
		}
	};

	const handleAddExperience = async (
		newExperience: Omit<WorkExperience, "id">,
	) => {
		try {
			await addExperience.mutateAsync({
				companyName: newExperience.companyName,
				jobTitle: newExperience.jobTitle,
				employmentType: newExperience.employmentType,
				country: newExperience.country,
				startDate: newExperience.startDate,
				endDate: newExperience.endDate,
			});
		} catch (error) {
			console.error("Error adding experience:", error);
		}
	};

	const handleRemoveExperience = async (id: string) => {
		try {
			const numId = Number(id);
			if (!Number.isNaN(numId)) {
				await deleteExperience.mutateAsync(numId);
			}
		} catch (error) {
			console.error("Error removing experience:", error);
		}
	};

	const handleEditExperience = (experience: WorkExperience) => {
		console.log(
			"[handleEditExperience] Setting experience for edit:",
			experience,
		);
		setEditExperience(experience);
	};

	const handleUpdateExperience = async (
		updated: Omit<WorkExperience, "id">,
	) => {
		if (!editExperience?.id) {
			console.error(
				"[handleUpdateExperience] No experience ID available for update",
			);
			return;
		}
		console.log(
			"[handleUpdateExperience] Updating experience with ID:",
			editExperience.id,
		);
		console.log("[handleUpdateExperience] Update data:", updated);
		try {
			await updateExperience.mutateAsync({
				id: Number(editExperience.id),
				data: {
					companyName: updated.companyName,
					jobTitle: updated.jobTitle,
					employmentType: updated.employmentType,
					country: updated.country,
					startDate: updated.startDate,
					endDate: updated.endDate,
				},
			});
			console.log("[handleUpdateExperience] Experience update successful");
			setEditExperience(null);
		} catch (error) {
			console.error(
				"[handleUpdateExperience] Error updating experience:",
				error,
			);
		}
	};

	const isLoading =
		addExperience.isPending ||
		deleteExperience.isPending ||
		updateExperience.isPending;

	return (
		<>
			<ProfileSection
				title="Work Experience"
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
						{initialExperience.length > 0 ? (
							initialExperience.map((exp) => (
								<ExperienceCard
									key={exp.id}
									experience={exp}
									onRemove={handleRemoveExperience}
									canEdit={isEditing}
									onEdit={handleEditExperience}
								/>
							))
						) : (
							<p className="text-gray-500 italic py-2">
								No work experience added yet.
							</p>
						)}
					</div>

					{isEditing && (
						<div className="mt-6 p-4 border border-dashed rounded-md">
							<h3 className="text-lg font-medium mb-4">Add Work Experience</h3>
							<ExperienceForm
								onAddExperience={handleAddExperience}
								isSubmitting={addExperience.isPending}
							/>
						</div>
					)}
				</div>
			</ProfileSection>

			<div className="mt-4 flex justify-end">
				{!isEditing && canEdit && (
					<Button onClick={handleEdit} variant="outline" className="mr-2">
						Add Work Experience
					</Button>
				)}
			</div>

			<Modal
				open={!!editExperience}
				onClose={() => setEditExperience(null)}
				title="Edit Work Experience"
			>
				{editExperience && (
					<ExperienceForm
						initialData={editExperience}
						onAddExperience={handleUpdateExperience}
						isSubmitting={updateExperience.isPending}
						isEdit
						onCancel={() => setEditExperience(null)}
					/>
				)}
			</Modal>
		</>
	);
};

export default ExperienceSection;
