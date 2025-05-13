import { useCallback, useState } from "react";
import { showToast } from "@/services/toast";
import type { ApplicantData, LanguageProficiency } from "@/types/profile";
import { languagesService } from "@/services/languages";
import type { QueryClient } from "@tanstack/react-query";

const PROFICIENCY_LEVEL_MAP: Record<
	number,
	"BEGINNER" | "INTERMEDIATE" | "FLUENT" | "NATIVE"
> = {
	1: "BEGINNER",
	5: "INTERMEDIATE",
	7: "FLUENT",
	9: "NATIVE",
};

export function useLanguages(
	profileData: ApplicantData | null,
	setProfileData: React.Dispatch<React.SetStateAction<ApplicantData | null>>,
	queryClient: QueryClient,
) {
	const [pendingLanguages, setPendingLanguages] = useState<Set<string>>(
		new Set(),
	);
	const [languagesLoading, setLanguagesLoading] = useState(false);

	const addLanguage = useCallback(
		async (language: string, proficiencyLevel: number) => {
			if (!profileData) return false;

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(language));

				const apiProficiencyLevel =
					PROFICIENCY_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE";

				const tempLanguageObj: LanguageProficiency = {
					language: language,
					level: proficiencyLevel,
				};

				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: [...current.languages, tempLanguageObj],
					};
				});

				const result = await languagesService.add({
					languageName: language,
					proficiencyLevel: apiProficiencyLevel,
				});

				setProfileData((current) => {
					if (!current) return null;

					const updatedLanguages = current.languages.map((lang) => {
						if (lang.language === language && !lang.languageId) {
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

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${language} added successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error adding language:", error);

				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: current.languages.filter(
							(lang) => lang.language !== language || lang.languageId,
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

			const originalLanguages = profileData.languages
				? [...profileData.languages]
				: [];

			const languageToUpdate = originalLanguages.find(
				(lang) => lang.languageId === languageId,
			);

			if (!languageToUpdate) {
				console.error(`Language with ID ${languageId} not found`);
				return false;
			}

			const originalLanguageName = languageToUpdate.language;

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(originalLanguageName));

				setProfileData((current) => {
					if (!current) return null;

					const updatedLanguages = current.languages.map((lang) => {
						if (lang.languageId === languageId) {
							return {
								...lang,
								language: language,
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

				await languagesService.update(languageId, {
					languageName: language,
					proficiencyLevel:
						PROFICIENCY_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE",
				});

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${language} updated successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error updating language:", error);

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
					newSet.delete(originalLanguageName);
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

			if (!languageToDelete) {
				console.error(`Language "${languageName}" not found`);
				return false;
			}

			if (!languageToDelete.languageId) {
				console.error(
					`Cannot delete language - no valid ID found for: ${languageName}`,
				);

				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: current.languages.filter(
							(lang) => lang.language !== languageName,
						),
					};
				});
				return true;
			}

			const languageId = languageToDelete.languageId;

			const originalLanguages = [...profileData.languages];

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(languageName));

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
					title: `${languageName} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting language:", error);

				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: originalLanguages,
					};
				});

				showToast({
					title: `Failed to remove ${languageName}`,
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

			const languageToDelete = profileData.languages.find(
				(lang) => lang.languageId === languageId,
			);

			if (!languageToDelete) {
				console.error(`Language with ID ${languageId} not found`);
				return false;
			}

			const languageName = languageToDelete.language;

			const originalLanguages = [...profileData.languages];

			try {
				setLanguagesLoading(true);
				setPendingLanguages((prev) => new Set(prev).add(languageName));

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
					title: `${languageName} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting language by ID:", error);

				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: originalLanguages,
					};
				});

				showToast({
					title: "Failed to remove language",
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
		deleteLanguageById,
		pendingLanguages,
		languagesLoading,
	};
}
