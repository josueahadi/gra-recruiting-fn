import { useCallback, useState } from "react";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import { ApiQueueManager } from "@/lib/utils/api-queue-utils";
import type { LanguageProficiency, ApplicantData } from "@/types/profile";

export function useLanguages(
	profileData: ApplicantData | null,
	setProfileData: (data: ApplicantData | null) => void,
	queryClient: any,
) {
	const [pendingLanguages, setPendingLanguages] = useState<Set<string>>(
		new Set(),
	);
	const [languagesLoading, setLanguagesLoading] = useState(false);
	const languageApiQueue = new ApiQueueManager({ delayBetweenRequests: 500 });

	const PROFICIENCY_LEVEL_MAP: Record<number, string> = {
		1: "BEGINNER",
		5: "INTERMEDIATE",
		7: "FLUENT",
		9: "NATIVE",
	};

	const addLanguage = useCallback(
		async (language: string, proficiencyLevel: number) => {
			if (!profileData) return false;

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(language));

				// Create a temporary ID for optimistic UI update
				const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: [
							...current.languages,
							{
								language,
								level: proficiencyLevel,
								tempId,
							},
						],
					};
				});

				// Make the API call
				const { data } = await api.post(
					"/api/v1/applicants/add-language-proficiency",
					{
						languageName: language,
						proficiencyLevel:
							PROFICIENCY_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE",
					},
				);

				// Update the language with the real ID from the server
				setProfileData((current) => {
					if (!current) return null;

					const updatedLanguages = current.languages.map((lang) => {
						if (lang.tempId === tempId) {
							return {
								language,
								level: proficiencyLevel,
								languageId: data.id || data.languageId,
							};
						}
						return lang;
					});

					return {
						...current,
						languages: updatedLanguages,
					};
				});

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${language} added successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error adding language:", error);

				// Rollback the optimistic update
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: current.languages.filter(
							(lang) => !lang.tempId || lang.language !== language,
						),
					};
				});

				showToast({
					title: `Failed to add ${language}`,
					variant: "error",
				});

				return false;
			} finally {
				setPendingLanguages((prev) => {
					const newSet = new Set(prev);
					newSet.delete(language);
					return newSet;
				});
				setLanguagesLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const updateLanguage = useCallback(
		async (languageId: number, language: string, proficiencyLevel: number) => {
			if (!profileData) return false;

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(language));

				// Store original state for rollback
				const originalLanguages = [...profileData.languages];

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;

					const updatedLanguages = current.languages.map((lang) => {
						if (lang.languageId === languageId) {
							return {
								...lang,
								language,
								level: proficiencyLevel,
							};
						}
						return lang;
					});

					return {
						...current,
						languages: updatedLanguages,
					};
				});

				// Make the API call
				await api.patch(
					`/api/v1/applicants/update-language-proficiency/${languageId}`,
					{
						languageName: language,
						proficiencyLevel:
							PROFICIENCY_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE",
					},
				);

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${language} updated successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error updating language:", error);

				// Rollback to original state
				if (profileData) {
					setProfileData({
						...profileData,
						languages: [...originalLanguages],
					});
				}

				showToast({
					title: `Failed to update language`,
					variant: "error",
				});

				return false;
			} finally {
				setPendingLanguages((prev) => {
					const newSet = new Set(prev);
					newSet.delete(language);
					return newSet;
				});
				setLanguagesLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const deleteLanguage = useCallback(
		async (languageName: string) => {
			if (!profileData) return false;

			const languageToDelete = profileData.languages.find(
				(lang) => lang.language === languageName,
			);

			if (!languageToDelete || !languageToDelete.languageId) {
				console.error(
					"Cannot delete language - no valid ID found for:",
					languageName,
				);
				return false;
			}

			const languageId = languageToDelete.languageId;

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(languageName));

				// Store original state for rollback
				const originalLanguages = [...profileData.languages];

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: current.languages.filter(
							(lang) => lang.language !== languageName,
						),
					};
				});

				// Make the API call
				await api.delete(
					`/api/v1/applicants/delete-language-proficiency/${languageId}`,
				);

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${languageToDelete.language} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting language:", error);

				// Rollback to original state
				if (profileData) {
					setProfileData({
						...profileData,
						languages: [...originalLanguages],
					});
				}

				showToast({
					title: `Failed to remove ${languageToDelete.language}`,
					variant: "error",
				});

				return false;
			} finally {
				setPendingLanguages((prev) => {
					const newSet = new Set(prev);
					newSet.delete(languageName);
					return newSet;
				});
				setLanguagesLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	return {
		addLanguage,
		updateLanguage,
		deleteLanguage,
		pendingLanguages,
		languagesLoading,
	};
}
