import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import DepartmentSelector from "@/components/profile/sections/skills/department-selector";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import type { CareerResponse } from "@/types/profile";

interface DepartmentSectionProps {
	department?: string;
	canEdit: boolean;
	onUpdate: (department?: string) => void;
}

const DepartmentSection: React.FC<DepartmentSectionProps> = ({
	department: initialDepartment,
	canEdit,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [department, setDepartment] = useState<string | null>(
		initialDepartment || null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);

		// We're only updating the UI here - the actual API call happens in handleDepartmentChange
		// This is to maintain the existing behavior where onUpdate is called
		onUpdate(department || undefined);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setDepartment(initialDepartment || null);
	};

	const handleDepartmentChange = async (career: CareerResponse) => {
		try {
			setIsSubmitting(true);

			// Make API call to update the user profile with careerId
			await api.patch("/api/v1/users/update-user-profile", {
				careerId: career.id,
			});

			// Update local state
			setDepartment(career.name);

			showToast({
				title: "Department updated",
				description: `Your department has been set to ${career.name}`,
				variant: "success",
			});
		} catch (error) {
			console.error("Error updating department:", error);
			showToast({
				title: "Failed to update department",
				description:
					"There was an error updating your department. Please try again.",
				variant: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ProfileSection
			title="Department"
			canEdit={canEdit}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
			isSubmitting={isSubmitting}
		>
			<div className="md:px-4">
				{isEditing ? (
					<DepartmentSelector
						selectedDepartment={department}
						onChange={handleDepartmentChange}
					/>
				) : department ? (
					<div>
						{/* <h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Department
						</h3> */}
						<p className="font-normal">{department}</p>
					</div>
				) : (
					<p className="text-gray-500 italic">No department selected</p>
				)}
			</div>
		</ProfileSection>
	);
};

export default DepartmentSection;
