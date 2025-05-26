/* eslint-disable @typescript-eslint/no-unused-vars */
// import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/services/toast";
import { questionsService } from "@/services/questions";
import type { TestResult } from "@/types/questions";

export interface ResultsFilterParams {
	search?: string;
	status?: string;
	department?: string;
	fromDate?: Date;
	toDate?: Date;
	page?: number;
	limit?: number;
}

export function useResults(filterParams: ResultsFilterParams = {}) {
	const queryClient = useQueryClient();
	const { page = 1, limit = 10 } = filterParams;

	const fetchResults = async () => {
		const response = await questionsService.getAllResults({
			page,
			limit,
			...filterParams,
		});
		return response;
	};

	const getResultsStats = () => {
		return {
			total: 0,
			success: 0,
			fail: 0,
			waiting: 0,
		};
	};

	const fetchResultById = async (id: string) => {
		const response = await questionsService.getResultById(id);
		return response;
	};

	const triggerAIGrading = useMutation({
		mutationFn: async (resultId: string) => {
			const response = await questionsService.triggerAIGrading(resultId);
			return response;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["results"] });
			showToast({
				title: `Result has been graded by AI Assistant with a score of ${data.score}`,
				variant: "success",
			});
		},
		onError: (_error) => {
			showToast({
				title: "Failed to complete the AI grading process. Please try again.",
				variant: "error",
			});
		},
	});

	return {
		results: useQuery({
			queryKey: ["results", page, limit, filterParams],
			queryFn: fetchResults,
		}),
		stats: getResultsStats(),
		getResultById: (id: string) => fetchResultById(id),
		triggerAIGrading,
	};
}
