import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import ExperienceForm from "./experience/experience-form";
import ExperienceCard from "./experience/experience-card";
import type { WorkExperience } from "@/hooks/use-profile";
import { useExperience } from "@/hooks/use-experience";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import type { EmploymentType } from "@/types/education-experience";

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
	const { addExperience, deleteExperience } = useExperience();

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

	// Map from display names to API enum values
	const employmentTypeMap: Record<string, EmploymentType> = {
		"Full-time": "FULL_TIME",
		"Part-time": "PART_TIME",
		Contract: "CONTRACT",
		Internship: "INTERNSHIP",
		Freelance: "FREELANCE",
	};

	// Convert from WorkExperience to Experience type expected by the API
	const handleAddExperience = async (
		newExperience: Omit<WorkExperience, "id">,
	) => {
		try {
			// Map WorkExperience to Experience type
			const { company, role, duration, responsibilities, country } =
				newExperience;

			// Parse dates from duration string if possible
			const durationParts = duration.split("-").map((p) => p.trim());
			const startDate = durationParts[0] || new Date().toISOString();
			const endDate = durationParts.length > 1 ? durationParts[1] : "";

			// Convert employment type from responsibilities
			const employmentType = employmentTypeMap[responsibilities] || "FULL_TIME";

			await addExperience.mutateAsync({
				companyName: company,
				jobTitle: role,
				employmentType,
				country: country || "Rwanda",
				startDate,
				endDate: endDate === "Present" ? "" : endDate,
			});
		} catch (error) {
			console.error("Error adding experience:", error);
		}
	};

	const handleRemoveExperience = async (id: string) => {
		try {
			await deleteExperience.mutateAsync(id);
		} catch (error) {
			console.error("Error removing experience:", error);
		}
	};

	const isLoading = addExperience.isPending || deleteExperience.isPending;

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
		</>
	);
};

export default ExperienceSection;
