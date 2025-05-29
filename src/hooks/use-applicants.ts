import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";

// Types
export interface Applicant {
	userId: number;
	name: string;
	email: string;
	phoneNumber: string;
	score: number | null;
	examStatus: string | null;
	status: "PENDING" | "PASSED" | "FAILED" | null;
	department: string | null;
	appliedAt: string;
}

export interface ApplicantsResponse {
	stats: {
		totalApplicants: number;
		totalPassedApplicants: number;
		totalFailedApplicants: number;
		totalPendingApplicants: number;
	};
	Applicants: Applicant[];
	page: number;
	take: number;
	pageCount: number;
	hasNextPage: boolean;
}

export interface ApplicantFilterParams {
	page?: number;
	take?: number;
	searchTerm?: string;
	scoreStatus?: "PENDING" | "PASSED" | "FAILED";
	applicantStatus?: "ACTIVE" | "ARCHIVED";
	fromDate?: string;
	toDate?: string;
	presetTimeFrame?:
		| "Today"
		| "Yesterday"
		| "ThisWeek"
		| "LastWeek"
		| "ThisMonth"
		| "LastMonth"
		| "ThisYear"
		| "LastYear";
	sortingOptions?: "ASC" | "DESC";
}

export function useApplicants(filterParams: ApplicantFilterParams = {}) {
	const queryClient = useQueryClient();

	const fetchApplicants = async () => {
		const params = new URLSearchParams();

		if (filterParams.page) params.append("page", filterParams.page.toString());
		if (filterParams.take) params.append("take", filterParams.take.toString());
		if (filterParams.searchTerm)
			params.append("searchTerm", filterParams.searchTerm);
		if (filterParams.scoreStatus)
			params.append("scoreStatus", filterParams.scoreStatus);
		if (filterParams.applicantStatus)
			params.append("applicantStatus", filterParams.applicantStatus);
		if (filterParams.fromDate) params.append("fromDate", filterParams.fromDate);
		if (filterParams.toDate) params.append("toDate", filterParams.toDate);
		if (filterParams.presetTimeFrame)
			params.append("presetTimeFrame", filterParams.presetTimeFrame);
		params.append("sortingOptions", filterParams.sortingOptions || "DESC");

		const response = await api.get(
			`/api/v1/admin/list-applicants?${params.toString()}`,
		);
		return response.data as ApplicantsResponse;
	};

	const applicants = useQuery({
		queryKey: ["applicants", filterParams],
		queryFn: fetchApplicants,
	});

	const deleteApplicant = useMutation({
		mutationFn: async (applicantId: string) => {
			const response = await api.delete(
				`/api/v1/admin/applicants/${applicantId}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["applicants"] });
			showToast({
				title: "Applicant deleted successfully",
				variant: "success",
			});
		},
		onError: (error: Error) => {
			showToast({
				title: "Failed to delete applicant",
				description: error.message,
				variant: "error",
			});
		},
	});

	const getApplicantStats = () => {
		if (!applicants.data?.stats) {
			return {
				total: 0,
				success: 0,
				failed: 0,
				waiting: 0,
			};
		}

		return {
			total: applicants.data.stats.totalApplicants,
			success: applicants.data.stats.totalPassedApplicants,
			failed: applicants.data.stats.totalFailedApplicants,
			waiting: applicants.data.stats.totalPendingApplicants,
		};
	};

	return {
		applicants,
		stats: getApplicantStats(),
		deleteApplicant,
	};
}
