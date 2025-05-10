import { api } from "@/services/api";
import type {
	AddEducationRequest,
	AddExperienceRequest,
} from "@/types/education-experience";

export const educationService = {
	add: async (data: AddEducationRequest) => {
		const response = await api.post("/api/v1/applicants/add-education", data);
		return response.data;
	},

	update: async (id: string, data: AddEducationRequest) => {
		const response = await api.patch(
			`/api/v1/applicants/update-education/${id}`,
			data,
		);
		return response.data;
	},

	delete: async (id: string) => {
		const response = await api.delete(
			`/api/v1/applicants/delete-education/${id}`,
		);
		return response.data;
	},
};

export const experienceService = {
	add: async (data: AddExperienceRequest) => {
		const response = await api.post("/api/v1/applicants/add-experience", data);
		return response.data;
	},

	update: async (id: string, data: AddExperienceRequest) => {
		const response = await api.patch(
			`/api/v1/applicants/updated-experience/${id}`,
			data,
		);
		return response.data;
	},

	delete: async (id: string) => {
		const response = await api.delete(
			`/api/v1/applicants/delete-experience/${id}`,
		);
		return response.data;
	},
};
