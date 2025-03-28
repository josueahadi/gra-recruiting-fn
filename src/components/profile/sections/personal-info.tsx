import type React from "react";
import { useState } from "react";
import {
	ProfileInfoSection,
	ProfileField,
	ProfileAvatar,
	type PersonalInfo,
} from "@/components/profile/core/components";

interface PersonalInfoSectionProps {
	personalInfo: PersonalInfo;
	avatarSrc?: string;
	userType: "applicant" | "admin";
	onSave?: (updatedInfo: PersonalInfo) => void;
	onAvatarChange?: (file: File) => void;
	locationLabel?: string;
}

/**
 * Reusable personal information section that works for both applicant and admin views
 */
const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
	personalInfo: initialPersonalInfo,
	avatarSrc,
	userType,
	onSave,
	onAvatarChange,
	locationLabel,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [personalInfo, setPersonalInfo] =
		useState<PersonalInfo>(initialPersonalInfo);
	const [isUploading, setIsUploading] = useState(false);

	const canEdit = userType === "applicant";

	const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPersonalInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		setIsEditing(false);
		if (onSave) {
			onSave(personalInfo);
		}
	};

	const handleAvatarUpload = (file: File) => {
		setIsUploading(true);
		if (onAvatarChange) {
			onAvatarChange(file);
			// In a real implementation, this would happen after upload completes
			setTimeout(() => setIsUploading(false), 1000);
		} else {
			setIsUploading(false);
		}
	};

	// User profile top section with avatar and name
	const profileHeader = (
		<div className="flex flex-col items-center md:flex-row md:gap-6 mb-6">
			<ProfileAvatar
				avatarSrc={avatarSrc}
				firstName={personalInfo.firstName}
				lastName={personalInfo.lastName}
				canEdit={canEdit}
				onAvatarChange={handleAvatarUpload}
				isUploading={isUploading}
			/>

			<div className="text-center md:text-left">
				<h2 className="text-xl font-semibold">
					{personalInfo.firstName} {personalInfo.lastName}
				</h2>
				{locationLabel && (
					<p className="text-custom-darkGray font-regular text-base">
						{locationLabel}
					</p>
				)}
			</div>
		</div>
	);

	return (
		<>
			{profileHeader}

			<ProfileInfoSection
				title="Personal Information"
				canEdit={canEdit}
				isEditing={isEditing}
				onEdit={() => setIsEditing(true)}
				onSave={handleSave}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8">
					<ProfileField
						label="First Name"
						value={personalInfo.firstName}
						isEditing={isEditing}
						name="firstName"
						onChange={handleInfoChange}
					/>

					<ProfileField
						label="Last Name"
						value={personalInfo.lastName}
						isEditing={isEditing}
						name="lastName"
						onChange={handleInfoChange}
					/>

					<ProfileField
						label="Email Address"
						value={personalInfo.email}
						isEditing={isEditing}
						name="email"
						onChange={handleInfoChange}
						type="email"
					/>

					<ProfileField
						label="Phone Number"
						value={personalInfo.phone}
						isEditing={isEditing}
						name="phone"
						onChange={handleInfoChange}
						type="tel"
					/>

					<ProfileField
						label="Bio"
						value={personalInfo.bio}
						isEditing={isEditing}
						name="bio"
						onChange={handleInfoChange}
						className="md:col-span-2"
					/>
				</div>
			</ProfileInfoSection>
		</>
	);
};

export default PersonalInfoSection;
