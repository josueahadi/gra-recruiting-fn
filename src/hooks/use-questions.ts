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

export function useQuestions(filterParams: QuestionFilterParams = {}) {
	const queryClient = useQueryClient();

	const page = filterParams.page || 1;
	const limit = filterParams.limit || 10;

	const fetchQuestions = async () => {
		try {
			const filteredQuestions = MOCK_QUESTIONS.filter((question) => {
				const matchesSearch =
					!filterParams.search ||
					question.text
						.toLowerCase()
						.includes(filterParams.search.toLowerCase()) ||
					question.excerpt
						.toLowerCase()
						.includes(filterParams.search.toLowerCase()) ||
					question.type
						.toLowerCase()
						.includes(filterParams.search.toLowerCase());

				const matchesSection =
					!filterParams.section ||
					filterParams.section === "all" ||
					question.section === filterParams.section;

				const matchesType =
					!filterParams.type ||
					filterParams.type === "all" ||
					question.type.toLowerCase().replace(" ", "-") === filterParams.type;

				return matchesSearch && matchesSection && matchesType;
			});

			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

			return {
				data: paginatedQuestions,
				meta: {
					total: filteredQuestions.length,
					page,
					limit,
					totalPages: Math.ceil(filteredQuestions.length / limit),
				},
			};
		} catch (error) {
			console.error("Error fetching questions:", error);
			throw error;
		}
	};

	const getQuestionMetadata = () => {
		const sections = [...new Set(MOCK_QUESTIONS.map((q) => q.section))];
		const types = [...new Set(MOCK_QUESTIONS.map((q) => q.type))];

		const typeCounts = MOCK_QUESTIONS.reduce(
			(acc, curr) => {
				acc[curr.type] = (acc[curr.type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const sectionCounts = MOCK_QUESTIONS.reduce(
			(acc, curr) => {
				acc[curr.section] = (acc[curr.section] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return {
			sections,
			types,
			typeCounts,
			sectionCounts,
			total: MOCK_QUESTIONS.length,
			active: MOCK_QUESTIONS.filter((q) => q.active).length,
			multipleChoice: MOCK_QUESTIONS.filter(
				(q) => q.section === "Multiple Choice",
			).length,
			essay: MOCK_QUESTIONS.filter((q) => q.section === "Essay").length,
		};
	};

	const fetchQuestionById = async (id: string) => {
		const question = MOCK_QUESTIONS.find((q) => q.id === id);
		if (!question) throw new Error(`Question with ID ${id} not found`);
		return question;
	};

	const createQuestion = useMutation({
		mutationFn: async (newQuestion: Partial<Question>) => {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const newId = `${Math.floor(Math.random() * 900) + 100}`;

			if (newQuestion.section === "Essay" || newQuestion.type === "essay") {
				const createdQuestion: EssayQuestion = {
					...newQuestion,
					id: newId,
					section: "Essay",
					type: "essay",
					text: newQuestion.text || "New Essay Question",
					excerpt:
						newQuestion.excerpt ||
						(newQuestion.text
							? `${newQuestion.text.substring(0, 50)}...`
							: "New essay question..."),
					active: true,
					createdAt: new Date().toLocaleDateString(),
					maxScore: (newQuestion as Partial<EssayQuestion>).maxScore || 10,
				};

				MOCK_QUESTIONS.push(createdQuestion);
				return createdQuestion;
				// biome-ignore lint/style/noUselessElse: <explanation>
			} else {
				const mcType =
					(newQuestion.type as MultipleChoiceQuestion["type"]) ||
					"multiple-choice";

				const createdQuestion: MultipleChoiceQuestion = {
					...newQuestion,
					id: newId,
					section: "Multiple Choice",
					type: mcType,
					text: newQuestion.text || "New Multiple Choice Question",
					excerpt:
						newQuestion.excerpt ||
						(newQuestion.text
							? `${newQuestion.text.substring(0, 50)}...`
							: "New multiple choice question..."),
					active: true,
					createdAt: new Date().toLocaleDateString(),
					choices: (newQuestion as Partial<MultipleChoiceQuestion>).choices || [
						{ id: "a", text: "Option A", isCorrect: true },
						{ id: "b", text: "Option B", isCorrect: false },
						{ id: "c", text: "Option C", isCorrect: false },
						{ id: "d", text: "Option D", isCorrect: false },
					],
				};

				MOCK_QUESTIONS.push(createdQuestion);
				return createdQuestion;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			toast.success("Question created successfully");
		},
		onError: (error) => {
			toast.error(`Failed to create question: ${error.message}`);
		},
	});

	const updateQuestion = useMutation({
		mutationFn: async ({
			id,
			data,
		}: { id: string; data: Partial<Question> }) => {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const questionIndex = MOCK_QUESTIONS.findIndex((q) => q.id === id);
			if (questionIndex === -1)
				throw new Error(`Question with ID ${id} not found`);

			const originalQuestion = MOCK_QUESTIONS[questionIndex];

			if (
				originalQuestion.section === "Essay" ||
				data.section === "Essay" ||
				originalQuestion.type === "essay" ||
				data.type === "essay"
			) {
				const updatedEssayQuestion: EssayQuestion = {
					...(originalQuestion as EssayQuestion),
					...data,
					section: "Essay",
					type: "essay",
					updatedAt: new Date().toLocaleDateString(),
				};

				MOCK_QUESTIONS[questionIndex] = updatedEssayQuestion;
				return updatedEssayQuestion;
			}
			// biome-ignore lint/style/noUselessElse: <explanation>
			else {
				const mcType =
					(data.type as MultipleChoiceQuestion["type"]) ||
					(originalQuestion as MultipleChoiceQuestion).type;

				const updatedMCQuestion: MultipleChoiceQuestion = {
					...(originalQuestion as MultipleChoiceQuestion),
					...data,
					section: "Multiple Choice",
					type: mcType,
					choices:
						(data as Partial<MultipleChoiceQuestion>).choices ||
						(originalQuestion as MultipleChoiceQuestion).choices,
					updatedAt: new Date().toLocaleDateString(),
				};

				MOCK_QUESTIONS[questionIndex] = updatedMCQuestion;
				return updatedMCQuestion;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			toast.success("Question updated successfully");
		},
		onError: (error) => {
			toast.error(`Failed to update question: ${error.message}`);
		},
	});

	const deleteQuestion = useMutation({
		mutationFn: async (id: string) => {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = MOCK_QUESTIONS.findIndex((q) => q.id === id);
			if (index !== -1) {
				MOCK_QUESTIONS.splice(index, 1);
			}

			return id;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			toast.success("Question deleted successfully");
		},
		onError: (error) => {
			toast.error(`Failed to delete question: ${error.message}`);
		},
	});

	return {
		questions: useQuery({
			queryKey: ["questions", page, limit, filterParams],
			queryFn: fetchQuestions,
		}),
		metadata: getQuestionMetadata(),
		getQuestionById: (id: string) => fetchQuestionById(id),
		createQuestion,
		updateQuestion,
		deleteQuestion,
		getQuestionsBySection,
	};
}
