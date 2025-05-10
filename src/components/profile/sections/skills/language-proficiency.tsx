import type React from "react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, X, Loader2, Trash2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { showToast } from "@/services/toast";
import { ApiQueueManager } from "@/lib/utils/api-queue-utils";
import type { LanguageProficiency as LanguageProficiencyType } from "@/types/profile";
import {
	languagesService,
	type LanguageProficiencyPayload,
} from "@/services/languages";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LanguageProficiencyProps {
	languages: LanguageProficiencyType[];
	onLanguagesChange: (languages: LanguageProficiencyType[]) => void;
	className?: string;
}

const PROFICIENCY_LEVELS = [
	{ value: "1", label: "Beginner", apiValue: "BEGINNER" },
	{ value: "5", label: "Intermediate", apiValue: "INTERMEDIATE" },
	{ value: "7", label: "Fluent", apiValue: "FLUENT" },
	{ value: "9", label: "Native", apiValue: "NATIVE" },
];

const PROFICIENCY_MAP: Record<
	string,
	LanguageProficiencyPayload["proficiencyLevel"]
> = {
	"1": "BEGINNER",
	"5": "INTERMEDIATE",
	"7": "FLUENT",
	"9": "NATIVE",
};

const REVERSE_PROFICIENCY_MAP: Record<string, string> = {
	BEGINNER: "1",
	INTERMEDIATE: "5",
	FLUENT: "7",
	NATIVE: "9",
};

