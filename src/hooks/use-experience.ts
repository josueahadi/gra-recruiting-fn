import { useMutation, useQueryClient } from "@tanstack/react-query";
import { experienceService } from "@/services/education-experience";
import type {
	Experience,
	AddExperienceRequest,
} from "@/types/education-experience";
import { showToast } from "@/services/toast";

export function useExperience() {
	const queryClient = useQueryClient();

	const addExperience = useMutation({
		mutationFn: async (experience: Omit<Experience, "id">) => {
			const apiData: AddExperienceRequest = {
				companyName: experience.companyName,
				jobTitle: experience.jobTitle,
				employmentType: experience.employmentType,
				country: experience.country,
				startDate: experience.startDate,
				endDate: experience.endDate,
			};

			return experienceService.add(apiData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["application-profile"] });
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
		}: { id: number; data: Omit<Experience, "id"> }) => {
			console.log("[updateExperience] Starting update mutation with ID:", id);
			console.log("[updateExperience] Original data:", data);

			// Ensure dates are in correct ISO format
			let startDate = data.startDate;
			if (startDate && !startDate.includes("T")) {
				startDate = `${startDate}T00:00:00.000Z`;
			}

			let endDate = data.endDate;
			if (endDate && !endDate.includes("T")) {
				endDate = `${endDate}T00:00:00.000Z`;
			}

			const apiData: AddExperienceRequest = {
				companyName: data.companyName,
				jobTitle: data.jobTitle,
				employmentType: data.employmentType,
				country: data.country,
				startDate: startDate,
				endDate: endDate,
			};

			console.log("[updateExperience] Formatted API data:", apiData);
			return experienceService.update(id, apiData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["application-profile"] });
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
		mutationFn: async (id: number) => {
			return experienceService.delete(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["application-profile"] });
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
