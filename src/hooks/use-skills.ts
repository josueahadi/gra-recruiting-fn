import { useCallback, useState, useRef } from "react";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import { ApiQueueManager } from "@/lib/utils/api-queue-utils";
import { skillsService } from "@/services/skills";
import type { Skill, ApplicantData } from "@/types/profile";

export function useSkills(
	profileData: ApplicantData | null,
	setProfileData: (data: ApplicantData | null) => void,
	queryClient: any,
) {
	const [pendingSkills, setPendingSkills] = useState<Set<string>>(new Set());
	const [skillsLoading, setSkillsLoading] = useState(false);
	const apiQueue = useRef(new ApiQueueManager({ delayBetweenRequests: 300 }));

	const updateSkills = useCallback(
		async (data: {
			technical: Skill[];
			soft: Skill[];
			languages?: any[];
			department?: string;
		}) => {
			if (!profileData) return false;
			setSkillsLoading(true);

			try {
				// Optimistic update
				setProfileData((prevData) => {
					if (!prevData) return null;
					return {
						...prevData,
						skills: {
							technical: data.technical,
							soft: data.soft,
						},
						department: data.department,
					};
				});

				if (data.department !== profileData.department) {
					try {
						// Get the list of careers from the API
						const careersResponse = await api.get(
							"/api/v1/career/list-careers",
						);

						// Find the career ID that matches the department name
						const career = careersResponse.data.careers.find(
							(career) => career.name === data.department,
						);

						if (career && career.id) {
							await api.patch("/api/v1/users/update-user-profile", {
								careerId: career.id,
							});
						} else {
							console.warn(
								"Could not find careerId for department:",
								data.department,
							);
						}
					} catch (error) {
						console.error("Error updating department:", error);
					}
				}

				if (data.technical.length > 0) {
					const skillsPayload = data.technical.map((skill) => ({
						skillName: skill.name,
						experienceRating: skill.experienceRating || "FIVE", // Default rating
					}));

					// Use update or add based on whether we have skills already
					const hasSkills = profileData.skills.technical.length > 0;

					try {
						if (hasSkills) {
							await skillsService.update(skillsPayload);
						} else {
							await skillsService.add(skillsPayload);
						}
					} catch (error) {
						console.error("Error updating skills:", error);
						throw error;
					}
				}

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
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: [
								...current.skills.technical,
								{
									tempId,
									name: skillName,
								},
							],
						},
					};
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
				if (skillResponse && skillResponse.id) {
					setProfileData((current) => {
						if (!current) return null;

						const updatedSkills = current.skills.technical.map((skill) => {
							if (skill.tempId === tempId) {
								return {
									id: skillResponse.id,
									name: skillResponse.skillName,
									experienceRating: skillResponse.experienceRating,
								};
							}
							return skill;
						});

						return {
							...current,
							skills: {
								...current.skills,
								technical: updatedSkills,
							},
						};
					});
				}

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${skillName} added successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error adding skill:", error);

				// Rollback the optimistic update
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: current.skills.technical.filter(
								(skill) => skill.name !== skillName,
							),
						},
					};
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

			const skillToDelete = profileData.skills.technical.find(
				(skill) => skill.id === skillId,
			);

			if (!skillToDelete) {
				console.error("Cannot delete skill - not found:", skillId);
				return false;
			}

			try {
				setSkillsLoading(true);
				setPendingSkills((prev) => new Set(prev).add(skillToDelete.name));

				// Store original state for rollback
				const originalSkills = [...profileData.skills.technical];

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: current.skills.technical.filter(
								(skill) => skill.id !== skillId,
							),
						},
					};
				});

				// Make the API call
				await skillsService.delete(skillId);

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${skillToDelete.name} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting skill:", error);

				// Rollback to original state
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: originalSkills,
						},
					};
				});

				showToast({
					title: `Failed to remove skill`,
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
