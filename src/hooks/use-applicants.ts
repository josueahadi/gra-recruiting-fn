import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Applicant, PaginatedResponse } from "@/types/api";

export function useApplicants(page = 1, limit = 10) {
  return useQuery<PaginatedResponse<Applicant>>({
    queryKey: ["applicants", page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/applicants?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

export function useApplicant(id: string) {
  return useQuery<Applicant>({
    queryKey: ["applicant", id],
    queryFn: async () => {
      const { data } = await api.get(`/applicants/${id}`);
      return data;
    },
  });
}

export function useCreateApplicant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newApplicant: Partial<Applicant>) => {
      const { data } = await api.post("/applicants", newApplicant);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });
}
