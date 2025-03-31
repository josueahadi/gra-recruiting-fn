import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import DepartmentSelector from "./skills/department-selector";

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

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		onUpdate(department || undefined);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setDepartment(initialDepartment || null);
	};

	const handleDepartmentChange = (value: string) => {
		setDepartment(value);
	};

	return (
		<ProfileSection
			title="Department"
			canEdit={canEdit}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
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
