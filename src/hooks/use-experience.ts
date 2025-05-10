import { useMutation, useQueryClient } from "@tanstack/react-query";
import { experienceService } from "@/services/education-experience";
import type {
	Experience,
	AddExperienceRequest,
} from "@/types/education-experience";
import { showToast } from "@/services/toast";
import { convertUIDateToApiDate } from "@/lib/utils/date-utils";

export function useExperience() {
	const queryClient = useQueryClient();

	const addExperience = useMutation({
		mutationFn: async (experience: Omit<Experience, "id">) => {
			const apiData: AddExperienceRequest = {
				companyName: experience.companyName,
				jobTitle: experience.jobTitle,
				employmentType: experience.employmentType,
				country: experience.country,
				startDate: convertUIDateToApiDate(experience.startDate),
				endDate: convertUIDateToApiDate(experience.endDate),
			};

			return experienceService.add(apiData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			showToast({
				title: "Experience added successfully",
				variant: "success",
			});
		},
		onError: (error: Error) => {
			showToast({
				title: "Failed to add experience",
				description: error.message,
				variant: "error",
			});
		},
	});

	const updateExperience = useMutation({
		mutationFn: async ({
			id,
			data,
		}: { id: string; data: Omit<Experience, "id"> }) => {
			const apiData: AddExperienceRequest = {
				companyName: data.companyName,
				jobTitle: data.jobTitle,
				employmentType: data.employmentType,
				country: data.country,
				startDate: convertUIDateToApiDate(data.startDate),
				endDate: convertUIDateToApiDate(data.endDate),
			};

			return experienceService.update(id, apiData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			showToast({
				title: "Experience updated successfully",
				variant: "success",
			});
		},
		onError: (error: Error) => {
			showToast({
				title: "Failed to update experience",
				description: error.message,
				variant: "error",
			});
		},
	});

	const deleteExperience = useMutation({
		mutationFn: async (id: string) => {
			return experienceService.delete(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			showToast({
				title: "Experience removed successfully",
				variant: "success",
			});
		},
		onError: (error: Error) => {
			showToast({
				title: "Failed to remove experience",
				description: error.message,
				variant: "error",
			});
		},
	});

	return {
		addExperience,
		updateExperience,
		deleteExperience,
	};
}
