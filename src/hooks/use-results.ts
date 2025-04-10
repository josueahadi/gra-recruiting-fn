/* eslint-disable @typescript-eslint/no-unused-vars */
// import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface TestResult {
	id: string;
	applicantId: string;
	applicantName: string;
	email: string;
	status: "success" | "fail" | "waiting";
	score: number | null;
	submittedAt: string;
	gradedAt?: string;
	gradedBy?: string;
	feedback?: string;
}

export interface PaginatedResults {
	data: TestResult[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

const MOCK_RESULTS = [
	{
		id: "1",
		applicantId: "a1",
		applicantName: "John Doe",
		email: "johndoe12@yahoo.com",
		status: "waiting" as const,
		score: null,
		submittedAt: "10/06/2025",
	},
	{
		id: "2",
		applicantId: "a2",
		applicantName: "Jonathon Smith",
		email: "johndoe12@hotmail.com",
		status: "success" as const,
		score: 86,
		submittedAt: "08/06/2025",
		gradedAt: "09/06/2025",
		gradedBy: "AI Assistant",
		feedback: "Excellent performance on technical questions.",
	},
	{
		id: "3",
		applicantId: "a3",
		applicantName: "Jane Roe",
		email: "johndoe12@yahoo.com",
		status: "success" as const,
		score: 86,
		submittedAt: "07/06/2025",
		gradedAt: "08/06/2025",
		gradedBy: "AI Assistant",
		feedback: "Strong problem-solving skills demonstrated.",
	},
	{
		id: "4",
		applicantId: "a4",
		applicantName: "Jack Black",
		email: "johndoe12@gmail.com",
		status: "success" as const,
		score: 86,
		submittedAt: "06/06/2025",
		gradedAt: "07/06/2025",
		gradedBy: "AI Assistant",
		feedback: "Excellent understanding of core concepts.",
	},
	{
		id: "5",
		applicantId: "a5",
		applicantName: "Mr. John Doe",
		email: "johndoe12@hotmail.com",
		status: "fail" as const,
		score: 55,
		submittedAt: "05/06/2025",
		gradedAt: "06/06/2025",
		gradedBy: "AI Assistant",
		feedback:
			"Need to improve on technical knowledge and problem-solving skills.",
	},
	{
		id: "6",
		applicantId: "a6",
		applicantName: "Jack Doe",
		email: "johndoe12@yahoo.com",
		status: "fail" as const,
		score: 48,
		submittedAt: "04/06/2025",
		gradedAt: "05/06/2025",
		gradedBy: "AI Assistant",
		feedback: "Lacks fundamental understanding of key concepts.",
	},
	{
		id: "7",
		applicantId: "a7",
		applicantName: "Jonathan Doe",
		email: "johndoe12@gmail.com",
		status: "success" as const,
		score: 86,
		submittedAt: "03/06/2025",
		gradedAt: "04/06/2025",
		gradedBy: "AI Assistant",
		feedback: "Strong performance across all sections.",
	},
	{
		id: "8",
		applicantId: "a8",
		applicantName: "Jake Doe",
		email: "johndoe12@hotmail.com",
		status: "waiting" as const,
		score: null,
		submittedAt: "02/06/2025",
	},
];

export const MOCK_EXAM_DATA = {
	questions: [
		{
			id: "q1",
			text: "What is the most important aspect of a well-structured resume?",
			type: "multiple-choice",
			applicantAnswer: "Clear formatting and organization",
			correctAnswer: "Clear formatting and organization",
			isCorrect: true,
		},
		{
			id: "q2",
			text: "Which of the following is NOT a recommended practice for technical interviews?",
			type: "multiple-choice",
			applicantAnswer: "Memorizing answers to common questions",
			correctAnswer: "Memorizing answers to common questions",
			isCorrect: true,
		},
		{
			id: "q3",
			text: "Explain the difference between synchronous and asynchronous programming.",
			type: "essay",
			applicantAnswer:
				"Synchronous programming executes tasks sequentially, blocking until each operation completes before moving to the next one. Asynchronous programming allows operations to be executed independently without blocking the main thread, enabling better performance and responsiveness in applications.",
			score: 9,
			maxScore: 10,
			feedback: "Excellent explanation with good practical context.",
		},
	],
};

export interface ResultsFilterParams {
	search?: string;
	status?: string;
	fromDate?: Date;
	toDate?: Date;
	page?: number;
	limit?: number;
}

export function useResults(filterParams: ResultsFilterParams = {}) {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const page = filterParams.page || 1;
	const limit = filterParams.limit || 10;

	const fetchResults = async () => {
		try {
			const filteredResults = MOCK_RESULTS.filter((result) => {
				const matchesSearch =
					!filterParams.search ||
					result.applicantName
						.toLowerCase()
						.includes(filterParams.search.toLowerCase()) ||
					result.email
						.toLowerCase()
						.includes(filterParams.search.toLowerCase());

				const matchesStatus =
					!filterParams.status ||
					filterParams.status === "all" ||
					result.status === filterParams.status;

				let matchesDateRange = true;
				if (filterParams.fromDate || filterParams.toDate) {
					const resultDate = new Date(result.submittedAt);
					if (filterParams.fromDate && resultDate < filterParams.fromDate)
						matchesDateRange = false;
					if (filterParams.toDate) {
						const nextDay = new Date(filterParams.toDate);
						nextDay.setDate(nextDay.getDate() + 1);
						if (resultDate >= nextDay) matchesDateRange = false;
					}
				}

				return matchesSearch && matchesStatus && matchesDateRange;
			});

			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedResults = filteredResults.slice(startIndex, endIndex);

			return {
				data: paginatedResults,
				meta: {
					total: filteredResults.length,
					page,
					limit,
					totalPages: Math.ceil(filteredResults.length / limit),
				},
			};
		} catch (error) {
			console.error("Error fetching results:", error);
			throw error;
		}
	};

	const getResultsStats = () => {
		const total = MOCK_RESULTS.length;
		const passed = MOCK_RESULTS.filter((r) => r.status === "success").length;
		const failed = MOCK_RESULTS.filter((r) => r.status === "fail").length;
		const waiting = MOCK_RESULTS.filter((r) => r.status === "waiting").length;

		return {
			total,
			passed,
			failed,
			waiting,
		};
	};

	const fetchResultById = async (id: string) => {
		const result = MOCK_RESULTS.find((r) => r.id === id);
		if (!result) throw new Error(`Result with ID ${id} not found`);
		return result;
	};

	const triggerAIGrading = useMutation({
		mutationFn: async (resultId: string) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const result = MOCK_RESULTS.find((r) => r.id === resultId);
			if (!result) throw new Error(`Result with ID ${resultId} not found`);

			result.status = Math.random() > 0.3 ? "success" : "fail";
			result.score =
				result.status === "success"
					? Math.floor(Math.random() * 21) + 80
					: Math.floor(Math.random() * 31) + 40;
			result.gradedAt = new Date().toLocaleDateString();
			result.gradedBy = "AI Assistant";
			result.feedback =
				result.status === "success"
					? "Strong performance across multiple areas. Good technical knowledge demonstrated."
					: "Needs improvement in core technical concepts and problem-solving skills.";

			return result;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["results"] });
			toast({
				title: "AI Grading Complete",
				description: `Result has been graded by AI Assistant with a score of ${data.score}`,
			});
		},
		onError: (_error) => {
			toast({
				title: "Grading Failed",
				description:
					"Failed to complete the AI grading process. Please try again.",
				variant: "destructive",
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
