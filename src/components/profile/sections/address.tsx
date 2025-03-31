import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import { Input } from "@/components/ui/input";
import type { AddressInfo } from "@/hooks/use-profile";
import { Separator } from "@/components/ui/separator";

interface AddressSectionProps {
	addressInfo: AddressInfo;
	canEdit: boolean;
	onAddressUpdate: (info: AddressInfo) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
	addressInfo: initialAddress,
	canEdit,
	onAddressUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [addressInfo, setAddressInfo] = useState<AddressInfo>(initialAddress);

	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAddressInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		onAddressUpdate(addressInfo);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setAddressInfo(initialAddress); // Reset to the original data
	};

	return (
		<>
			<div className="md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div>
			<ProfileSection
				title="Address"
				canEdit={canEdit}
				isEditing={isEditing}
				onEdit={handleEdit}
				onSave={handleSave}
				onCancel={handleCancel}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8 md:px-4">
					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Country
						</h3>
						{isEditing ? (
							<Input
								name="country"
								value={addressInfo.country}
								onChange={handleAddressChange}
								className="mt-1"
							/>
						) : (
							<p className="font-normal">{addressInfo.country}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							City/State
						</h3>
						{isEditing ? (
							<Input
								name="city"
								value={addressInfo.city}
								onChange={handleAddressChange}
								className="mt-1"
							/>
						) : (
							<p className="font-normal">{addressInfo.city}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Postal Code
						</h3>
						{isEditing ? (
							<Input
								name="postalCode"
								value={addressInfo.postalCode}
								onChange={handleAddressChange}
								className="mt-1"
							/>
						) : (
							<p className="font-normal">{addressInfo.postalCode}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm md:text-base text-custom-darkGray font-semibold mb-1">
							Street Address
						</h3>
						{isEditing ? (
							<Input
								name="address"
								value={addressInfo.address}
								onChange={handleAddressChange}
								className="mt-1"
							/>
						) : (
							<p className="font-normal">{addressInfo.address}</p>
						)}
					</div>
				</div>
			</ProfileSection>
		</>
	);
};

export default AddressSection;
