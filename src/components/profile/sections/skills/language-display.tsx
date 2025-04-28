import type { FC } from "react";
import { cn } from "@/lib/utils";
import type { LanguageProficiency } from "@/hooks/use-profile";

interface LanguageDisplayProps {
	languages: LanguageProficiency[];
	className?: string;
}

const LanguageDisplay: FC<LanguageDisplayProps> = ({
	languages,
	className,
}) => {
	// Helper function to get human-readable proficiency label
	const getProficiencyLabel = (level: number) => {
		if (level >= 9) return "Native";
		if (level >= 7) return "Advanced";
		if (level >= 5) return "Intermediate";
		if (level >= 3) return "Elementary";
		return "Beginner";
	};

	// Input validation
	if (!Array.isArray(languages)) {
		console.error("Languages is not an array:", languages);
		return (
			<div className={className}>
				<p className="text-red-500 italic">Error loading languages</p>
			</div>
		);
	}

	// Empty state
	if (languages.length === 0) {
		return (
			<div className={className}>
				<p className="text-gray-500 italic">No languages added yet</p>
			</div>
		);
	}

	// Render the languages grid
	return (
		<div className={className}>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{languages.map((lang, index) => {
					// Create a unique key
					const key = lang.languageId
						? `lang-${lang.languageId}`
						: lang.tempId
							? lang.tempId
							: `lang-${index}-${lang.language.replace(/\s+/g, "-")}`;

					return (
						<div key={key} className="bg-blue-50 rounded-lg p-4">
							<div className="font-medium text-lg">{lang.language}</div>
							<div className="text-gray-600">
								{getProficiencyLabel(lang.level)}
							</div>

							<div className="flex items-center mt-2">
								{Array.from({ length: 9 }).map((_, i) => (
									<div
										key={`level-${key}-${lang.language}-${i + 1}`}
										className={cn(
											"h-2 w-2 rounded-full mx-0.5",
											i < lang.level ? "bg-blue-500" : "bg-gray-200",
										)}
									/>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default LanguageDisplay;
