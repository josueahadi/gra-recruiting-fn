// File: components/profile/sections/applicant/PersonalInfoTab.tsx
"use client";

import type React from "react";
import { PersonalInfoSection, AddressSection } from "@/components/profile";
// import { Separator } from "@/components/ui/separator";
import type { ProfileInfo, AddressInfo } from "@/hooks/use-profile";
import ProfileNavigationButtons from "./profile-nav-buttons";

interface PersonalInfoTabProps {
	personalInfo: ProfileInfo;
	addressInfo: AddressInfo;
	avatarSrc?: string;
	locationLabel?: string;
	onPersonalInfoUpdate: (info: ProfileInfo) => void;
	onAddressUpdate: (info: AddressInfo) => void;
	onAvatarChange: (file: File) => void;
}

/**
 * Combined component for Personal Info tab in applicant view
 * Contains both personal info and address sections
 */
const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
	personalInfo,
	addressInfo,
	avatarSrc,
	locationLabel,
	onPersonalInfoUpdate,
	onAddressUpdate,
	onAvatarChange,
}) => {
	return (
		<>
			<h1 className="text-2xl font-bold text-primary-base mb-6">
				User Profile
			</h1>

			<PersonalInfoSection
				personalInfo={personalInfo}
				avatarSrc={avatarSrc}
				locationLabel={locationLabel}
				canEdit={true} // Applicants can always edit their own profile
				onInfoUpdate={onPersonalInfoUpdate}
				onAvatarChange={onAvatarChange}
			/>

			{/* <div className="px-4 md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div> */}
			<AddressSection
				addressInfo={addressInfo}
				canEdit={true}
				onAddressUpdate={onAddressUpdate}
			/>

			<ProfileNavigationButtons />
		</>
	);
};

export default PersonalInfoTab;
