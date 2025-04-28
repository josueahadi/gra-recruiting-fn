import type React from "react";
import { useState, useCallback, useEffect } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import type { LanguageProficiency as LanguageProficiencyType } from "@/hooks/use-profile";
import LanguageProficiency from "./skills/language-proficiency";
import LanguageDisplayComponent from "./skills/language-display";
import { showToast } from "@/services/toast";

// Ensure we have a valid component reference
const LanguageDisplay = LanguageDisplayComponent;

interface LanguagesSectionProps {
	languages: LanguageProficiencyType[];
	canEdit: boolean;
	onUpdate: (languages: LanguageProficiencyType[]) => void;
}

interface LanguageChange {
	type: "add" | "update" | "remove";
	language: LanguageProficiencyType;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
	languages: initialLanguages,
	canEdit,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [languages, setLanguages] = useState<LanguageProficiencyType[]>(
		initialLanguages || [],
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [pendingChanges, setPendingChanges] = useState<LanguageChange[]>([]);

	useEffect(() => {
		if (!isEditing) {
			setPendingChanges([]);
		}
	}, [isEditing]);

	const handleEdit = useCallback(() => {
		setIsEditing(true);
	}, []);

	const handleSave = useCallback(async () => {
		if (isSubmitting) return;

		if (languages.length > 10) {
			showToast({
				title: "Too many languages. Please remove some (maximum 10).",
				variant: "error",
			});
			return;
		}

		try {
			setIsSubmitting(true);
			setIsEditing(false);
			await onUpdate(languages);

			showToast({
				title: "Languages updated successfully",
				variant: "success",
			});
		} catch (error) {
			console.error("Error updating languages:", error);
			setIsEditing(true);
			setLanguages(initialLanguages || []);

			showToast({
				title: "Failed to update languages. Please try again.",
				variant: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	}, [languages, onUpdate, initialLanguages, isSubmitting]);

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setLanguages(initialLanguages || []);
		setPendingChanges([]);
	}, [initialLanguages]);

	const handleAddLanguage = useCallback(
		(language: string, level: number) => {
			if (
				languages.some(
					(lang) => lang.language.toLowerCase() === language.toLowerCase(),
				)
			) {
				showToast({
					title: "This language already exists.",
					variant: "error",
				});
				return;
			}

			if (languages.length >= 10) {
				showToast({
					title: "Maximum 10 languages allowed.",
					variant: "error",
				});
				return;
			}

			const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
			const newLanguage: LanguageProficiencyType = {
				language,
				level,
				tempId: tempId,
			};

			setPendingChanges((prev) => [
				...prev,
				{ type: "add", language: newLanguage },
			]);

			setLanguages((prev) => [...prev, newLanguage]);
		},
		[languages],
	);

	const handleRemoveLanguage = useCallback(
		(language: string) => {
			const langToRemove = languages.find((lang) => lang.language === language);

			if (langToRemove) {
				if (langToRemove.languageId) {
					setPendingChanges((prev) => [
						...prev,
						{ type: "remove", language: langToRemove },
					]);
				}

				setLanguages((prev) =>
					prev.filter((lang) => lang.language !== language),
				);
			}
		},
		[languages],
	);

	return (
		<ProfileSection
			title="Language Proficiency"
			canEdit={canEdit}
			isEditing={isEditing}
			isSubmitting={isSubmitting}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="md:px-4">
				{isEditing ? (
					<LanguageProficiency
						languages={languages}
						onAddLanguage={handleAddLanguage}
						onRemoveLanguage={handleRemoveLanguage}
						isSubmitting={isSubmitting}
					/>
				) : (
					<LanguageDisplay languages={languages} />
				)}
			</div>
		</ProfileSection>
	);
};

export default LanguagesSection;
