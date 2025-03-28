import type React from "react";
import { useState } from "react";
import {
	ProfileInfoSection,
	ProfileField,
	type AddressInfo,
} from "@/components/profile/core/components";

interface AddressSectionProps {
	addressInfo: AddressInfo;
	userType: "applicant" | "admin";
	onSave?: (updatedInfo: AddressInfo) => void;
}

/**
 * Reusable address section component that works for both applicant and admin views
 */
const AddressSection: React.FC<AddressSectionProps> = ({
	addressInfo: initialAddressInfo,
	userType,
	onSave,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [addressInfo, setAddressInfo] =
		useState<AddressInfo>(initialAddressInfo);

	const canEdit = userType === "applicant";

	const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAddressInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		setIsEditing(false);
		if (onSave) {
			onSave(addressInfo);
		}
	};

	return (
		<ProfileInfoSection
			title="Address"
			canEdit={canEdit}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8">
				<ProfileField
					label="Country"
					value={addressInfo.country}
					isEditing={isEditing}
					name="country"
					onChange={handleInfoChange}
				/>

				<ProfileField
					label="City/State"
					value={addressInfo.city}
					isEditing={isEditing}
					name="city"
					onChange={handleInfoChange}
				/>

				<ProfileField
					label="Postal Code"
					value={addressInfo.postalCode}
					isEditing={isEditing}
					name="postalCode"
					onChange={handleInfoChange}
				/>

				<ProfileField
					label="Street No"
					value={addressInfo.address}
					isEditing={isEditing}
					name="address"
					onChange={handleInfoChange}
				/>
			</div>
		</ProfileInfoSection>
	);
};

export default AddressSection;
