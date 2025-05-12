import { useCallback, useState } from "react";
import { showToast } from "@/services/toast";
import { ApiQueueManager } from "@/lib/utils/api-queue-utils";
import type { ApplicantData } from "@/types/profile";
import { languagesService } from "@/services/languages";
import type { QueryClient } from "@tanstack/react-query";

export function useLanguages(
	profileData: ApplicantData | null,
	setProfileData: React.Dispatch<React.SetStateAction<ApplicantData | null>>,
	queryClient: QueryClient,
) {
	const [pendingLanguages, setPendingLanguages] = useState<Set<string>>(
		new Set(),
	);
	const [languagesLoading, setLanguagesLoading] = useState(false);
	const languageApiQueue = new ApiQueueManager({ delayBetweenRequests: 500 });

	const PROFICIENCY_LEVEL_MAP: Record<
		number,
		"BEGINNER" | "INTERMEDIATE" | "FLUENT" | "NATIVE"
	> = {
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

				// Default to INTERMEDIATE if the level is not in our map
				const apiProficiencyLevel =
					PROFICIENCY_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE";

				// Make the API call using the service
				const result = await languagesService.add({
					languageName: language,
					proficiencyLevel: apiProficiencyLevel,
				});

				// Update the language with the real ID from the server
				setProfileData((current) => {
					if (!current) return null;

					const updatedLanguages = current.languages.map((lang) => {
						if (lang.language === language) {
							return {
								...lang,
								languageId: result.data.id,
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

			// Store original languages outside of the try block to access it in catch
			const originalLanguages = profileData ? [...profileData.languages] : [];

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(language));

				// Make the API call using the service
				await languagesService.update(languageId, {
					languageName: language,
					proficiencyLevel:
						PROFICIENCY_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE",
				});

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
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: originalLanguages,
					};
				});

				showToast({
					title: "Failed to update language",
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

			// Store original languages outside of the try block to access it in catch
			const originalLanguages = profileData ? [...profileData.languages] : [];

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(languageName));

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

				// Make the API call using the service
				await languagesService.delete(languageId);

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
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: originalLanguages,
					};
				});

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

	const deleteLanguageById = useCallback(
		async (languageId: number) => {
			if (!profileData) return false;
			// Store original languages for rollback
			const originalLanguages = profileData ? [...profileData.languages] : [];
			try {
				setLanguagesLoading(true);
				// Optimistically remove from UI
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: current.languages.filter(
							(lang) => lang.languageId !== languageId,
						),
					};
				});
				await languagesService.delete(languageId);
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });
				showToast({
					title: "Language removed successfully",
					variant: "success",
				});
				return true;
			} catch (error) {
				console.error("Error deleting language by ID:", error);
				// Rollback
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: originalLanguages,
					};
				});
				showToast({ title: "Failed to remove language", variant: "error" });
				return false;
			} finally {
				setLanguagesLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	return {
		addLanguage,
		updateLanguage,
		deleteLanguage,
		deleteLanguageById,
		pendingLanguages,
		languagesLoading,
	};
}
