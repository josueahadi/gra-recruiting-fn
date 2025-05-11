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

interface SkillsInputProps {
	skills: Skill[];
	onSkillsChange: (skills: Skill[]) => void;
	title?: string;
	placeholder?: string;
	className?: string;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
	skills,
	onSkillsChange,
	title = "Skills",
	placeholder = "Enter Skill",
	className,
}) => {
	const [newSkill, setNewSkill] = useState("");
	const [pendingSkills, setPendingSkills] = useState<Set<string>>(new Set());
	const apiQueue = useRef(new ApiQueueManager({ delayBetweenRequests: 300 }));

	const MAX_SKILLS = 20;

	const handleAddSkill = useCallback(async () => {
		if (!newSkill.trim()) return;

		if (skills.length >= MAX_SKILLS) {
			showToast({
				title: `Maximum of ${MAX_SKILLS} skills allowed.`,
				variant: "error",
			});
			return;
		}

		if (
			skills.some((s) => s.name.toLowerCase() === newSkill.trim().toLowerCase())
		) {
			showToast({
				title: "This skill already exists",
				variant: "error",
			});
			return;
		}

		setPendingSkills((prev) => new Set(prev).add(newSkill));

		try {
			// Generate a unique temporary ID
			const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

			const skillToAdd: Skill = {
				id: tempId,
				name: newSkill.trim(),
				isTemporary: true,
			};

			const updatedSkills = [...skills, skillToAdd];
			onSkillsChange(updatedSkills);

			const apiCall = async () => {
				const response = await api.post("/api/v1/applicants/add-skills", {
					skillsAndExperienceRatings: [
						{
							skillName: newSkill.trim(),
							experienceRating: "FIVE",
						},
					],
				});

				console.log("Skill added response:", response.data);

				let serverId;
				if (response.data?.id) {
					serverId = response.data.id;
				} else if (response.data?.skillId) {
					serverId = response.data.skillId;
				} else if (Array.isArray(response.data) && response.data[0]?.id) {
					serverId = response.data[0].id;
				} else if (response.data?.skillsAndExperienceRatings?.[0]?.id) {
					serverId = response.data.skillsAndExperienceRatings[0].id;
				}

				if (serverId) {
					console.log(`Skill ${newSkill} received server ID:`, serverId);

					const finalSkills = updatedSkills.map((skill) => {
						// Find the temporary skill we just added using its ID
						if (skill.id === tempId) {
							return {
								...skill,
								id: serverId.toString(),
								isTemporary: false,
							};
						}
						return skill;
					});

					onSkillsChange(finalSkills);
				} else {
					console.warn(
						"Server did not return a skill ID, using temporary ID for now",
					);
				}

				return response.data;
			};

			await apiQueue.current.enqueue(apiCall);

			setNewSkill("");

			showToast({
				title: "Skill added successfully",
				variant: "success",
			});
		} catch (error: any) {
			console.error("Error adding skill:", error);

			onSkillsChange(
				skills.filter((s) => s.name.toLowerCase() !== newSkill.toLowerCase()),
			);

			showToast({
				title: "Failed to add skill",
				description: error.message || "Please try again",
				variant: "error",
			});
		} finally {
			setPendingSkills((prev) => {
				const newSet = new Set(prev);
				newSet.delete(newSkill);
				return newSet;
			});
		}
	}, [newSkill, skills, onSkillsChange]);

	const handleRemoveSkill = useCallback(
		async (skillToRemove: Skill) => {
			// Use the isTemporary flag or check if ID is a string that starts with "temp-"
			const isTemporarySkill = 
				skillToRemove.isTemporary || 
				(typeof skillToRemove.id === 'string' && skillToRemove.id.startsWith("temp-"));

			console.log("Removing skill:", {
				name: skillToRemove.name,
				id: skillToRemove.id,
				isTemporary: isTemporarySkill,
			});

			const originalSkills = [...skills];
			const updatedSkills = skills.filter(
				(skill) => skill.id !== skillToRemove.id,
			);

			onSkillsChange(updatedSkills);

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
						} catch (error: { response?: { status?: number } }) {
							if (error.response?.status === 404) {
								console.warn(
									`Skill with ID ${skillToRemove.id} not found on server, may already be deleted`,
								);
								// Don't count this as a failure, just consider it already deleted
								return true;
							}
							throw error;
						}
					};

					await apiQueue.current.enqueue(apiCall);

					showToast({
						title: "Skill removed successfully",
						variant: "success",
					});
				} else {
					console.log("Removed temporary skill (no API call needed)");
				}
			} catch (error: any) {
				console.error("Error removing skill:", error);

				onSkillsChange(originalSkills);

				showToast({
					title: "Failed to remove skill",
					description: error.message || "Please try again",
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
		[skills, onSkillsChange],
	);

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

	return (
		<div className={className}>
			{title && <h3 className="text-lg font-medium mb-4">{title}</h3>}

			<div className="flex gap-2 mb-4">
				<Input
					value={newSkill}
					onChange={(e) => setNewSkill(e.target.value)}
					placeholder={placeholder}
					onKeyPress={handleInputKeyPress}
					className="flex-grow"
					disabled={pendingSkills.size > 0}
				/>
				<Button
					onClick={handleAddSkill}
					size="sm"
					className="bg-sky-500 hover:bg-sky-600"
					disabled={
						pendingSkills.size > 0 ||
						!newSkill.trim() ||
						skills.length >= MAX_SKILLS
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

			{skills.length >= MAX_SKILLS && (
				<div className="text-amber-600 text-sm mb-4">
					Maximum number of skills reached. Remove some skills to add new ones.
				</div>
			)}

			<div className="flex flex-wrap gap-2 mt-4">
				{skills.map((skill) => (
					<SkillPill
						key={skill.id}
						skill={skill.name}
						isEditing={true}
						onRemove={() => handleRemoveSkill(skill)}
						disabled={isSkillPending(skill.name)}
						className={skill.isTemporary ? "bg-slate-400" : ""}
					/>
				))}
			</div>
		</div>
	);
};

export default SkillsInput;
