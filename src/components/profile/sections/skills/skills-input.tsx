import type React from "react";
import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import SkillPill from "./skill-pill";
import type { Skill } from "@/types/skills";
import { showToast } from "@/services/toast";
import { api } from "@/services/api";
import { ApiQueueManager } from "@/lib/utils/api-queue-utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ErrorWithResponse } from "@/types/errors";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useProfile } from "@/hooks/use-profile";

interface SkillsInputProps {
	skills: Skill[];
	onChange: (skills: Skill[]) => void;
	title?: string;
	placeholder?: string;
	className?: string;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
	skills,
	onChange,
	title = "Skills",
	placeholder = "Enter Skill",
	className,
}) => {
	const [newSkill, setNewSkill] = useState("");
	const [pendingSkills, setPendingSkills] = useState<Set<string>>(new Set());
	const [newRating, setNewRating] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const apiQueue = useRef<ApiQueueManager>(
		new ApiQueueManager({ delayBetweenRequests: 300 }),
	);

	// Edit skill state
	const [editSkillDialogOpen, setEditSkillDialogOpen] = useState(false);
	const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
	const [editSkillName, setEditSkillName] = useState("");
	const [editSkillRating, setEditSkillRating] = useState("");
	const [editErrorMessage, setEditErrorMessage] = useState("");

	// Get the updateSkillById function from the useProfile hook
	const { updateSkillById } = useProfile({ userType: "applicant" });

	const MAX_SKILLS = 20;
	const MAX_SKILL_LENGTH = 50;

	const handleAddSkill = useCallback(async () => {
		// Clear previous error messages
		setErrorMessage("");

		if (!newSkill.trim()) {
			setErrorMessage("Please enter a skill name");
			return;
		}

		if (newSkill.length > MAX_SKILL_LENGTH) {
			setErrorMessage(
				`Skill name cannot exceed ${MAX_SKILL_LENGTH} characters`,
			);
			return;
		}

		if (!newRating) {
			setErrorMessage("Please select a rating");
			return;
		}

		if (skills.length >= MAX_SKILLS) {
			setErrorMessage(`Maximum of ${MAX_SKILLS} skills allowed`);
			return;
		}

		// Improved duplicate detection - check if the skill name already exists (case-insensitive)
		const normalizedNewSkill = newSkill.trim().toLowerCase();
		if (
			skills.some((s) => s.name.toLowerCase() === normalizedNewSkill) ||
			Array.from(pendingSkills).some(
				(pendingSkill) => pendingSkill.toLowerCase() === normalizedNewSkill,
			)
		) {
			setErrorMessage("This skill already exists");
			return;
		}

		setPendingSkills((prev) => new Set(prev).add(newSkill));

		try {
			const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

			const skillToAdd: Skill = {
				id: tempId,
				name: newSkill.trim(),
				experienceRating: newRating,
				isTemporary: true,
			};

			const updatedSkills = [...skills, skillToAdd];
			onChange(updatedSkills);

			const apiCall = async () => {
				const response = await api.post("/api/v1/applicants/add-skills", {
					skillsAndExperienceRatings: [
						{
							skillName: newSkill.trim(),
							experienceRating: newRating,
						},
					],
				});

				console.log("Skill added response:", response.data);

				let serverId: string | number | undefined;
				if (response.data?.id) {
					serverId = response.data.id;
				} else if (response.data?.skillId) {
					serverId = response.data.skillId;
				} else if (Array.isArray(response.data) && response.data[0]?.id) {
					serverId = response.data[0].id;
				} else if (response.data?.skillsAndExperienceRatings?.[0]?.id) {
					serverId = response.data.skillsAndExperienceRatings[0].id;
				} else if (response.data?.data?.[0]?.id) {
					serverId = response.data.data[0].id;
				}

				if (serverId) {
					console.log(`Skill ${newSkill} received server ID:`, serverId);

					// Get the current skills and update the temporary skill with the server ID
					const finalSkills = skills.map((skill) => {
						if (skill.id === tempId) {
							return {
								...skill,
								id: serverId.toString(),
								isTemporary: false,
							};
						}
						return skill;
					});

					onChange(finalSkills);
				} else {
					console.warn(
						"Server did not return a skill ID, using temporary ID for now",
					);
				}

				return response.data;
			};

			await apiQueue.current.enqueue(apiCall);

			setNewSkill("");
			setNewRating("");
		} catch (error: unknown) {
			console.error("Error adding skill:", error);

			onChange(
				skills.filter((s) => s.name.toLowerCase() !== newSkill.toLowerCase()),
			);

			// Display the error from the backend if available
			if (typeof error === "object" && error !== null && "response" in error) {
				const apiError = error as ErrorWithResponse;
				if (apiError.response?.data?.message) {
					setErrorMessage(apiError.response.data.message);
				} else {
					setErrorMessage("Failed to add skill. Please try again.");
				}
			} else {
				setErrorMessage("Failed to add skill. Please try again.");
			}
		} finally {
			setPendingSkills((prev) => {
				const newSet = new Set(prev);
				newSet.delete(newSkill);
				return newSet;
			});
		}
	}, [newSkill, newRating, skills, onChange, pendingSkills]);

	const handleRemoveSkill = useCallback(
		async (skillToRemove: Skill) => {
			const isTemporarySkill =
				skillToRemove.isTemporary ||
				(typeof skillToRemove.id === "string" &&
					skillToRemove.id.startsWith("temp-"));

			console.log("Removing skill:", {
				name: skillToRemove.name,
				id: skillToRemove.id,
				isTemporary: isTemporarySkill,
			});

			const originalSkills = [...skills];
			const updatedSkills = skills.filter(
				(skill) => skill.id !== skillToRemove.id,
			);

			onChange(updatedSkills);

			setPendingSkills((prev) => new Set(prev).add(skillToRemove.name));

			try {
				if (!isTemporarySkill) {
					const apiCall = async () => {
						try {
							await api.delete(
								`/api/v1/applicants/delete-skill/${skillToRemove.id}`,
							);
							console.log(
								`Successfully removed skill with ID ${skillToRemove.id}`,
							);
							return true;
						} catch (error: unknown) {
							if (
								typeof error === "object" &&
								error !== null &&
								"response" in error &&
								(error as ErrorWithResponse).response?.status === 404
							) {
								console.warn(
									`Skill with ID ${skillToRemove.id} not found on server, may already be deleted`,
								);
								return true;
							}
							throw error;
						}
					};

					await apiQueue.current.enqueue(apiCall);
				} else {
					console.log("Removed temporary skill (no API call needed)");
				}
			} catch (error: unknown) {
				console.error("Error removing skill:", error);

				onChange(originalSkills);

				showToast({
					title: "Failed to remove skill",
					description:
						error instanceof Error ? error.message : "Please try again",
					variant: "error",
				});
			} finally {
				setPendingSkills((prev) => {
					const newSet = new Set(prev);
					newSet.delete(skillToRemove.name);
					return newSet;
				});
			}
		},
		[skills, onChange],
	);

	const handleEditSkill = useCallback(
		(id: string | number, name: string, rating: string) => {
			const skill = skills.find((s) => s.id === id);
			if (!skill) return;

			setSkillToEdit(skill);
			setEditSkillName(name);
			setEditSkillRating(rating);
			setEditErrorMessage("");
			setEditSkillDialogOpen(true);
		},
		[skills],
	);

	const handleSaveSkillEdit = useCallback(async () => {
		if (!skillToEdit) return;

		// Validation
		if (!editSkillName.trim()) {
			setEditErrorMessage("Please enter a skill name");
			return;
		}

		if (editSkillName.length > MAX_SKILL_LENGTH) {
			setEditErrorMessage(
				`Skill name cannot exceed ${MAX_SKILL_LENGTH} characters`,
			);
			return;
		}

		if (!editSkillRating) {
			setEditErrorMessage("Please select a rating");
			return;
		}

		// Check for duplicates
		if (editSkillName.toLowerCase() !== skillToEdit.name.toLowerCase()) {
			const isDuplicate = skills.some(
				(s) =>
					s.id !== skillToEdit.id &&
					s.name.toLowerCase() === editSkillName.toLowerCase(),
			);

			if (isDuplicate) {
				setEditErrorMessage(
					`A skill with name "${editSkillName}" already exists`,
				);
				return;
			}
		}

		try {
			// Update locally first
			const updatedSkills = skills.map((skill) => {
				if (skill.id === skillToEdit.id) {
					return {
						...skill,
						name: editSkillName,
						experienceRating: editSkillRating,
					};
				}
				return skill;
			});

			// Update in the UI
			onChange(updatedSkills);

			// Call the API
			const success = await updateSkillById(
				skillToEdit.id,
				editSkillName,
				editSkillRating,
			);

			if (success) {
				setEditSkillDialogOpen(false);
			}
		} catch (error) {
			console.error("Error updating skill:", error);
			setEditErrorMessage("Failed to update skill. Please try again.");
		}
	}, [
		skillToEdit,
		editSkillName,
		editSkillRating,
		skills,
		onChange,
		updateSkillById,
	]);

	const handleInputKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleAddSkill();
			}
		},
		[handleAddSkill],
	);

	const isSkillPending = useCallback(
		(skillName: string) => {
			return pendingSkills.has(skillName);
		},
		[pendingSkills],
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewSkill(e.target.value);
		if (errorMessage) {
			setErrorMessage("");
		}
	};

	return (
		<div className={className}>
			{title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

			<div className="flex gap-2 mb-4 md:px-10">
				<Input
					value={newSkill}
					onChange={handleInputChange}
					placeholder={placeholder}
					onKeyPress={handleInputKeyPress}
					className={`flex-grow ${newSkill.length > MAX_SKILL_LENGTH ? "border-red-500" : ""}`}
					disabled={pendingSkills.size > 0}
				/>
				<div className="flex flex-row justify-end">
					<Select
						value={newRating}
						onValueChange={(value) => {
							setNewRating(value);
							if (errorMessage) setErrorMessage("");
						}}
						disabled={pendingSkills.size > 0}
					>
						<SelectTrigger className="w-full sm:w-[200px]">
							<SelectValue placeholder="Select Rating" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ONE">1</SelectItem>
							<SelectItem value="TWO">2</SelectItem>
							<SelectItem value="THREE">3</SelectItem>
							<SelectItem value="FOUR">4</SelectItem>
							<SelectItem value="FIVE">5</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button
					onClick={handleAddSkill}
					size="sm"
					className="bg-sky-500 hover:bg-sky-600"
					disabled={
						pendingSkills.size > 0 ||
						!newSkill.trim() ||
						skills.length >= MAX_SKILLS ||
						!newRating ||
						newSkill.length > MAX_SKILL_LENGTH
					}
				>
					{pendingSkills.has(newSkill) ? (
						<Loader2 className="h-4 w-4 mr-1 animate-spin" />
					) : (
						<Plus className="h-4 w-4 mr-1" />
					)}
					Add Skill
				</Button>
			</div>

			{errorMessage && (
				<div className="text-red-500 text-sm mb-4 md:px-10">{errorMessage}</div>
			)}

			{newSkill.length > MAX_SKILL_LENGTH && !errorMessage && (
				<div className="text-red-500 text-sm mb-4 md:px-10">
					Skill name is too long (maximum {MAX_SKILL_LENGTH} characters)
				</div>
			)}

			{skills.length >= MAX_SKILLS && (
				<div className="text-amber-600 text-sm mb-4 md:px-10">
					Maximum number of skills reached. Remove some skills to add new ones.
				</div>
			)}

			<div className="flex flex-wrap gap-2 mt-4 md:px-10">
				{skills.map((skill) => (
					<SkillPill
						key={skill.id}
						id={skill.id}
						skill={skill.name}
						experienceRating={skill.experienceRating}
						isEditing={true}
						onRemove={() => handleRemoveSkill(skill)}
						onEdit={handleEditSkill}
						disabled={isSkillPending(skill.name)}
						className={skill.isTemporary ? "bg-slate-400" : ""}
					/>
				))}
			</div>

			{/* Edit Skill Dialog */}
			<Dialog open={editSkillDialogOpen} onOpenChange={setEditSkillDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Skill</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<label htmlFor="edit-skill-name" className="text-sm font-medium">
								Skill Name
							</label>
							<Input
								id="edit-skill-name"
								value={editSkillName}
								onChange={(e) => {
									setEditSkillName(e.target.value);
									if (editErrorMessage) setEditErrorMessage("");
								}}
								className={
									editSkillName.length > MAX_SKILL_LENGTH
										? "border-red-500"
										: ""
								}
							/>
							{editSkillName.length > MAX_SKILL_LENGTH && (
								<p className="text-red-500 text-xs">
									Skill name cannot exceed {MAX_SKILL_LENGTH} characters
								</p>
							)}
						</div>

						<div className="space-y-2">
							<label
								htmlFor="edit-skill-rating"
								className="text-sm font-medium"
							>
								Rating
							</label>
							<Select
								value={editSkillRating}
								onValueChange={(value) => {
									setEditSkillRating(value);
									if (editErrorMessage) setEditErrorMessage("");
								}}
							>
								<SelectTrigger id="edit-skill-rating">
									<SelectValue placeholder="Select Rating" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ONE">1</SelectItem>
									<SelectItem value="TWO">2</SelectItem>
									<SelectItem value="THREE">3</SelectItem>
									<SelectItem value="FOUR">4</SelectItem>
									<SelectItem value="FIVE">5</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{editErrorMessage && (
							<div className="text-red-500 text-sm">{editErrorMessage}</div>
						)}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditSkillDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSaveSkillEdit}
							className="bg-primary-base hover:bg-primary-dark"
						>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SkillsInput;
