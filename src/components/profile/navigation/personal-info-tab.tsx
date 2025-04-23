"use client";

import type React from "react";
import { useState } from "react";
import { PersonalInfoSection, AddressSection } from "@/components/profile";
// import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
	personalInfo,
	addressInfo,
	avatarSrc,
	locationLabel,
	onPersonalInfoUpdate,
	onAddressUpdate,
	onAvatarChange,
}) => {
	const [showInfoAlert, setShowInfoAlert] = useState(true);

	return (
		<>
			<h1 className="text-2xl font-bold text-primary-base mb-6">
				User Profile
			</h1>

			{showInfoAlert && (
				<div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-sm text-blue-700 flex items-center justify-between">
					<div>
						Personal and address information is saved separately but both are
						required by our system. Please ensure both sections are complete and
						accurate.
					</div>
					<Button
						variant="link"
						onClick={() => setShowInfoAlert(false)}
						className="text-xs ml-2"
					>
						Dismiss
					</Button>
				</div>
			)}

			<PersonalInfoSection
				personalInfo={personalInfo}
				avatarSrc={avatarSrc}
				locationLabel={locationLabel}
				canEdit={true}
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
