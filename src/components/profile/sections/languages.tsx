import type React from "react";
import { useState } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import type { LanguageProficiency as LanguageProficiencyType } from "@/hooks/use-profile";
import LanguageProficiency from "./skills/language-proficiency";
import LanguageDisplay from "./skills/language-display";

interface LanguagesSectionProps {
	languages: LanguageProficiencyType[];
	canEdit: boolean;
	onUpdate: (languages: LanguageProficiencyType[]) => void;
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

	// Edit mode handlers
	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		onUpdate(languages);
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset to initial values
		setLanguages(initialLanguages || []);
	};

	// Language handlers
	const handleAddLanguage = (language: string, level: number) => {
		// Check if language already exists
		if (
			languages.some(
				(lang) => lang.language.toLowerCase() === language.toLowerCase(),
			)
		) {
			// Could show a toast notification here
			return;
		}

		setLanguages([...languages, { language, level }]);
	};

	const handleRemoveLanguage = (language: string) => {
		setLanguages(languages.filter((lang) => lang.language !== language));
	};

	return (
		<ProfileSection
			title="Language Proficiency"
			canEdit={canEdit}
			isEditing={isEditing}
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
					/>
				) : (
					<LanguageDisplay languages={languages} />
				)}
			</div>
		</ProfileSection>
	);
};

export default LanguagesSection;
