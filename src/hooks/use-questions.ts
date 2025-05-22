// import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type {
	Question,
	MultipleChoiceQuestion,
	EssayQuestion,
	//   PaginatedQuestions,
	QuestionFilterParams,
} from "@/types";
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

const MOCK_QUESTIONS: Question[] = [
	{
		id: "01",
		text: "What is the most important aspect of a well-structured resume?",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "multiple-choice",
		active: true,
		createdAt: "01/02/2025",
		choices: [
			{ id: "c1", text: "Clear formatting and organization", isCorrect: true },
			{ id: "c2", text: "Including all past jobs", isCorrect: false },
			{ id: "c3", text: "Using advanced vocabulary", isCorrect: false },
			{ id: "c4", text: "Adding personal hobbies", isCorrect: false },
		],
	},
	{
		id: "02",
		text: "What are the essential components of a professional email?",
		excerpt:
			"Professional communication requires understanding key email components...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "03/02/2025",
		choices: [
			{ id: "c5", text: "Clear subject line", isCorrect: true },
			{ id: "c6", text: "Formal greeting", isCorrect: false },
			{ id: "c7", text: "Concise message", isCorrect: false },
			{ id: "c8", text: "Professional signature", isCorrect: false },
		],
	},
	{
		id: "03",
		text: "Which data structure would be most efficient for implementing a dictionary?",
		excerpt: "Data structure selection impacts application performance...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "05/02/2025",
		choices: [
			{ id: "c9", text: "Array", isCorrect: false },
			{ id: "c10", text: "Hash Table", isCorrect: true },
			{ id: "c11", text: "Linked List", isCorrect: false },
			{ id: "c12", text: "Stack", isCorrect: false },
		],
	},
	{
		id: "04",
		text: "What is the time complexity of binary search on a sorted array?",
		excerpt: "Algorithm efficiency is measured by time complexity...",
		section: "Multiple Choice",
		type: "Math",
		active: true,
		createdAt: "10/02/2025",
		choices: [
			{ id: "c13", text: "O(1)", isCorrect: false },
			{ id: "c14", text: "O(log n)", isCorrect: true },
			{ id: "c15", text: "O(n)", isCorrect: false },
			{ id: "c16", text: "O(n²)", isCorrect: false },
		],
	},
	{
		id: "05",
		text: "In React, what hook would you use to run code after a component renders?",
		excerpt: "React hooks provide capabilities for functional components...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "15/02/2025",
		choices: [
			{ id: "c17", text: "useState", isCorrect: false },
			{ id: "c18", text: "useContext", isCorrect: false },
			{ id: "c19", text: "useEffect", isCorrect: true },
			{ id: "c20", text: "useCallback", isCorrect: false },
		],
	},
	{
		id: "06",
		text: "What concept does the 'S' in SOLID principles stand for?",
		excerpt: "Software design principles guide development practices...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "18/02/2025",
		choices: [
			{ id: "c21", text: "Stateless Design", isCorrect: false },
			{ id: "c22", text: "Single Responsibility", isCorrect: true },
			{ id: "c23", text: "Simplified Architecture", isCorrect: false },
			{ id: "c24", text: "Scalable Programming", isCorrect: false },
		],
	},
	{
		id: "07",
		text: "Which is NOT a principle of REST architecture?",
		excerpt: "REST architecture defines standards for web services...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "22/02/2025",
		choices: [
			{ id: "c25", text: "Stateless", isCorrect: false },
			{ id: "c26", text: "Client-Server", isCorrect: false },
			{ id: "c27", text: "Real-time Updates", isCorrect: true },
			{ id: "c28", text: "Uniform Interface", isCorrect: false },
		],
	},
	{
		id: "08",
		text: "Which design pattern is React's context API most similar to?",
		excerpt: "Design patterns provide reusable solutions to common problems...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "01/03/2025",
		choices: [
			{ id: "c29", text: "Factory Pattern", isCorrect: false },
			{ id: "c30", text: "Observer Pattern", isCorrect: false },
			{ id: "c31", text: "Singleton Pattern", isCorrect: false },
			{ id: "c32", text: "Dependency Injection", isCorrect: true },
		],
	},
	{
		id: "09",
		text: "What is the primary purpose of TypeScript?",
		excerpt: "TypeScript extends JavaScript with additional features...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "05/03/2025",
		choices: [
			{ id: "c33", text: "To make JavaScript run faster", isCorrect: false },
			{
				id: "c34",
				text: "To add static type checking to JavaScript",
				isCorrect: true,
			},
			{ id: "c35", text: "To replace JavaScript entirely", isCorrect: false },
			{ id: "c36", text: "To provide UI components", isCorrect: false },
		],
	},
	{
		id: "10",
		text: "Select the correct pattern that should go in the empty space:",
		excerpt: "Pattern recognition tests spatial reasoning abilities...",
		section: "Multiple Choice",
		type: "Problem Solving",
		active: true,
		createdAt: "10/03/2025",
		imageUrl: "/images/assessment/pattern-question.png",
		choices: [
			{
				id: "c37",
				imageUrl: "/images/assessment/pattern-a.png",
				isCorrect: false,
			},
			{
				id: "c38",
				imageUrl: "/images/assessment/pattern-b.png",
				isCorrect: true,
			},
			{
				id: "c39",
				imageUrl: "/images/assessment/pattern-c.png",
				isCorrect: false,
			},
			{
				id: "c40",
				imageUrl: "/images/assessment/pattern-d.png",
				isCorrect: false,
			},
		],
	},
	{
		id: "11",
		text: "Which function composition would correctly apply function f followed by function g?",
		excerpt: "Functional programming uses composition of functions...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "15/03/2025",
		choices: [
			{ id: "c41", text: "f(g(x))", isCorrect: false },
			{ id: "c42", text: "g(f(x))", isCorrect: true },
			{ id: "c43", text: "f(x) + g(x)", isCorrect: false },
			{ id: "c44", text: "f(x) * g(x)", isCorrect: false },
		],
	},
	{
		id: "12",
		text: "What does the acronym API stand for?",
		excerpt: "APIs facilitate communication between software components...",
		section: "Multiple Choice",
		type: "Computer Skills",
		active: true,
		createdAt: "20/03/2025",
		choices: [
			{ id: "c45", text: "Application Programming Interface", isCorrect: true },
			{ id: "c46", text: "Automated Programming Interface", isCorrect: false },
			{ id: "c47", text: "Application Protocol Interface", isCorrect: false },
			{ id: "c48", text: "Advanced Programming Interface", isCorrect: false },
		],
	},
	{
		id: "13",
		text: "A well-structured resume is one of the most important tools for job seekers. It helps employers quickly assess a candidate's qualifications and suitability for a role. When creating a resume, what is the primary purpose it should serve in a job application?",
		excerpt: "Effective resume creation is a crucial professional skill...",
		section: "Essay",
		type: "essay",
		active: true,
		createdAt: "25/03/2025",
		maxScore: 10,
	},
	{
		id: "14",
		text: "Explain the concept of object-oriented programming and its main principles.",
		excerpt: "OOP is a programming paradigm based on objects...",
		section: "Essay",
		type: "essay",
		active: true,
		createdAt: "01/04/2025",
		maxScore: 10,
	},
	{
		id: "15",
		text: "Describe the difference between synchronous and asynchronous programming and provide examples where each would be appropriate.",
		excerpt: "Programming paradigms affect execution flow...",
		section: "Essay",
		type: "essay",
		active: true,
		createdAt: "05/04/2025",
		maxScore: 10,
	},
];

export const getQuestionsBySection = () => {
	const sections: { [key: string]: Question[] } = {
		"1": MOCK_QUESTIONS.filter((q) => q.section === "Multiple Choice"),
		"2": MOCK_QUESTIONS.filter((q) => q.section === "Essay"),
	};

	return sections;
};

export function useQuestions(options?: UseQuestionsOptions) {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	// Fetch questions with pagination
	const getQuestions = (queryOptions: QuestionQueryOptions = {}) => {
		const {
			page = 1,
			take = 10,
			searchTerm = "",
			section,
			fromDate,
			toDate,
			presetTimeFrame,
			sortingOptions = "DESC",
			careerId,
		} = queryOptions;

		return useQuery({
			queryKey: [
				"questions",
				page,
				take,
				searchTerm,
				section,
				fromDate,
				toDate,
				presetTimeFrame,
				sortingOptions,
				careerId,
			],
			queryFn: () =>
				questionsService.getAllQuestions(
					page,
					take,
					searchTerm,
					section,
					fromDate,
					toDate,
					presetTimeFrame,
					sortingOptions,
					careerId,
				),
		});
	};

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
		getQuestions,
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
