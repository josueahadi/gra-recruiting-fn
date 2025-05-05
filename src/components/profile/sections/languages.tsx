import type React from "react";
import { useState, useCallback } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import type { LanguageProficiency as LanguageProficiencyType } from "@/hooks/use-profile";
import LanguageProficiency from "./skills/language-proficiency";
import LanguageDisplay from "./skills/language-display";

interface LanguagesSectionProps {
	languages: LanguageProficiencyType[];
	canEdit: boolean;
	onUpdate?: (languages: LanguageProficiencyType[]) => Promise<boolean>;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
	languages: initialLanguages,
	canEdit,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [languages, setLanguages] = useState<LanguageProficiencyType[]>(
		initialLanguages || [],
	);

	const handleEdit = useCallback(() => {
		setIsEditing((prev) => !prev);
	}, []);

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setLanguages(initialLanguages || []);
	}, [initialLanguages]);

	const handleApplyChanges = useCallback(() => {
		setIsEditing(false);
		// Keep the current state of languages, which reflects all API changes
		// No need to reset to initialLanguages since all changes are already saved
	}, []);

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
			onEdit={handleEdit}
			onCancel={handleCancel}
			onSave={handleApplyChanges}
			saveButtonText="Apply Changes"
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
