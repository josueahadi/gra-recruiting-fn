import { api } from "@/services/api";
import type { ListCareersResponse, CareerResponse } from "@/types/profile";

export const careerService = {
	/**
	 * List all available careers/departments
	 * @param page Page number
	 * @param sortingOptions Sort order (ASC/DESC)
	 */
	async listCareers(
		page = 1,
		sortingOptions = "ASC",
	): Promise<ListCareersResponse> {
		const { data } = await api.get("/api/v1/career/list-careers", {
			params: { page, sortingOptions },
		});
		return data;
	},
	async getCareer(id: number): Promise<CareerResponse> {
		const { data } = await api.get(`/api/v1/career/${id}`);
		return data;
	},
};
