import type React from "react";
import { useState, useCallback, useEffect } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import type { LanguageProficiency as LanguageProficiencyType } from "@/types/profile";
import LanguageProficiency from "@/components/profile/sections/skills/language-proficiency";
import LanguageDisplay from "@/components/profile/sections/skills/language-display";

interface LanguagesSectionProps {
	languages: LanguageProficiencyType[];
	canEdit: boolean;
	onUpdateLanguage?: (
		languageId: number,
		language: string,
		proficiencyLevel: number,
	) => Promise<boolean>;
	onDeleteLanguage?: (languageId: number) => Promise<boolean>;
	onAddLanguage?: (
		language: string,
		proficiencyLevel: number,
	) => Promise<boolean>;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
	languages: initialLanguages,
	canEdit,
	onUpdateLanguage,
	onDeleteLanguage,
	onAddLanguage,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [languages, setLanguages] = useState<LanguageProficiencyType[]>(
		initialLanguages || [],
	);

	// Sync languages with parent component when initialLanguages prop changes
	useEffect(() => {
		setLanguages(initialLanguages || []);
	}, [initialLanguages]);

	const handleEdit = useCallback(() => {
		setIsEditing((prev) => !prev);
	}, []);

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setLanguages(initialLanguages || []);
	}, [initialLanguages]);

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
		>
			<div className="md:px-4">
				{isEditing ? (
					<LanguageProficiency
						languages={languages}
						onLanguagesChange={handleLanguagesChange}
						onUpdateLanguage={onUpdateLanguage}
						onDeleteLanguage={onDeleteLanguage}
						onAddLanguage={onAddLanguage}
					/>
				) : (
					<LanguageDisplay languages={languages} />
				)}
			</div>
		</ProfileSection>
	);
};

export default LanguagesSection;
