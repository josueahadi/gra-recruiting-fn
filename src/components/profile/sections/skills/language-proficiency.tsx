import type React from "react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Plus,
	Pencil,
	Check,
	X,
	Loader2,
	Trash2,
	MoreVertical,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { showToast } from "@/services/toast";
import type { LanguageProficiency as LanguageProficiencyType } from "@/types/profile";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface LanguageProficiencyProps {
	languages: LanguageProficiencyType[];
	onLanguagesChange: (languages: LanguageProficiencyType[]) => void;
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
	className?: string;
}

const PROFICIENCY_LEVELS = [
	{ value: "1", label: "Beginner", apiValue: "BEGINNER" },
	{ value: "5", label: "Intermediate", apiValue: "INTERMEDIATE" },
	{ value: "7", label: "Fluent", apiValue: "FLUENT" },
	{ value: "9", label: "Native", apiValue: "NATIVE" },
];

const LanguageProficiency: React.FC<LanguageProficiencyProps> = ({
	languages,
	onLanguagesChange,
	onUpdateLanguage,
	onDeleteLanguage,
	onAddLanguage,
	className,
}) => {
	const [newLanguage, setNewLanguage] = useState("");
	const [selectedProficiency, setSelectedProficiency] = useState("");
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [editLanguage, setEditLanguage] = useState("");
	const [editProficiency, setEditProficiency] = useState("5");
	const [errorMessage, setErrorMessage] = useState("");
	const [pendingOperations, setPendingOperations] = useState<
		Record<string, boolean>
	>({});

	const MAX_LANGUAGES = 10;
	const MAX_LANGUAGE_LENGTH = 50;

	const markPending = useCallback((key: string, isPending: boolean) => {
		setPendingOperations((prev) => ({
			...prev,
			[key]: isPending,
		}));
	}, []);

	const isPending = useCallback(
		(key: string) => {
			return pendingOperations[key] === true;
		},
		[pendingOperations],
	);

	const handleAddLanguage = useCallback(async () => {
		setErrorMessage("");

		if (!newLanguage.trim()) {
			setErrorMessage("Please enter a language name");
			return;
		}

		if (newLanguage.length > MAX_LANGUAGE_LENGTH) {
			setErrorMessage(
				`Language name cannot exceed ${MAX_LANGUAGE_LENGTH} characters`,
			);
			return;
		}

		if (!selectedProficiency) {
			setErrorMessage("Please select a proficiency level");
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
				(lang) => lang.language.toLowerCase() === newLanguage.toLowerCase(),
			)
		) {
			setErrorMessage("This language already exists.");
			return;
		}

		setErrorMessage("");
		if (onAddLanguage) {
			const success = await onAddLanguage(
				newLanguage.trim(),
				Number.parseInt(selectedProficiency, 10),
			);
			if (success) {
				setNewLanguage("");
				setSelectedProficiency("");
			}
			return;
		}
		const tempId = Date.now();
		const tempLanguageObj: LanguageProficiencyType = {
			id: tempId,
			language: newLanguage.trim(),
			level: Number.parseInt(selectedProficiency, 10),
		};
		onLanguagesChange([...languages, tempLanguageObj]);
		setNewLanguage("");
		setSelectedProficiency("");
	}, [
		newLanguage,
		selectedProficiency,
		languages,
		onLanguagesChange,
		onAddLanguage,
	]);

	const handleDeleteLanguage = useCallback(
		async (language: LanguageProficiencyType) => {
			if (!language.languageId) {
				showToast({
					title: "Cannot delete language: missing languageId",
					variant: "error",
				});
				return;
			}
			const operationKey = `delete-${language.languageId}`;
			markPending(operationKey, true);
			try {
				if (onDeleteLanguage) {
					await onDeleteLanguage(language.languageId);
				}
			} catch (error) {
				showToast({
					title: `Failed to remove ${language.language}`,
					description:
						error instanceof Error ? error.message : "Please try again",
					variant: "error",
				});
			} finally {
				markPending(operationKey, false);
			}
		},
		[onDeleteLanguage, markPending],
	);

	const handleEditStart = useCallback(
		(index: number) => {
			const language = languages[index];
			setEditIndex(index);
			setEditLanguage(language.language);
			setEditProficiency(language.level.toString());
			setErrorMessage("");
		},
		[languages],
	);

	const handleUpdateLanguage = useCallback(
		async (index: number) => {
			setErrorMessage("");

			if (!editLanguage.trim()) {
				setErrorMessage("Language name cannot be empty");
				return;
			}

			if (editLanguage.length > MAX_LANGUAGE_LENGTH) {
				setErrorMessage(
					`Language name cannot exceed ${MAX_LANGUAGE_LENGTH} characters`,
				);
				return;
			}

			const language = languages[index];
			if (!language || !language.languageId) {
				setErrorMessage("Cannot update language: missing languageId");
				return;
			}

			if (
				languages.some(
					(lang, idx) =>
						idx !== index &&
						lang.language.toLowerCase() === editLanguage.trim().toLowerCase(),
				)
			) {
				setErrorMessage("This language already exists.");
				return;
			}

			const operationKey = `update-${language.languageId}`;
			markPending(operationKey, true);
			setErrorMessage("");

			try {
				if (onUpdateLanguage) {
					await onUpdateLanguage(
						language.languageId,
						editLanguage.trim(),
						Number.parseInt(editProficiency, 10),
					);
					setEditIndex(null);
					setEditLanguage("");
					setEditProficiency("5");
				}
			} catch (error) {
				showToast({
					title: "Failed to update language",
					description:
						error instanceof Error ? error.message : "Please try again",
					variant: "error",
				});
			} finally {
				markPending(operationKey, false);
			}
		},
		[editLanguage, editProficiency, languages, onUpdateLanguage, markPending],
	);

	const handleCancelEdit = useCallback(() => {
		setEditIndex(null);
		setEditLanguage("");
		setEditProficiency("5");
		setErrorMessage("");
	}, []);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleAddLanguage();
			}
		},
		[handleAddLanguage],
	);

	const getProficiencyLabel = useCallback((level: number) => {
		const proficiency = PROFICIENCY_LEVELS.find(
			(p) => Number.parseInt(p.value, 10) === level,
		);
		return proficiency ? proficiency.label : "Intermediate";
	}, []);

	const getLanguageKey = useCallback(
		(lang: LanguageProficiencyType, index: number) => {
			return lang.id ? `lang-${lang.id}` : `lang-temp-${index}`;
		},
		[],
	);

	const isAddingPending = Object.keys(pendingOperations).some(
		(key) => key.startsWith("add-") && pendingOperations[key],
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewLanguage(e.target.value);
		if (errorMessage) {
			setErrorMessage("");
		}
	};

	const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditLanguage(e.target.value);
		if (errorMessage) {
			setErrorMessage("");
		}
	};

	return (
		<div className={className}>
			<div className="flex flex-col sm:flex-row gap-2 mb-6">
				<Input
					value={newLanguage}
					onChange={handleInputChange}
					onKeyPress={handleKeyPress}
					placeholder="Enter language"
					className={`flex-grow ${newLanguage.length > MAX_LANGUAGE_LENGTH ? "border-red-500" : ""}`}
					disabled={isAddingPending}
				/>

				<Select
					value={selectedProficiency}
					onValueChange={(value) => {
						setSelectedProficiency(value);
						if (errorMessage) setErrorMessage("");
					}}
					disabled={isAddingPending}
				>
					<SelectTrigger className="w-full sm:w-[300px]">
						<SelectValue placeholder="Select Proficiency" />
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
						isAddingPending ||
						languages.length >= MAX_LANGUAGES ||
						!newLanguage.trim() ||
						!selectedProficiency ||
						newLanguage.length > MAX_LANGUAGE_LENGTH
					}
				>
					{isAddingPending ? (
						<Loader2 className="h-4 w-4 mr-1 animate-spin" />
					) : (
						<Plus className="h-4 w-4 mr-1" />
					)}
					Add Language
				</Button>
			</div>

			{errorMessage && (
				<div className="text-red-500 text-sm mb-4">{errorMessage}</div>
			)}

			{newLanguage.length > MAX_LANGUAGE_LENGTH && !errorMessage && (
				<div className="text-red-500 text-sm mb-4">
					Language name is too long (maximum {MAX_LANGUAGE_LENGTH} characters)
				</div>
			)}

			{languages.length >= MAX_LANGUAGES && (
				<div className="text-amber-600 text-sm mb-4">
					Maximum number of languages reached. Remove some languages to add new
					ones.
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{languages.map((lang, index) => {
					const langKey = getLanguageKey(lang, index);
					const isLangPending =
						isPending(`update-${lang.id}`) || isPending(`delete-${lang.id}`);

					return (
						<div
							key={langKey}
							className={cn(
								"bg-blue-50 rounded-lg p-4 relative flex flex-col justify-between h-full min-h-[110px]",
								isLangPending && "opacity-70",
							)}
						>
							{editIndex === index ? (
								<>
									<Input
										value={editLanguage}
										onChange={handleEditInputChange}
										className={`mb-2 ${editLanguage.length > MAX_LANGUAGE_LENGTH ? "border-red-500" : ""}`}
										disabled={isLangPending}
									/>
									{editLanguage.length > MAX_LANGUAGE_LENGTH && (
										<div className="text-red-500 text-xs mb-2">
											Language name is too long (maximum {MAX_LANGUAGE_LENGTH}{" "}
											characters)
										</div>
									)}
									<Select
										value={editProficiency}
										onValueChange={setEditProficiency}
										disabled={isLangPending}
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
											className="bg-primary-base hover:bg-primary-dark text-white"
											onClick={() => handleUpdateLanguage(index)}
											disabled={
												isLangPending ||
												editLanguage.length > MAX_LANGUAGE_LENGTH ||
												!editLanguage.trim()
											}
										>
											<Check className="h-4 w-4" />
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={handleCancelEdit}
											disabled={isLangPending}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</>
							) : (
								<>
									<div className="flex items-start justify-between w-full">
										<span className="font-medium text-lg break-words max-w-[70%]">
											{lang.language}
										</span>
										<div className="flex items-center justify-end gap-2 min-w-[56px]">
											{!isLangPending && (
												<Popover>
													<PopoverTrigger asChild>
														<Button
															size="icon"
															variant="ghost"
															className="p-2 sm:p-2.5"
															aria-label={`Actions for ${lang.language}`}
														>
															<MoreVertical className="h-5 w-5 text-gray-500" />
														</Button>
													</PopoverTrigger>
													<PopoverContent align="end" className="w-32 p-1">
														<button
															type="button"
															className="flex items-center w-full px-2 py-2 text-sm hover:bg-blue-100 rounded transition-colors"
															onClick={() => handleEditStart(index)}
														>
															<Pencil className="h-4 w-4 mr-2 text-gray-600" />{" "}
															Edit
														</button>
														<button
															type="button"
															className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
															onClick={() => handleDeleteLanguage(lang)}
														>
															<Trash2 className="h-4 w-4 mr-2" /> Delete
														</button>
													</PopoverContent>
												</Popover>
											)}
											{isLangPending && (
												<Loader2 className="h-5 w-5 animate-spin text-blue-500 ml-2" />
											)}
										</div>
									</div>
									<div className="text-gray-600 mt-1">
										{getProficiencyLabel(lang.level)}
									</div>
									<div className="flex items-center mt-2">
										{Array.from({ length: 9 }).map((_, i) => (
											<div
												key={`level-${langKey}-${i + 1}`}
												className={cn(
													"h-2 w-2 rounded-full mx-0.5",
													i < lang.level ? "bg-blue-500" : "bg-gray-200",
												)}
											/>
										))}
									</div>
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default LanguageProficiency;
