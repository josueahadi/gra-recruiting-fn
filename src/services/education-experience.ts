import { api } from "@/services/api";
import type {
	EducationResponse,
	ExperienceResponse,
	ApiResponse,
} from "@/types/profile";

export interface AddEducationRequest {
	institutionName: string;
	educationLevel: string;
	program: string;
	dateJoined?: string | null;
	dateGraduated?: string | null;
}

export const educationService = {
	async add(
		data: AddEducationRequest,
	): Promise<ApiResponse<EducationResponse>> {
		const response = await api.post("/api/v1/applicants/add-education", data);
		return response.data;
	},

	async update(
		id: number,
		data: AddEducationRequest,
	): Promise<ApiResponse<EducationResponse>> {
		const response = await api.patch(
			`/api/v1/applicants/update-education/${id}`,
			data,
		);
		return response.data;
	},

	async delete(id: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/applicants/delete-education/${id}`,
		);
		return response.data;
	},
};

export interface AddExperienceRequest {
	companyName: string;
	jobTitle: string;
	employmentType: string;
	country?: string;
	startDate?: string;
	endDate?: string;
}

export const experienceService = {
	async add(
		data: AddExperienceRequest,
	): Promise<ApiResponse<ExperienceResponse>> {
		const response = await api.post("/api/v1/applicants/add-experience", data);
		return response.data;
	},

	async update(
		id: number,
		data: AddExperienceRequest,
	): Promise<ApiResponse<ExperienceResponse>> {
		const response = await api.patch(
			`/api/v1/applicants/updated-experience/${id}`,
			data,
		);
		return response.data;
	},

	async delete(id: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/applicants/delete-experience/${id}`,
		);
		return response.data;
	},
};
