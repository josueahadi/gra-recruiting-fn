import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/services/toast";
import { questionsService } from "@/services/questions";
import type {
	MultipleChoiceAnswerDto,
	EssayAnswerDto,
	SubmitExamReqDto,
} from "@/types/questions";

interface UseExamOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export function useExam(options?: UseExamOptions) {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);
	const [currentAnswers, setCurrentAnswers] = useState<
		{
			questionId: number;
			optionId?: number;
			answer?: string;
		}[]
	>([]);

	const getExam = useQuery({
		queryKey: ["applicant-exam"],
		queryFn: async () => {
			console.log("Fetching exam questions...");
			const response = await questionsService.getExamQuestions();
			console.log("Exam API Response:", response);
			return response;
		},
		staleTime: 5 * 60 * 1000,
	});

	// Save an answer during the exam
	const saveAnswer = useCallback(
		(questionId: number, data: { optionId?: number; answer?: string }) => {
			setCurrentAnswers((prev) => {
				// Check if this question already has an answer
				const existingIndex = prev.findIndex(
					(a) => a.questionId === questionId,
				);

				if (existingIndex !== -1) {
					// Update existing answer
					const updated = [...prev];
					updated[existingIndex] = { questionId, ...data };
					return updated;
				}

				// Add new answer
				return [...prev, { questionId, ...data }];
			});
		},
		[],
	);

	const clearAnswers = useCallback(() => {
		setCurrentAnswers([]);
	}, []);

	const getAnswer = useCallback(
		(questionId: number) => {
			return currentAnswers.find((a) => a.questionId === questionId);
		},
		[currentAnswers],
	);

	// Track answered questions
	const getAnsweredQuestionIds = useCallback(() => {
		return currentAnswers.map((a) => a.questionId);
	}, [currentAnswers]);

	// Format answers for submission
	const formatAnswersForSubmission = useCallback((): SubmitExamReqDto => {
		const multipleChoiceAnswers: MultipleChoiceAnswerDto[] = [];
		const essayAnswers: EssayAnswerDto[] = [];

		currentAnswers.forEach((answer) => {
			if (answer.optionId !== undefined) {
				multipleChoiceAnswers.push({
					questionId: answer.questionId,
					optionId: answer.optionId,
				});
			} else if (answer.answer) {
				essayAnswers.push({
					questionId: answer.questionId,
					answer: answer.answer,
				});
			}
		});

		return {
			multipleChoiceAnswers,
			essayAnswers,
		};
	}, [currentAnswers]);

	// Check if the exam is complete and can be submitted
	const canSubmitExam = useCallback(() => {
		const exam = getExam.data;
		if (!exam) return false;

		// Count total questions
		const totalQuestions = [
			...(exam.section1?.questions || []),
			...(exam.section2?.questions || []),
		].length;

		// Count answered questions
		const answeredQuestions = currentAnswers.length;

		// Basic validation: check if all questions have been answered
		return answeredQuestions >= totalQuestions;
	}, [currentAnswers, getExam.data]);

	const submitExamMutation = useMutation({
		mutationFn: () => {
			setIsLoading(true);
			const formattedAnswers = formatAnswersForSubmission();
			return questionsService.submitExam(formattedAnswers);
		},
		onSuccess: () => {
			setIsLoading(false);
			clearAnswers();
			queryClient.invalidateQueries({ queryKey: ["applicant-exam"] });
			queryClient.invalidateQueries({ queryKey: ["applicant-results"] });
			showToast({
				title: "Exam submitted successfully",
				variant: "success",
			});
			if (options?.onSuccess) {
				options.onSuccess();
			}
		},
		onError: (error: Error) => {
			setIsLoading(false);
			showToast({
				title: "Failed to submit exam",
				description: error.message,
				variant: "error",
			});
			if (options?.onError) {
				options.onError(error);
			}
		},
	});

	return {
		isLoading: isLoading || getExam.isLoading,
		examData: getExam.data,
		isExamLoading: getExam.isLoading,
		examError: getExam.error,
		saveAnswer,
		getAnswer,
		clearAnswers,
		getAnsweredQuestionIds,
		submitExam: submitExamMutation.mutate,
		canSubmitExam,
		totalAnswered: currentAnswers.length,
	};
}
