import { useMutation, useQueryClient } from "@tanstack/react-query";
import { educationService } from "@/services/education-experience";
import type {
	Education,
	AddEducationRequest,
} from "@/types/education-experience";
import { showToast } from "@/services/toast";
import { convertUIDateToApiDate } from "@/lib/utils/date-utils";

export function useEducation() {
	const queryClient = useQueryClient();

	const addEducation = useMutation({
		mutationFn: async (education: Omit<Education, "id">) => {
			const apiData: AddEducationRequest = {
				institutionName: education.institutionName,
				educationLevel: education.educationLevel,
				program: education.program,
				dateJoined: convertUIDateToApiDate(education.dateJoined),
				dateGraduated: convertUIDateToApiDate(education.dateGraduated),
			};

			return educationService.add(apiData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			showToast({
				title: "Education added successfully",
				variant: "success",
			});
		},
		onError: (error: Error) => {
			showToast({
				title: "Failed to add education",
				description: error.message,
				variant: "error",
			});
		},
	});

	const updateEducation = useMutation({
		mutationFn: async ({
			id,
			data,
		}: { id: string; data: Omit<Education, "id"> }) => {
			const apiData: AddEducationRequest = {
				institutionName: data.institutionName,
				educationLevel: data.educationLevel,
				program: data.program,
				dateJoined: convertUIDateToApiDate(data.dateJoined),
				dateGraduated: convertUIDateToApiDate(data.dateGraduated),
			};

			return educationService.update(id, apiData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			showToast({
				title: "Education updated successfully",
				variant: "success",
			});
		},
		onError: (error: Error) => {
			showToast({
				title: "Failed to update education",
				description: error.message,
				variant: "error",
			});
		},
	});

	const deleteEducation = useMutation({
		mutationFn: async (id: string) => {
			return educationService.delete(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			showToast({
				title: "Education removed successfully",
				variant: "success",
			});
		},
		onError: (error: Error) => {
			showToast({
				title: "Failed to remove education",
				description: error.message,
				variant: "error",
			});
		},
	});

	return {
		addEducation,
		updateEducation,
		deleteEducation,
	};
}
