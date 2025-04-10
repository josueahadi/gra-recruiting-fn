export interface BaseQuestion {
	id: string;
	text: string;
	excerpt: string;
	section: "Multiple Choice" | "Essay";
	type: string;
	difficulty?: "Easy" | "Medium" | "Hard";
	active?: boolean;
	createdAt?: string;
	updatedAt?: string;
	imageUrl?: string;
	displayId?: number; // For exam display order
	originalId?: string; // Original ID for reference
}

export interface Choice {
	id: string;
	text?: string;
	isCorrect: boolean;
	imageUrl?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
	type:
		| "multiple-choice"
		| "Problem Solving"
		| "Computer Skills"
		| "Math"
		| "Business";
	choices: Choice[];
}

export interface EssayQuestion extends BaseQuestion {
	type: "essay";
	// Essay questions don't have choices
	maxScore?: number;
}

export type Question = MultipleChoiceQuestion | EssayQuestion;

export interface PaginatedQuestions {
	data: Question[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface QuestionFilterParams {
	search?: string;
	section?: string;
	type?: string;
	difficulty?: string;
	page?: number;
	limit?: number;
}

export const EXAM_COMPLETION_KEY = "examCompletion";
export const EXAM_SECTION_ANSWERS_KEY = "examSectionAnswers";
export const QUESTION_MAPPING_KEY = "questionMapping";
