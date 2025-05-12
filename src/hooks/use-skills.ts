import { useCallback, useState } from "react";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import { skillsService } from "@/services/skills";
import type { Skill, ApplicantData } from "@/types/profile";
import type { QueryClient } from "@tanstack/react-query";

export function useSkills(
	profileData: ApplicantData | null,
	setProfileData: (data: ApplicantData | null) => void,
	queryClient: QueryClient,
) {
	const [pendingSkills, setPendingSkills] = useState<Set<string>>(new Set());
	const [skillsLoading, setSkillsLoading] = useState(false);

	const updateSkills = useCallback(
		async (skills: Skill[]) => {
			if (!profileData) return false;
			setSkillsLoading(true);

			try {
				// Optimistic update
				setProfileData({ ...profileData, skills });

				// Prepare payload for API
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

			try {
				setSkillsLoading(true);
				setPendingSkills((prev) => new Set(prev).add(skillName));

				// Create a temporary ID for optimistic UI update
				const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

				// Update UI immediately (optimistic update)
				setProfileData({
					...profileData,
					skills: [
						...profileData.skills,
						{
							id: tempId,
							name: skillName,
							isTemporary: true,
						},
					],
				});

				// Make API call
				const result = await skillsService.add([
					{
						skillName,
						experienceRating: "FIVE", // Default rating
					},
				]);

				const skillResponse = result.data[0]; // First skill from response

				// Update with server ID if available
				if (skillResponse?.id) {
					setProfileData({
						...profileData,
						skills: profileData.skills.map((skill) => {
							if (skill.id === tempId) {
								return {
									id: skillResponse.id,
									name: skillResponse.skillName,
									experienceRating: skillResponse.experienceRating,
									isTemporary: false,
								};
							}
							return skill;
						}),
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

				// Rollback the optimistic update
				setProfileData({
					...profileData,
					skills: profileData.skills.filter(
						(skill) => skill.name !== skillName,
					),
				});

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

				// Update UI immediately (optimistic update)
				setProfileData({
					...profileData,
					skills: profileData.skills.filter((skill) => skill.id !== skillId),
				});

				// Make the API call
				await skillsService.delete(skillId);

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${skillToDelete.name} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting skill:", error);

				// Rollback to original state
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

	return {
		updateSkills,
		addSkill,
		deleteSkill,
		pendingSkills,
		skillsLoading,
	};
}
