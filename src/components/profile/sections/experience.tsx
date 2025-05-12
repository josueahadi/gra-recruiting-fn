import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import ExperienceForm from "./experience/experience-form";
import ExperienceCard from "./experience/experience-card";
import type { WorkExperience } from "@/types/profile";
import { useExperience } from "@/hooks/use-experience";
import { Button } from "@/components/ui/button";
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
			let startDate: string | undefined = undefined;
			let endDate: string | undefined = undefined;
			if (newExperience.duration) {
				const durationParts = newExperience.duration
					.split("-")
					.map((p) => p.trim());
				startDate = durationParts[0];
				const endDateWithParentheses = durationParts[1];
				if (endDateWithParentheses) {
					const endDateStr = endDateWithParentheses.split("(")[0].trim();
					endDate = endDateStr === "Present" ? undefined : endDateStr;
				}
			}

			await addExperience.mutateAsync({
				companyName: newExperience.company,
				jobTitle: newExperience.role,
				employmentType: newExperience.responsibilities,
				country: newExperience.country,
				startDate,
				endDate,
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
		setEditExperience(experience);
	};

	const handleUpdateExperience = async (
		updated: Omit<WorkExperience, "id">,
	) => {
		if (!editExperience?.id) return;
		try {
			let startDate: string | undefined = undefined;
			let endDate: string | undefined = undefined;
			if (updated.duration) {
				const durationParts = updated.duration.split("-").map((p) => p.trim());
				startDate = durationParts[0];
				const endDateWithParentheses = durationParts[1];
				if (endDateWithParentheses) {
					const endDateStr = endDateWithParentheses.split("(")[0].trim();
					endDate = endDateStr === "Present" ? undefined : endDateStr;
				}
			}

			await updateExperience.mutateAsync({
				id: Number(editExperience.id),
				data: {
					companyName: updated.company,
					jobTitle: updated.role,
					employmentType: updated.responsibilities,
					country: updated.country,
					startDate,
					endDate,
				},
			});
			setEditExperience(null);
		} catch (error) {
			console.error("Error updating experience:", error);
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
