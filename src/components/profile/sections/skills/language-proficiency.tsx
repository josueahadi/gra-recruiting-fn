import type React from "react";
import { useState, useId, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, X, Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { LanguageProficiency as LanguageProficiencyType } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { showToast } from "@/services/toast";

interface LanguageProficiencyProps {
	languages: LanguageProficiencyType[];
	onAddLanguage: (language: string, level: number) => void;
	onRemoveLanguage: (language: string) => void;
	onUpdateLanguage?: (
		languageId: number,
		language: string,
		level: number,
	) => void;
	className?: string;
	isSubmitting?: boolean;
}

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
	onUpdateLanguage,
	className,
	isSubmitting = false,
}) => {
	const [newLanguage, setNewLanguage] = useState("");
	const [selectedProficiency, setSelectedProficiency] = useState("5");
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [editLanguage, setEditLanguage] = useState("");
	const [editProficiency, setEditProficiency] = useState("5");
	const [error, setError] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const uniqueId = useId();

	const MAX_LANGUAGES = 10;

	const handleAddLanguage = useCallback(() => {
		if (!newLanguage.trim()) {
			setError("Please enter a language");
			return;
		}

		if (languages.length >= MAX_LANGUAGES) {
			showToast({
				title: `Maximum of ${MAX_LANGUAGES} languages allowed.`,
				variant: "error",
			});
			return;
		}

		if (
			languages.some(
				(lang) =>
					lang.language.toLowerCase() === newLanguage.trim().toLowerCase(),
			)
		) {
			setError("This language already exists.");
			return;
		}

		setIsAdding(true);

		try {
			onAddLanguage(
				newLanguage.trim(),
				Number.parseInt(selectedProficiency, 10),
			);
			setNewLanguage("");
			setSelectedProficiency("5");
			setError("");
		} catch (error) {
			console.error("Error adding language:", error);
			setError("Failed to add language. Please try again.");
		} finally {
			setIsAdding(false);
		}
	}, [newLanguage, selectedProficiency, languages, onAddLanguage]);

	const handleEdit = useCallback(
		(index: number) => {
			setEditIndex(index);
			setEditLanguage(languages[index].language);
			setEditProficiency(languages[index].level.toString());
			setError("");
		},
		[languages],
	);

	const handleSaveEdit = useCallback(
		(languageId?: number) => {
			if (!editLanguage.trim()) {
				setError("Language name cannot be empty");
				return;
			}

			if (
				languages.some(
					(lang, idx) =>
						idx !== editIndex &&
						lang.language.toLowerCase() === editLanguage.trim().toLowerCase(),
				)
			) {
				setError("This language already exists.");
				return;
			}

			if (onUpdateLanguage && languageId) {
				onUpdateLanguage(
					languageId,
					editLanguage.trim(),
					Number.parseInt(editProficiency, 10),
				);
			}

			if (editIndex !== null) {
				const updatedLanguages = [...languages];
				updatedLanguages[editIndex] = {
					...updatedLanguages[editIndex],
					language: editLanguage.trim(),
					level: Number.parseInt(editProficiency, 10),
				};
				// setLanguages(updatedLanguages);
			}

			setEditIndex(null);
			setEditLanguage("");
			setEditProficiency("5");
			setError("");
		},
		[editLanguage, editProficiency, editIndex, languages, onUpdateLanguage],
	);

	const handleCancelEdit = useCallback(() => {
		setEditIndex(null);
		setEditLanguage("");
		setEditProficiency("5");
		setError("");
	}, []);

	const getProficiencyLabel = useCallback((level: number) => {
		if (level >= 9) return "Native";
		if (level >= 7) return "Advanced";
		if (level >= 5) return "Intermediate";
		if (level >= 3) return "Elementary";
		return "Beginner";
	}, []);

	const generateLanguageKey = useCallback(
		(lang: LanguageProficiencyType, index: number) => {
			if (lang.languageId) return `lang-${lang.languageId}`;
			if (lang.tempId) return lang.tempId;
			return `${uniqueId}-${index}-${lang.language.replace(/\s+/g, "-")}`;
		},
		[uniqueId],
	);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleAddLanguage();
			}
		},
		[handleAddLanguage],
	);

	return (
		<div className={className}>
			<div className="flex flex-col sm:flex-row gap-2 mb-6">
				<Input
					value={newLanguage}
					onChange={(e) => setNewLanguage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Enter language"
					className="flex-grow"
					disabled={isSubmitting || isAdding}
				/>

				<Select
					value={selectedProficiency}
					onValueChange={setSelectedProficiency}
					disabled={isSubmitting || isAdding}
				>
					<SelectTrigger className="w-full sm:w-[180px]">
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
					disabled={
						isSubmitting ||
						isAdding ||
						languages.length >= MAX_LANGUAGES ||
						!newLanguage.trim()
					}
				>
					{isAdding ? (
						<Loader2 className="h-4 w-4 mr-1 animate-spin" />
					) : (
						<Plus className="h-4 w-4 mr-1" />
					)}
					Add Language
				</Button>
			</div>

			{error && <div className="text-red-500 text-sm mb-4">{error}</div>}

			{languages.length >= MAX_LANGUAGES && (
				<div className="text-amber-600 text-sm mb-4">
					Maximum number of languages reached. Remove some languages to add new
					ones.
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{languages.map((lang, index) => (
					<div
						key={generateLanguageKey(lang, index)}
						className={cn(
							"bg-blue-50 rounded-lg p-4 relative",
							lang.tempId && "border-2 border-blue-200",
						)}
					>
						{editIndex === index ? (
							<>
								<Input
									value={editLanguage}
									onChange={(e) => setEditLanguage(e.target.value)}
									className="mb-2"
									disabled={isSubmitting}
								/>
								<Select
									value={editProficiency}
									onValueChange={setEditProficiency}
									disabled={isSubmitting}
								>
									<SelectTrigger className="w-full mb-2">
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
								<div className="flex gap-2 mt-2">
									<Button
										size="sm"
										className="bg-green-500 hover:bg-green-600 text-white"
										onClick={() => handleSaveEdit(lang.languageId)}
										disabled={isSubmitting}
									>
										<Check className="h-4 w-4" />
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={handleCancelEdit}
										disabled={isSubmitting}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</>
						) : (
							<>
								<div className="font-medium text-lg flex items-center justify-between">
									<span>
										{lang.language}
										{lang.tempId && (
											<span className="text-xs text-blue-500 ml-1">(New)</span>
										)}
									</span>
									{!isSubmitting && (
										<Button
											size="icon"
											variant="ghost"
											className="ml-2"
											onClick={() => handleEdit(index)}
											disabled={isSubmitting}
										>
											<Pencil className="h-4 w-4 text-gray-500" />
										</Button>
									)}
								</div>
								<div className="text-gray-600">
									{getProficiencyLabel(lang.level)}
								</div>

								{!isSubmitting && (
									<button
										type="button"
										onClick={() => onRemoveLanguage(lang.language)}
										className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
										aria-label={`Remove ${lang.language}`}
										disabled={isSubmitting}
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
											<title>Remove</title>
											<line x1="18" y1="6" x2="6" y2="18" />
											<line x1="6" y1="6" x2="18" y2="18" />
										</svg>
									</button>
								)}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default LanguageProficiency;
