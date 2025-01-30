import { api } from "@/services/api";
import type { PaginatedResponse, Question } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useQuestions(page = 1, limit = 10) {
	return useQuery<PaginatedResponse<Question>>({
		queryKey: ["questions", page, limit],
		queryFn: async () => {
			const { data } = await api.get(`/questions?page=${page}&limit=${limit}`);
			return data;
		},
	});
}

export function useCreateQuestion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newQuestion: Partial<Question>) => {
			const { data } = await api.post("/questions", newQuestion);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
		},
	});
}
