"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import {
	PersonalInfoTab,
	WorkEducationTab,
	DocumentsTab,
} from "@/components/profile/navigation";
import SkillsTab from "@/components/profile/navigation/skills-tab";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { showToast } from "@/services/toast";
import type { Skill } from "@/types/profile";

export default function ProfileContent() {
	const pathname = usePathname();
	const [welcomeDismissed, setWelcomeDismissed] = useState(false);

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
		updateLanguage,
		deleteLanguageById,
		addLanguage,
	} = useProfile({
		userType: "applicant",
	});

	useEffect(() => {
		const hasBeenDismissed =
			localStorage.getItem("welcomeDismissed") === "true";
		if (hasBeenDismissed) {
			setWelcomeDismissed(true);
		}
	}, []);

	const dismissWelcome = () => {
		setWelcomeDismissed(true);
		localStorage.setItem("welcomeDismissed", "true");
	};

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

	const isNewUser = () => {
		if (!profileData) return false;
		const emptyAddress =
			!profileData.addressInfo.country && !profileData.addressInfo.city;
		const noEducation = profileData.education.length === 0;
		const noExperience = profileData.experience.length === 0;
		const noSkills = profileData.skills.length === 0;

		return emptyAddress && noEducation && noExperience && noSkills;
	};

	const handleSkillsAndLanguagesUpdate = async (skills: Skill[]) => {
		try {
			await updateSkills(skills);

			// showToast({
			// 	title: "Skills updated successfully",
			// 	variant: "success",
			// });

			return true;
		} catch (error) {
			console.error("Error updating skills:", error);
			showToast({
				title: "Failed to update skills",
				variant: "error",
			});
			return false;
		}
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
					{error ? String(error) : "Profile Not Found"}
				</h2>
			</div>
		);
	}

	if (isNewUser() && activeSection === "profile" && !welcomeDismissed) {
		return (
			<div className="bg-white rounded-lg p-6 md:px-10 shadow-sm w-full mx-auto">
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto relative">
					<button
						type="button"
						onClick={dismissWelcome}
						className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-blue-100"
						aria-label="Dismiss welcome message"
					>
						<X size={18} />
					</button>

					<h2 className="text-xl font-semibold text-blue-700 mb-3">
						Welcome to Grow Rwanda!
					</h2>
					<p className="mb-4">
						Thank you for registering. To make the most of your profile and
						improve your chances of being discovered, please complete your
						profile information:
					</p>
					<ul className="list-disc pl-5 space-y-2">
						<li>Add your personal and address information</li>
						<li>Add your skills and language proficiencies</li>
						<li>Include your education and work experience</li>
						<li>Upload your resume and portfolio links</li>
					</ul>
					{/* <div className="flex justify-center">
						<Button asChild>
							<Link href="/applicant" className="flex items-center">
								Start by adding your address information{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div> */}
				</div>

				<PersonalInfoTab
					personalInfo={profileData.personalInfo}
					addressInfo={profileData.addressInfo}
					avatarSrc={profileData.avatarSrc}
					locationLabel={getLocationLabel()}
					onPersonalInfoUpdate={updatePersonalInfo}
					onAddressUpdate={updateAddress}
					onAvatarChange={(file) => uploadFile("avatar", file)}
				/>
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
					skills={profileData.skills}
					languages={profileData.languages}
					department={profileData.department}
					onUpdate={handleSkillsAndLanguagesUpdate}
					onUpdateLanguage={updateLanguage}
					onDeleteLanguage={deleteLanguageById}
					onAddLanguage={addLanguage}
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
