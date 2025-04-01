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

interface ProfileContainerProps {
	userId?: string;
	userType: "applicant" | "admin";
	onNavigateBack?: () => void;
	wrapperClassName?: string;
	contentClassName?: string;
}

/**
 * A container component that handles all profile sections with consistent layout
 * Works for both applicant (self-view) and admin (viewing others) contexts
 */
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
	} = useProfile({
		id: userId,
		userType,
	});

	// Format location label for display
	const getLocationLabel = () => {
		if (!profileData) return undefined;

		const { city, country } = profileData.addressInfo;
		return city && country ? `${city}/${country}` : undefined;
	};

	// Render loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	// Render error state
	if (error || !profileData) {
		return (
			<div className="flex flex-col items-center justify-center h-96">
				<h2 className="text-xl font-semibold mb-2">
					{error || "Profile Not Found"}
				</h2>
				{onNavigateBack && (
					<Button onClick={onNavigateBack} variant="outline">
						Go Back
					</Button>
				)}
			</div>
		);
	}

	// Combine technical and soft skills for the skills section
	const combinedSkills = [
		...(Array.isArray(profileData.skills.technical)
			? profileData.skills.technical
			: []),
		...(Array.isArray(profileData.skills.soft) ? profileData.skills.soft : []),
	];

	// Handlers for skills & competence section updates
	const handleDepartmentUpdate = (department?: string) => {
		updateSkills({
			technical: profileData.skills.technical || [],
			soft: profileData.skills.soft || [],
			languages: profileData.languages || [],
			department,
		});
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleSkillsUpdate = (skills: any[]) => {
		updateSkills({
			technical: skills,
			soft: [],
			languages: profileData.languages || [],
			department: profileData.department,
		});
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleLanguagesUpdate = (languages: any[]) => {
		updateSkills({
			technical: profileData.skills.technical || [],
			soft: profileData.skills.soft || [],
			languages,
			department: profileData.department,
		});
	};

	return (
		<div className={cn("", wrapperClassName)}>
			{/* Header with back button - only show for admin view */}
			{userType === "admin" && onNavigateBack && (
				<div className="flex items-center mb-4">
					<Button variant="ghost" onClick={onNavigateBack} size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Applicants
					</Button>
				</div>
			)}

			{/* Main profile content */}
			<div
				className={`bg-white rounded-lg p-6 md:px-10 shadow-md ${contentClassName}`}
			>
				<h1 className="text-2xl font-bold text-primary-base mb-6">
					{userType === "admin" ? "Applicant Profile" : "User Profile"}
				</h1>

				{/* Personal Information Section */}
				<PersonalInfoSection
					personalInfo={profileData.personalInfo}
					avatarSrc={profileData.avatarSrc}
					locationLabel={getLocationLabel()}
					canEdit={canEdit}
					onInfoUpdate={updatePersonalInfo}
					onAvatarChange={(file) => uploadFile("avatar", file)}
				/>

				{/* Address Section */}
				<AddressSection
					addressInfo={profileData.addressInfo}
					canEdit={canEdit}
					onAddressUpdate={updateAddress}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				{/* Department Section */}
				<DepartmentSection
					department={profileData.department}
					canEdit={canEdit}
					onUpdate={handleDepartmentUpdate}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				{/* Skills Section */}
				<SkillsSection
					skills={combinedSkills}
					canEdit={canEdit}
					onUpdate={handleSkillsUpdate}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				{/* Languages Section */}
				<LanguagesSection
					languages={profileData.languages || []}
					canEdit={canEdit}
					onUpdate={handleLanguagesUpdate}
				/>

				<div className="md:px-10">
					<Separator className="my-6 bg-custom-separator bg-opacity-50" />
				</div>

				{/* Work & Education Section */}
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

				{/* Documents & Portfolio Section */}
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
