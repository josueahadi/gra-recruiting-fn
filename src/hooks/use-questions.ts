import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Question, QuestionResDto } from "@/types/questions";
import { useState, useCallback } from "react";
import { questionsService } from "@/services/questions";
import { showToast } from "@/services/toast";
import type {
	QuestionOption,
	AddQuestionReqDto,
	EditQuestionReqDto,
	QuestionOptionReqDto,
	EditQuestionOptionReqDto,
	QuestionSection,
} from "@/types/questions";

interface UseQuestionsOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

interface QuestionQueryOptions {
	page?: number;
	take?: number;
	searchTerm?: string;
	section?: QuestionSection;
	fromDate?: string;
	toDate?: string;
	presetTimeFrame?: string;
	sortingOptions?: string;
	careerId?: number;
}

export const getQuestionsBySection = async () => {
	try {
		const response = await questionsService.getExamQuestions();
		const sections: { [key: string]: QuestionResDto[] } = {
			"1": response.section1?.questions || [],
			"2": response.section2?.questions || [],
		};
		return sections;
	} catch (error) {
		console.error("Error fetching questions by section:", error);
		return {
			"1": [],
			"2": [],
		};
	}
};

export function useQuestions(options?: UseQuestionsOptions) {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	// Fetch questions with pagination
	const questions = useQuery({
		queryKey: ["questions"],
		queryFn: () => questionsService.getAllQuestions(),
	});

	// Fetch a single question by ID
	const getQuestionById = (questionId: number) => {
		return useQuery({
			queryKey: ["question", questionId],
			queryFn: () => questionsService.getQuestionById(questionId),
			enabled: !!questionId,
		});
	};

	// Add a new question
	const addQuestionMutation = useMutation({
		mutationFn: (questionData: AddQuestionReqDto) => {
			setIsLoading(true);
			return questionsService.addQuestion(questionData);
		},
		onSuccess: () => {
			setIsLoading(false);
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			showToast({
				title: "Question added successfully",
				variant: "success",
			});
			if (options?.onSuccess) {
				options.onSuccess();
			}
		},
		onError: (error: Error) => {
			setIsLoading(false);
			showToast({
				title: "Failed to add question",
				description: error.message,
				variant: "error",
			});
			if (options?.onError) {
				options.onError(error);
			}
		},
	});

	// Update an existing question
	const updateQuestionMutation = useMutation({
		mutationFn: ({
			questionId,
			questionData,
		}: {
			questionId: number;
			questionData: EditQuestionReqDto;
		}) => {
			setIsLoading(true);
			return questionsService.updateQuestion(questionId, questionData);
		},
		onSuccess: (_, variables) => {
			setIsLoading(false);
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			queryClient.invalidateQueries({
				queryKey: ["question", variables.questionId],
			});
			showToast({
				title: "Question updated successfully",
				variant: "success",
			});
			if (options?.onSuccess) {
				options.onSuccess();
			}
		},
		onError: (error: Error) => {
			setIsLoading(false);
			showToast({
				title: "Failed to update question",
				description: error.message,
				variant: "error",
			});
			if (options?.onError) {
				options.onError(error);
			}
		},
	});

	// Delete a question
	const deleteQuestionMutation = useMutation({
		mutationFn: (questionId: number) => {
			setIsLoading(true);
			return questionsService.deleteQuestion(questionId);
		},
		onSuccess: () => {
			setIsLoading(false);
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			showToast({
				title: "Question deleted successfully",
				variant: "success",
			});
			if (options?.onSuccess) {
				options.onSuccess();
			}
		},
		onError: (error: Error) => {
			setIsLoading(false);
			showToast({
				title: "Failed to delete question",
				description: error.message,
				variant: "error",
			});
			if (options?.onError) {
				options.onError(error);
			}
		},
	});

	// Add a question option
	const addQuestionOptionMutation = useMutation({
		mutationFn: ({
			questionId,
			optionData,
		}: {
			questionId: number;
			optionData: QuestionOptionReqDto;
		}) => {
			setIsLoading(true);
			return questionsService.addQuestionOption(questionId, optionData);
		},
		onSuccess: (_, variables) => {
			setIsLoading(false);
			queryClient.invalidateQueries({
				queryKey: ["question", variables.questionId],
			});
			showToast({
				title: "Option added successfully",
				variant: "success",
			});
			if (options?.onSuccess) {
				options.onSuccess();
			}
		},
		onError: (error: Error) => {
			setIsLoading(false);
			showToast({
				title: "Failed to add option",
				description: error.message,
				variant: "error",
			});
			if (options?.onError) {
				options.onError(error);
			}
		},
	});

	// Update a question option
	const updateQuestionOptionMutation = useMutation({
		mutationFn: ({
			optionId,
			optionData,
			questionId,
		}: {
			optionId: number;
			optionData: EditQuestionOptionReqDto;
			questionId: number;
		}) => {
			setIsLoading(true);
			return questionsService.updateQuestionOption(optionId, optionData);
		},
		onSuccess: (_, variables) => {
			setIsLoading(false);
			queryClient.invalidateQueries({
				queryKey: ["question", variables.questionId],
			});
			showToast({
				title: "Option updated successfully",
				variant: "success",
			});
			if (options?.onSuccess) {
				options.onSuccess();
			}
		},
		onError: (error: Error) => {
			setIsLoading(false);
			showToast({
				title: "Failed to update option",
				description: error.message,
				variant: "error",
			});
			if (options?.onError) {
				options.onError(error);
			}
		},
	});

	// Delete a question option
	const deleteQuestionOptionMutation = useMutation({
		mutationFn: ({
			optionId,
			questionId,
		}: {
			optionId: number;
			questionId: number;
		}) => {
			setIsLoading(true);
			return questionsService.deleteQuestionOption(optionId);
		},
		onSuccess: (_, variables) => {
			setIsLoading(false);
			queryClient.invalidateQueries({
				queryKey: ["question", variables.questionId],
			});
			showToast({
				title: "Option deleted successfully",
				variant: "success",
			});
			if (options?.onSuccess) {
				options.onSuccess();
			}
		},
		onError: (error: Error) => {
			setIsLoading(false);
			showToast({
				title: "Failed to delete option",
				description: error.message,
				variant: "error",
			});
			if (options?.onError) {
				options.onError(error);
			}
		},
	});

	// Upload a question image
	const uploadQuestionImage = useCallback(
		async (file: File): Promise<string> => {
			try {
				setIsLoading(true);
				const result = await questionsService.uploadQuestionImage(file);
				return result.fileUrl;
			} catch (error) {
				showToast({
					title: "Failed to upload image",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "error",
				});
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Upload an option image
	const uploadOptionImage = useCallback(async (file: File): Promise<string> => {
		try {
			setIsLoading(true);
			const result = await questionsService.uploadOptionImage(file);
			return result.fileUrl;
		} catch (error) {
			showToast({
				title: "Failed to upload image",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "error",
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const questionSections: QuestionSection[] = [
		"MATH",
		"COMPUTER_LITERACY",
		"GENERAL_PROBLEM_SOLVING",
		"GENERAL_QUESTIONS",
	];

	const getQuestionSectionLabel = (section: QuestionSection): string => {
		switch (section) {
			case "MATH":
				return "Mathematics";
			case "COMPUTER_LITERACY":
				return "Computer Literacy";
			case "GENERAL_PROBLEM_SOLVING":
				return "General Problem Solving";
			case "GENERAL_QUESTIONS":
				return "General Questions";
			default:
				return section;
		}
	};

	return {
		isLoading,
		questions,
		metadata: questions.data
			? {
					total: questions.data.stats.totalQuestions,
					multipleChoice: questions.data.stats.totalMultipleChoiceQuestions,
					essay: questions.data.stats.totalEssayQuestions,
					types: ["Multiple Choice", "Essay"],
				}
			: {
					total: 0,
					multipleChoice: 0,
					essay: 0,
					types: [],
				},
		getQuestionById,
		addQuestion: addQuestionMutation.mutate,
		updateQuestion: updateQuestionMutation.mutate,
		deleteQuestion: deleteQuestionMutation.mutate,
		addQuestionOption: addQuestionOptionMutation.mutate,
		updateQuestionOption: updateQuestionOptionMutation.mutate,
		deleteQuestionOption: deleteQuestionOptionMutation.mutate,
		uploadQuestionImage,
		uploadOptionImage,
		questionSections,
		getQuestionSectionLabel,
	};
}
