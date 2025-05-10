import { useQueryClient } from "@tanstack/react-query";
import type { UseProfileOptions } from "@/types/profile";
import { useProfileCore } from "./use-profile-core";
import { usePersonalInfo } from "./use-personal-info";
import { useSkills } from "./use-skills";
import { useLanguages } from "./use-languages";
import { useWorkEducation } from "./use-work-education";
import { useDocuments } from "./use-documents";
import { usePassword } from "./use-password";

export function useProfile(options: UseProfileOptions) {
	const queryClient = useQueryClient();

	const {
		profileData,
		setProfileData,
		isLoading: coreLoading,
		error: coreError,
		canEdit,
		getProfileCompletion,
	} = useProfileCore(options);

	const { updatePersonalInfo, updateAddress } = usePersonalInfo(
		profileData,
		setProfileData,
		queryClient,
	);

	const { updateSkills, addSkill, deleteSkill, pendingSkills, skillsLoading } =
		useSkills(profileData, setProfileData, queryClient);

	const {
		addLanguage,
		updateLanguage,
		deleteLanguage,
		pendingLanguages,
		languagesLoading,
	} = useLanguages(profileData, setProfileData, queryClient);

	const { updateWorkEducation, workEducationLoading } = useWorkEducation(
		profileData,
		setProfileData,
		queryClient,
	);

	const { uploadFile, removeDocument, updatePortfolioLinks, documentsLoading } =
		useDocuments(profileData, setProfileData, queryClient);

	const { updatePassword } = usePassword();

	const isLoading =
		coreLoading ||
		skillsLoading ||
		languagesLoading ||
		workEducationLoading ||
		documentsLoading;

	const hasPendingOperations =
		pendingSkills.size > 0 || pendingLanguages.size > 0;

	const clearError = () => {
		// This would be implemented if there's state to clear
	};

	return {
		profileData,
		isLoading,
		error: coreError,
		canEdit,
		updatePersonalInfo,
		updateAddress,
		updateSkills,
		updateWorkEducation,
		uploadFile,
		removeDocument,
		updatePortfolioLinks,
		updatePassword,
		getProfileCompletion,
		pendingOperations: hasPendingOperations,
		clearError,
		addLanguage,
		updateLanguage,
		deleteLanguage,
		addSkill,
		deleteSkill,
	};
}
