import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { LanguageProficiency as LanguageProficiencyType } from "@/hooks/use-profile";

interface LanguageProficiencyProps {
	languages: LanguageProficiencyType[];
	onAddLanguage: (language: string, level: number) => void;
	onRemoveLanguage: (language: string) => void;
	className?: string;
}

// Define proficiency levels
const PROFICIENCY_LEVELS = [
	{ value: "1", label: "Beginner" },
	{ value: "3", label: "Elementary" },
	{ value: "5", label: "Intermediate" },
	{ value: "7", label: "Advanced" },
	{ value: "9", label: "Native" },
];

const LanguageProficiency: React.FC<LanguageProficiencyProps> = ({
	languages,
	onAddLanguage,
	onRemoveLanguage,
	className,
}) => {
	const [newLanguage, setNewLanguage] = useState("");
	const [selectedProficiency, setSelectedProficiency] = useState("5");

	const handleAddLanguage = () => {
		if (newLanguage.trim()) {
			onAddLanguage(
				newLanguage.trim(),
				Number.parseInt(selectedProficiency, 10),
			);
			setNewLanguage("");
			setSelectedProficiency("5");
		}
	};

	const getProficiencyLabel = (level: number) => {
		if (level >= 9) return "Native";
		if (level >= 7) return "Advanced";
		if (level >= 5) return "Intermediate";
		if (level >= 3) return "Elementary";
		return "Beginner";
	};

	return (
		<div className={className}>
			{/* <h3 className="text-lg font-medium mb-4">Language Proficiency</h3> */}

			<div className="flex gap-2 mb-6">
				<Input
					value={newLanguage}
					onChange={(e) => setNewLanguage(e.target.value)}
					placeholder="Enter language"
					className="flex-grow"
				/>

				<Select
					value={selectedProficiency}
					onValueChange={setSelectedProficiency}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select proficiency" />
					</SelectTrigger>
					<SelectContent>
						{PROFICIENCY_LEVELS.map((level) => (
							<SelectItem key={level.value} value={level.value}>
								{level.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button
					onClick={handleAddLanguage}
					className="bg-sky-500 hover:bg-sky-600"
				>
					<Plus className="h-4 w-4 mr-1" />
					Add Language
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{languages.map((lang) => (
					<div
						key={lang.language}
						className="bg-blue-50 rounded-lg p-4 relative"
					>
						<div className="font-medium text-lg">{lang.language}</div>
						<div className="text-gray-600">
							{getProficiencyLabel(lang.level)}
						</div>

						<button
							type="button"
							onClick={() => onRemoveLanguage(lang.language)}
							className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
							aria-label={`Remove ${lang.language}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Add</title>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default LanguageProficiency;
