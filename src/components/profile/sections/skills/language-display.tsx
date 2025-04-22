import type React from "react";
import { cn } from "@/lib/utils";
import type { LanguageProficiency as LanguageProficiencyType } from "@/hooks/use-profile";

interface LanguageDisplayProps {
	languages: LanguageProficiencyType[];
	className?: string;
}

const LanguageDisplay: React.FC<LanguageDisplayProps> = ({
	languages,
	className,
}) => {
	const getProficiencyLabel = (level: number) => {
		if (level >= 9) return "Native";
		if (level >= 7) return "Advanced";
		if (level >= 5) return "Intermediate";
		if (level >= 3) return "Elementary";
		return "Beginner";
	};

	if (languages.length === 0) {
		return (
			<div className={className}>
				<p className="text-gray-500 italic">No languages added yet</p>
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{languages.map((lang, index) => (
					<div
						key={
							lang.languageId
								? `${lang.language}-${lang.languageId}`
								: `${lang.language}-${index}`
						}
						className="bg-blue-50 rounded-lg p-4"
					>
						<div className="font-medium text-lg">{lang.language}</div>
						<div className="text-gray-600">
							{getProficiencyLabel(lang.level)}
						</div>

						<div className="flex items-center mt-2">
							{Array.from({ length: 9 }).map((_, i) => (
								<div
									key={`level-${index}-${i}`}
									className={cn(
										"h-2 w-2 rounded-full mx-0.5",
										i < lang.level ? "bg-blue-500" : "bg-gray-200",
									)}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default LanguageDisplay;
