import { api } from "@/services/api";
import type { SkillResponse, ApiResponse } from "@/types/profile";

export interface SkillAndExperienceRating {
	skillName: string;
	experienceRating: string;
}

export const skillsService = {
	/**
	 * Add skills with experience ratings
	 */
	async add(
		skills: SkillAndExperienceRating[],
	): Promise<ApiResponse<SkillResponse[]>> {
		const response = await api.post("/api/v1/applicants/add-skills", {
			skillsAndExperienceRatings: skills,
		});
		return response.data;
	},

	/**
	 * Update skills with experience ratings
	 */
	async update(
		skills: SkillAndExperienceRating[],
	): Promise<ApiResponse<SkillResponse[]>> {
		const response = await api.patch("/api/v1/applicants/update-skills", {
			skillsAndExperienceRatings: skills,
		});
		return response.data;
	},

	/**
	 * Delete a skill by ID
	 */
	async delete(skillId: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/applicants/delete-skill/${skillId}`,
		);
		return response.data;
	},
};
