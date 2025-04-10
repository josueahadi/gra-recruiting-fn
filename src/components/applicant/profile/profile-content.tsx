"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import {
	PersonalInfoTab,
	SkillsTab,
	WorkEducationTab,
	DocumentsTab,
} from "@/components/profile/navigation";

export default function ProfileContent() {
	const pathname = usePathname();

	const {
		profileData,
		isLoading,
		error,
		updatePersonalInfo,
		updateAddress,
		updateSkills,
		updateWorkEducation,
		uploadFile,
		removeDocument,
		updatePortfolioLinks,
	} = useProfile({
		userType: "applicant",
	});

	const getActiveSection = () => {
		if (pathname.includes("/skills")) return "skills";
		if (pathname.includes("/education")) return "education";
		if (pathname.includes("/documents")) return "documents";
		return "profile";
	};

	const activeSection = getActiveSection();

	const getLocationLabel = () => {
		if (!profileData) return undefined;

		const { city, country } = profileData.addressInfo;
		return city && country ? `${city}/${country}` : undefined;
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	if (error || !profileData) {
		return (
			<div className="flex flex-col items-center justify-center h-96">
				<h2 className="text-xl font-semibold mb-2">
					{error || "Profile Not Found"}
				</h2>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg p-6 md:px-10 shadow-sm w-full mx-auto">
			{activeSection === "profile" && (
				<PersonalInfoTab
					personalInfo={profileData.personalInfo}
					addressInfo={profileData.addressInfo}
					avatarSrc={profileData.avatarSrc}
					locationLabel={getLocationLabel()}
					onPersonalInfoUpdate={updatePersonalInfo}
					onAddressUpdate={updateAddress}
					onAvatarChange={(file) => uploadFile("avatar", file)}
				/>
			)}

			{activeSection === "skills" && (
				<SkillsTab
					technicalSkills={profileData.skills.technical}
					softSkills={profileData.skills.soft}
					languages={profileData.languages}
					department={profileData.department}
					onUpdate={({ technical, soft, languages, department }) =>
						updateSkills({ technical, soft, languages, department })
					}
				/>
			)}

			{activeSection === "education" && (
				<WorkEducationTab
					education={profileData.education}
					experience={profileData.experience}
					onUpdate={({ education, experience }) =>
						updateWorkEducation({ education, experience })
					}
				/>
			)}

			{activeSection === "documents" && (
				<DocumentsTab
					resume={profileData.documents.resume}
					samples={profileData.documents.samples}
					portfolioLinks={profileData.portfolioLinks}
					onFileUpload={uploadFile}
					onFileRemove={removeDocument}
					onLinksUpdate={updatePortfolioLinks}
				/>
			)}
		</div>
	);
}
