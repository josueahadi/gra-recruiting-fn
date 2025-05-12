/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PersonalInfoSection from "../sections/personal-info";
import AddressSection from "../sections/address";
import DepartmentSection from "@/components/profile/sections/department";
import SkillsSection from "@/components/profile/sections/skills";
import LanguagesSection from "@/components/profile/sections/languages";
import { WorkEducationSection } from "@/components/profile";
import DocumentsSection from "../sections/documents";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/profile";

interface ProfileContainerProps {
	userId?: string;
	userType: "applicant" | "admin";
	onNavigateBack?: () => void;
	wrapperClassName?: string;
	contentClassName?: string;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
	userId,
	userType,
	onNavigateBack,
	wrapperClassName,
	contentClassName,
}) => {
	// Use the shared hook to manage profile data
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
		canEdit,
		updateLanguage,
		deleteLanguage,
	} = useProfile({
		id: userId,
		userType,
	});

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
					{error ? String(error) : "Profile Not Found"}
				</h2>
				{onNavigateBack && (
					<Button onClick={onNavigateBack} variant="outline">
						Go Back
					</Button>
				)}
			</div>
		);
	}

	const handleDepartmentUpdate = (department?: string) => {
		// If you want to update department, do it via a separate API call or handler.
		// updateSkills should only update skills.
		// For now, do nothing or implement department update logic if needed.
	};

	const handleSkillsUpdate = async (skills: Skill[]): Promise<boolean> => {
		try {
			updateSkills(skills);
			return true;
		} catch (error) {
			console.error("Error updating skills:", error);
			return false;
		}
	};

	const handleDeleteLanguageById = (languageId: number) => {
		if (!profileData) return Promise.resolve(false);
		const lang = profileData.languages.find((l) => l.languageId === languageId);
		if (!lang) return Promise.resolve(false);
		return deleteLanguage(lang.language);
	};

	return (
		<div className={cn("", wrapperClassName)}>
			{userType === "admin" && onNavigateBack && (
				<div className="flex items-center mb-4">
					<Button variant="ghost" onClick={onNavigateBack} size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Applicants
					</Button>
				</div>
			)}

			<div
				className={`bg-white rounded-lg p-6 md:px-10 shadow-md ${contentClassName}`}
			>
				<h1 className="text-2xl font-bold text-primary-base mb-6">
					{userType === "admin" ? "Applicant Profile" : "User Profile"}
				</h1>

				<PersonalInfoSection
					personalInfo={profileData.personalInfo}
					avatarSrc={profileData.avatarSrc}
					locationLabel={getLocationLabel()}
					canEdit={canEdit}
					onInfoUpdate={updatePersonalInfo}
					onAvatarChange={(file) => uploadFile("avatar", file)}
				/>

				<AddressSection
					addressInfo={profileData.addressInfo}
					canEdit={canEdit}
					onAddressUpdate={updateAddress}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				<DepartmentSection
					department={profileData.department}
					canEdit={canEdit}
					onUpdate={handleDepartmentUpdate}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				<SkillsSection
					skills={profileData.skills}
					canEdit={canEdit}
					onUpdate={handleSkillsUpdate}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				<LanguagesSection
					languages={profileData.languages || []}
					canEdit={canEdit}
					onUpdateLanguage={updateLanguage}
					onDeleteLanguage={handleDeleteLanguageById}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				<WorkEducationSection
					education={profileData.education}
					experience={profileData.experience}
					canEdit={canEdit}
					onUpdate={({ education, experience }) =>
						updateWorkEducation({ education, experience })
					}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				<DocumentsSection
					resume={profileData.documents.resume}
					samples={profileData.documents.samples}
					portfolioLinks={profileData.portfolioLinks}
					canEdit={canEdit}
					onFileUpload={uploadFile}
					onFileRemove={removeDocument}
					onLinksUpdate={updatePortfolioLinks}
				/>
			</div>
		</div>
	);
};

export default ProfileContainer;
