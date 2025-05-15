import { useCallback, useState } from "react";
import { showToast } from "@/services/toast";
import { skillsService } from "@/services/skills";
import type { Skill, ApplicantData } from "@/types/profile";
import type { QueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useSkills(
	profileData: ApplicantData | null,
	setProfileData: (data: ApplicantData | null) => void,
	queryClient: QueryClient,
) {
	const [pendingSkills, setPendingSkills] = useState<Set<string>>(new Set());
	const [skillsLoading, setSkillsLoading] = useState(false);

	const MAX_SKILL_LENGTH = 50;

	const updateSkills = useCallback(
		async (skills: Skill[]) => {
			if (!profileData) return false;

			for (const skill of skills) {
				if (skill.name.length > MAX_SKILL_LENGTH) {
					showToast({
						title: `Skill name cannot exceed ${MAX_SKILL_LENGTH} characters: "${skill.name.substring(0, 20)}..."`,
						variant: "error",
					});
					return false;
				}
			}

			setSkillsLoading(true);

			try {
				setProfileData({ ...profileData, skills });

				const skillsPayload = skills.map((skill) => ({
					skillName: skill.name,
					experienceRating: skill.experienceRating || "FIVE",
				}));

				await skillsService.update(skillsPayload);

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });
				queryClient.invalidateQueries({ queryKey: ["user-profile"] });

				return true;
			} catch (error) {
				console.error("Error updating skills:", error);

				setProfileData(profileData);

				showToast({
					title: "Failed to update skills",
					variant: "error",
				});
				return false;
			} finally {
				setSkillsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const addSkill = useCallback(
		async (skillName: string) => {
			if (!profileData) return false;

			// Normalize the skill name for comparison
			const normalizedSkillName = skillName.trim().toLowerCase();

			// Check if the skill already exists (case-insensitive)
			if (
				profileData.skills.some(
					(skill) => skill.name.trim().toLowerCase() === normalizedSkillName,
				)
			) {
				showToast({
					title: `Skill "${skillName}" already exists`,
					variant: "error",
				});
				return false;
			}

			if (skillName.length > MAX_SKILL_LENGTH) {
				showToast({
					title: `Skill name cannot exceed ${MAX_SKILL_LENGTH} characters`,
					variant: "error",
				});
				return false;
			}

			try {
				setSkillsLoading(true);
				setPendingSkills((prev) => new Set(prev).add(skillName));

				const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

				// Make a copy of the current skills to avoid mutation issues
				const currentSkills = [...profileData.skills];

				const tempSkill = {
					id: tempId,
					name: skillName,
					isTemporary: true,
				};

				// Update the UI optimistically
				const updatedProfileData = {
					...profileData,
					skills: [...currentSkills, tempSkill],
				};

				setProfileData(updatedProfileData);

				// Make the API call
				const result = await skillsService.add([
					{
						skillName,
						experienceRating: "FIVE",
					},
				]);

				const skillResponse = result.data[0];

				if (skillResponse?.id) {
					// Get the current state again
					const currentProfileData = { ...updatedProfileData };

					// Update the skill with the server ID
					const updatedSkills = currentProfileData.skills.map(
						(skill: Skill) => {
							if (skill.id === tempId) {
								return {
									id: skillResponse.id,
									name: skillResponse.skillName,
									experienceRating: skillResponse.experienceRating,
									isTemporary: false,
								};
							}
							return skill;
						},
					);

					// Set the updated data
					setProfileData({
						...currentProfileData,
						skills: updatedSkills,
					});
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${skillName} added successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error adding skill:", error);

				// Get the current profile data
				if (profileData) {
					// Revert the UI change on error
					const filteredSkills = profileData.skills.filter(
						(skill: Skill) => skill.name !== skillName || !skill.isTemporary,
					);

					setProfileData({
						...profileData,
						skills: filteredSkills,
					});
				}

				showToast({
					title: `Failed to add ${skillName}`,
					variant: "error",
				});

				return false;
			} finally {
				setPendingSkills((prev) => {
					const newSet = new Set(prev);
					newSet.delete(skillName);
					return newSet;
				});
				setSkillsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const deleteSkill = useCallback(
		async (skillId: number) => {
			if (!profileData) return false;

			const skillToDelete = profileData.skills.find(
				(skill) => skill.id === skillId,
			);

			if (!skillToDelete) {
				console.error("Cannot delete skill - not found:", skillId);
				return false;
			}

			try {
				setSkillsLoading(true);
				setPendingSkills((prev) => new Set(prev).add(skillToDelete.name));

				setProfileData({
					...profileData,
					skills: profileData.skills.filter((skill) => skill.id !== skillId),
				});

				await skillsService.delete(skillId);

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${skillToDelete.name} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting skill:", error);

				setProfileData({
					...profileData,
					skills: [...profileData.skills, skillToDelete],
				});

				showToast({
					title: "Failed to remove skill",
					variant: "error",
				});

				return false;
			} finally {
				if (skillToDelete) {
					setPendingSkills((prev) => {
						const newSet = new Set(prev);
						newSet.delete(skillToDelete.name);
						return newSet;
					});
				}
				setSkillsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const updateSkillById = useCallback(
		async (skillId: number | string, skillName: string, rating: string) => {
			if (!profileData) return false;

			if (skillName.length > MAX_SKILL_LENGTH) {
				showToast({
					title: `Skill name cannot exceed ${MAX_SKILL_LENGTH} characters`,
					variant: "error",
				});
				return false;
			}

			const skillToUpdate = profileData.skills.find(
				(skill) => skill.id === skillId,
			);

			if (!skillToUpdate) {
				console.error("Cannot update skill - not found:", skillId);
				return false;
			}

			// Check for duplicate name if name is changing
			if (skillName.toLowerCase() !== skillToUpdate.name.toLowerCase()) {
				const isDuplicate = profileData.skills.some(
					(skill) =>
						skill.id !== skillId &&
						skill.name.toLowerCase() === skillName.toLowerCase(),
				);

				if (isDuplicate) {
					showToast({
						title: `A skill with name "${skillName}" already exists`,
						variant: "error",
					});
					return false;
				}
			}

			// Store original state for rollback
			const originalSkill = { ...skillToUpdate };

			try {
				setSkillsLoading(true);
				setPendingSkills((prev) => new Set(prev).add(skillToUpdate.name));

				// Update UI optimistically
				setProfileData({
					...profileData,
					skills: profileData.skills.map((skill) => {
						if (skill.id === skillId) {
							return {
								...skill,
								name: skillName,
								experienceRating: rating,
							};
						}
						return skill;
					}),
				});

				// Make API call - Use the correct endpoint and payload structure
				await api.patch("/api/v1/applicants/update-skills", {
					skillsAndExperienceRatings: [
						{
							id: Number(skillId),
							skillName: skillName,
							experienceRating: rating,
						},
					],
				});

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: "Skill updated successfully",
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error updating skill:", error);

				// Revert UI changes on error
				setProfileData({
					...profileData,
					skills: profileData.skills.map((skill) => {
						if (skill.id === skillId) {
							return originalSkill;
						}
						return skill;
					}),
				});

				showToast({
					title: "Failed to update skill",
					variant: "error",
				});

				return false;
			} finally {
				setPendingSkills((prev) => {
					const newSet = new Set(prev);
					newSet.delete(skillToUpdate.name);
					return newSet;
				});
				setSkillsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	return {
		updateSkills,
		addSkill,
		deleteSkill,
		updateSkillById,
		pendingSkills,
		skillsLoading,
	};
}
