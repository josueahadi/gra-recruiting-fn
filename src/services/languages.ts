import { api } from "@/services/api";
import type { LanguageResponse, ApiResponse } from "@/types/profile";

export interface LanguageProficiencyPayload {
	languageName: string;
	proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "FLUENT" | "NATIVE";
}

export const languagesService = {
	/**
	 * Add a language with proficiency level
	 */
	async add(
		data: LanguageProficiencyPayload,
	): Promise<ApiResponse<LanguageResponse>> {
		const response = await api.post(
			"/api/v1/applicants/add-language-proficiency",
			data,
		);
		console.log("[languagesService] Add response:", response.data);
		return response.data;
	},

	/**
	 * Update a language proficiency
	 */
	async update(
		languageId: number,
		data: LanguageProficiencyPayload,
	): Promise<ApiResponse<LanguageResponse>> {
		const response = await api.patch(
			`/api/v1/applicants/update-language-proficiency/${languageId}`,
			data,
		);
		console.log("[languagesService] Update response:", response.data);
		return response.data;
	},

	/**
	 * Delete a language by ID
	 */
	async delete(languageId: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/applicants/delete-language-proficiency/${languageId}`,
		);
		console.log("[languagesService] Delete response:", response.data);
		return response.data;
	},
};