const LanguageProficiency: React.FC<LanguageProficiencyProps> = ({
	languages,
	onLanguagesChange,
	className,
}) => {
	const [newLanguage, setNewLanguage] = useState("");
	const [selectedProficiency, setSelectedProficiency] = useState("5");
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [editLanguage, setEditLanguage] = useState("");
	const [editProficiency, setEditProficiency] = useState("5");
	const [errorMessage, setErrorMessage] = useState("");
	const [pendingLanguages, setPendingLanguages] = useState<Set<string>>(
		new Set(),
	);

	// Delete confirmation dialog state
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [languageToDelete, setLanguageToDelete] =
		useState<LanguageProficiencyType | null>(null);

	const apiQueue = new ApiQueueManager({ delayBetweenRequests: 500 });

	const MAX_LANGUAGES = 10;

	const handleAddLanguage = useCallback(async () => {
		if (!newLanguage.trim()) {
			setErrorMessage("Please enter a language name");
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
			setErrorMessage("This language already exists.");
			return;
		}

		setPendingLanguages((prev) => new Set(prev).add(newLanguage));
		setErrorMessage("");

		// First add to UI with temporary state for a more responsive experience
		const tempLanguageObj: LanguageProficiencyType = {
			language: newLanguage.trim(),
			level: Number.parseInt(selectedProficiency, 10),
		};

		// Update UI immediately
		onLanguagesChange([...languages, tempLanguageObj]);

		try {
			// Make a direct API call to add the language
			console.log(
				"Adding language:",
				newLanguage.trim(),
				"with proficiency:",
				PROFICIENCY_MAP[selectedProficiency],
			);

			const response = await languagesService.add({
				languageName: newLanguage.trim(),
				proficiencyLevel:
					PROFICIENCY_MAP[selectedProficiency] || "INTERMEDIATE",
			});

			console.log("Language add response:", response);

			// If successful, update the languages array with the new language from API
			if (response.data?.id) {
				// Find the temporary language we just added and update it with the server ID
				const updatedLanguages = languages.map((lang) => {
					if (lang.language === tempLanguageObj.language && !lang.languageId) {
						return {
							...lang,
							languageId: response.data.id,
						};
					}
					return lang;
				});

				// Add language if it wasn't found in the map operation (shouldn't happen, but as a fallback)
				if (
					!updatedLanguages.some((lang) => lang.languageId === response.data.id)
				) {
					updatedLanguages.push({
						language: newLanguage.trim(),
						level: Number.parseInt(selectedProficiency, 10),
						languageId: response.data.id,
					});
				}

				onLanguagesChange(updatedLanguages);

				showToast({
					title: "Language added successfully",
					variant: "success",
				});
			} else {
				throw new Error("Failed to get language ID from server");
			}
		} catch (error: unknown) {
			console.error("Error adding language:", error);

			// Remove the temporary language on error
			onLanguagesChange(
				languages.filter(
					(lang) =>
						!(lang.language === tempLanguageObj.language && !lang.languageId),
				),
			);

			showToast({
				title: "Failed to add language",
				description:
					typeof error === "object" && error && "message" in error
						? (error as { message?: string }).message || "Please try again"
						: "Please try again",
				variant: "error",
			});
		} finally {
			setPendingLanguages((prev) => {
				const newSet = new Set(prev);
				newSet.delete(newLanguage);
				return newSet;
			});

			setNewLanguage("");
			setSelectedProficiency("5");
		}
	}, [newLanguage, selectedProficiency, languages, onLanguagesChange]);

	// Open the confirmation dialog before deleting
	const confirmDeleteLanguage = useCallback(
		(language: LanguageProficiencyType) => {
			setLanguageToDelete(language);
			setDeleteDialogOpen(true);
		},
		[],
	);

	// Handle actual deletion after confirmation
	const handleDeleteLanguage = useCallback(async () => {
		if (!languageToDelete) return;
		setDeleteDialogOpen(false);
		setPendingLanguages((prev) => new Set(prev).add(languageToDelete.language));

		try {
			if (languageToDelete.languageId) {
				// Always call the API if languageId exists
				await languagesService.delete(languageToDelete.languageId);
				const updatedLanguages = languages.filter(
					(lang) => lang.languageId !== languageToDelete.languageId,
				);
				onLanguagesChange(updatedLanguages);
				showToast({
					title: "Language removed successfully",
					variant: "success",
				});
			} else {
				// If no languageId, just remove from UI
				const updatedLanguages = languages.filter(
					(lang) => lang.language !== languageToDelete.language,
				);
				onLanguagesChange(updatedLanguages);
				showToast({
					title: "Language removed",
					variant: "success",
				});
			}
		} catch (error: unknown) {
			console.error("Error deleting language:", error);
			showToast({
				title: "Failed to remove language",
				description:
					typeof error === "object" && error && "message" in error
						? (error as { message?: string }).message || "Please try again"
						: "Please try again",
				variant: "error",
			});
		} finally {
			setPendingLanguages((prev) => {
				const newSet = new Set(prev);
				if (languageToDelete) {
					newSet.delete(languageToDelete.language);
				}
				return newSet;
			});
			setLanguageToDelete(null);
		}
	}, [languageToDelete, languages, onLanguagesChange]);

	const handleUpdateLanguage = useCallback(
		async (index: number) => {
			if (!editLanguage.trim()) {
				setErrorMessage("Language name cannot be empty");
				return;
			}

			const languageToUpdate = languages[index];
			if (!languageToUpdate) return;

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

			const originalLanguage = languages[index].language;
			setPendingLanguages((prev) => new Set(prev).add(originalLanguage));
			setErrorMessage("");

			// Create a copy of languages for optimistic updates and potential rollback
			const originalLanguages = [...languages];

			// Update locally first for immediate feedback
			const updatedLanguages = [...languages];
			updatedLanguages[index] = {
				...updatedLanguages[index],
				language: editLanguage.trim(),
				level: Number.parseInt(editProficiency, 10),
			};

			onLanguagesChange(updatedLanguages);

			try {
				// If language has an ID, update it on the server
				if (languageToUpdate.languageId) {
					console.log("Updating language:", {
						id: languageToUpdate.languageId,
						name: editLanguage.trim(),
						level: PROFICIENCY_MAP[editProficiency],
					});

					await languagesService.update(languageToUpdate.languageId, {
						languageName: editLanguage.trim(),
						proficiencyLevel:
							PROFICIENCY_MAP[editProficiency] || "INTERMEDIATE",
					});

					showToast({
						title: "Language updated successfully",
						variant: "success",
					});
				} else {
					// If it's a new language that hasn't been saved yet, just update local state
					console.log("Updating unsaved language in UI (no API call needed)");

					showToast({
						title: "Language updated",
						variant: "success",
					});
				}

				setEditIndex(null);
				setEditLanguage("");
				setEditProficiency("5");
			} catch (error: unknown) {
				console.error("Error updating language:", error);

				// Rollback optimistic update
				onLanguagesChange(originalLanguages);

				showToast({
					title: "Failed to update language",
					description:
						typeof error === "object" && error && "message" in error
							? (error as { message?: string }).message || "Please try again"
							: "Please try again",
					variant: "error",
				});
			} finally {
				setPendingLanguages((prev) => {
					const newSet = new Set(prev);
					newSet.delete(originalLanguage);
					return newSet;
				});
			}
		},
		[editLanguage, editProficiency, languages, onLanguagesChange],
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

	const handleCancelEdit = useCallback(() => {
		setEditIndex(null);
		setEditLanguage("");
		setEditProficiency("5");
		setErrorMessage("");
	}, []);

	const handleCancelDelete = useCallback(() => {
		setDeleteDialogOpen(false);
		setLanguageToDelete(null);
	}, []);

	const getProficiencyLabel = useCallback((level: number) => {
		if (level >= 9) return "Native";
		if (level >= 7) return "Fluent";
		if (level >= 5) return "Intermediate";
		return "Beginner";
	}, []);

	const getLanguageKey = useCallback(
		(lang: LanguageProficiencyType, index: number) => {
			if (lang.languageId) return `lang-${lang.languageId}`;
			return `lang-${index}-${lang.language.replace(/\s+/g, "-")}`;
		},
		[],
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

	const isPending = useCallback(
		(language: string) => {
			return pendingLanguages.has(language);
		},
		[pendingLanguages],
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
					disabled={pendingLanguages.size > 0}
				/>

				<Select
					value={selectedProficiency}
					onValueChange={setSelectedProficiency}
					disabled={pendingLanguages.size > 0}
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
						pendingLanguages.size > 0 ||
						languages.length >= MAX_LANGUAGES ||
						!newLanguage.trim()
					}
				>
					{pendingLanguages.has(newLanguage) ? (
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

			{languages.length >= MAX_LANGUAGES && (
				<div className="text-amber-600 text-sm mb-4">
					Maximum number of languages reached. Remove some languages to add new
					ones.
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{languages.map((lang, index) => (
					<div
						key={getLanguageKey(lang, index)}
						className={cn(
							"bg-blue-50 rounded-lg p-4 relative",
							isPending(lang.language) && "opacity-70",
						)}
					>
						{editIndex === index ? (
							<>
								<Input
									value={editLanguage}
									onChange={(e) => setEditLanguage(e.target.value)}
									className="mb-2"
									disabled={isPending(lang.language)}
								/>
								<Select
									value={editProficiency}
									onValueChange={setEditProficiency}
									disabled={isPending(lang.language)}
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
										onClick={() => handleUpdateLanguage(index)}
										disabled={isPending(lang.language)}
									>
										<Check className="h-4 w-4" />
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={handleCancelEdit}
										disabled={isPending(lang.language)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</>
						) : (
							<>
								<div className="font-medium text-lg flex items-center justify-between">
									<span>{lang.language}</span>
									{!isPending(lang.language) && (
										<Button
											size="icon"
											variant="ghost"
											className="ml-2"
											onClick={() => handleEditStart(index)}
											disabled={isPending(lang.language)}
										>
											<Pencil className="h-4 w-4 text-gray-500" />
										</Button>
									)}
								</div>
								<div className="text-gray-600">
									{getProficiencyLabel(lang.level)}
								</div>

								<div className="flex items-center mt-2">
									{Array.from({ length: 9 }).map((_, i) => (
										<div
											key={`level-${getLanguageKey(lang, index)}-${i + 1}`}
											className={cn(
												"h-2 w-2 rounded-full mx-0.5",
												i < lang.level ? "bg-blue-500" : "bg-gray-200",
											)}
										/>
									))}
								</div>

								{!isPending(lang.language) && (
									<button
										type="button"
										onClick={() => confirmDeleteLanguage(lang)}
										className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
										aria-label={`Remove ${lang.language}`}
										disabled={isPending(lang.language)}
									>
										<Trash2 className="h-4 w-4" />
									</button>
								)}

								{isPending(lang.language) && (
									<div className="absolute top-2 right-2">
										<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Language</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{languageToDelete?.language}"?
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancelDelete}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteLanguage}
							className="bg-red-500 hover:bg-red-600"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default LanguageProficiency;

// Type guard for error with response
function hasResponseStatus(
	error: unknown,
): error is { response: { status: number } } {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as { response?: unknown }).response === "object" &&
		(error as { response: { status?: unknown } }).response?.status !== undefined
	);
}
