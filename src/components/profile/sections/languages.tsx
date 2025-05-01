import type React from "react";
import { useState, useCallback } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import type { LanguageProficiency as LanguageProficiencyType } from "@/hooks/use-profile";
import LanguageProficiency from "./skills/language-proficiency";
import LanguageDisplay from "./skills/language-display";
import { showToast } from "@/services/toast";

interface LanguagesSectionProps {
	languages: LanguageProficiencyType[];
	canEdit: boolean;
	onUpdate: (languages: LanguageProficiencyType[]) => Promise<boolean>;
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

	const handleEdit = useCallback(() => {
		setIsEditing(true);
	}, []);

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setLanguages(initialLanguages || []);
	}, [initialLanguages]);

	const handleSave = useCallback(async () => {
		if (languages.length > 10) {
			showToast({
				title: "Too many languages. Maximum 10 allowed.",
				variant: "error",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const success = await onUpdate(languages);

			if (success) {
				setIsEditing(false);
				showToast({
					title: "Languages updated successfully",
					variant: "success",
				});
			} else {
				throw new Error("Failed to update languages");
			}
		} catch (error) {
			console.error("Error updating languages:", error);
			showToast({
				title: "Failed to update languages. Please try again.",
				variant: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	}, [languages, onUpdate]);

	const handleLanguagesChange = useCallback(
		(updatedLanguages: LanguageProficiencyType[]) => {
			setLanguages(updatedLanguages);
		},
		[],
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
						onLanguagesChange={handleLanguagesChange}
					/>
				) : (
					<LanguageDisplay languages={languages} />
				)}
			</div>
		</ProfileSection>
	);
};

export default LanguagesSection;
