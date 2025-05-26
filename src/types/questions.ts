// Question Option Types

// Storage Keys
export const EXAM_COMPLETION_KEY = "exam_completion";
export const EXAM_SECTION_ANSWERS_KEY = "exam_section_answers";
export const QUESTION_MAPPING_KEY = "question_mapping";

export interface QuestionOption {
	id?: number;
	optionText: string;
	optionImageUrl?: string | null;
	isCorrectAnswer: boolean;
}

// Question Types
export type QuestionSection =
	| "MATH"
	| "COMPUTER_LITERACY"
	| "GENERAL_PROBLEM_SOLVING"
	| "GENERAL_QUESTIONS";

export interface Question {
	id: number;
	text: string;
	description: string;
	section: QuestionSection;
	type: QuestionSection;
	excerpt?: string;
	difficulty: "Easy" | "Medium" | "Hard";
	active: boolean;
	createdAt?: string;
	updatedAt?: string;
	imageUrl?: string | null;
	choices?: Array<{
		id: string;
		text: string;
		isCorrect: boolean;
		imageUrl?: string;
	}>;
}

export interface MultipleChoiceQuestion extends Question {
	choices: Array<{
		id: string;
		text: string;
		isCorrect: boolean;
		imageUrl?: string;
	}>;
}

export interface Choice {
	id: string;
	text: string;
	isCorrect: boolean;
	imageUrl?: string;
}

// Admin Flow - Request DTOs
export interface QuestionOptionReqDto {
	optionText: string;
	optionImageUrl?: string;
	isCorrectAnswer: boolean;
}

export interface AddQuestionReqDto {
	description: string;
	imageUrl?: string;
	section: QuestionSection;
	careerId: number;
	options: QuestionOptionReqDto[];
}

export interface EditQuestionReqDto {
	description?: string;
	imageUrl?: string;
	section?: QuestionSection;
	careerId?: number;
}

export interface EditQuestionOptionReqDto {
	optionText?: string;
	optionImageUrl?: string;
	isCorrectAnswer?: boolean;
}

// Admin Flow - Response DTOs
export interface QuestionOptionResDto {
	id: number;
	optionText: string;
	optionImageUrl?: string | null;
	isCorrectAnswer: boolean;
}

export interface QuestionDetailsResDto {
	id: number;
	description: string;
	imageUrl?: string | null;
	section: QuestionSection;
	careerId: number;
	options: QuestionOptionResDto[];
}

export interface AddQuestionResDto {
	message: string;
	data: QuestionDetailsResDto;
}

export interface EditQuestionDetailsResDto {
	id: number;
	description: string;
	imageUrl?: string | null;
	section: QuestionSection;
	careerId: number;
}

export interface EditQuestionResDto {
	message: string;
	data: EditQuestionDetailsResDto;
}

export interface EditOptionResDto {
	id: number;
	optionText: string;
	optionImageUrl?: string | null;
	isCorrectAnswer: boolean;
}

export interface EditQuestionOptionResDto {
	message: string;
	data: EditOptionResDto;
}

// Applicant Flow - Exam Types
export interface OptionResDto {
	id: number;
	optionText: string;
	optionImageUrl?: string | null;
}

export interface QuestionResDto {
	id: number;
	description: string;
	imageUrl?: string | null;
	options: OptionResDto[];
}

export interface SectionOneResDto {
	questions: QuestionResDto[];
}

export interface SectionTwoResDto {
	questions: QuestionResDto[];
}

export interface ExamResDto {
	section1: SectionOneResDto;
	section2: SectionTwoResDto;
}

// Answer Types
export interface MultipleChoiceAnswerDto {
	questionId: number;
	optionId: number;
}

export interface EssayAnswerDto {
	questionId: number;
	answer: string;
}

export interface SubmitExamReqDto {
	multipleChoiceAnswers: MultipleChoiceAnswerDto[];
	essayAnswers: EssayAnswerDto[];
}

// Pagination for Questions
export interface QuestionsStatsResDto {
	totalQuestions: number;
	totalMultipleChoiceQuestions: number;
	totalEssayQuestions: number;
}

export interface AllQuestionsResDto {
	stats: QuestionsStatsResDto;
	questions: QuestionResDto[];
	page: number;
	take: number;
	pageCount: number;
	hasNextPage: boolean;
}

// API Response wrapper type
export interface ApiResponse<T> {
	message: string;
	data: T;
}

// Exam Results Types
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
	questions: Array<{
		id: string;
		text: string;
		type: "multiple-choice" | "essay";
		applicantAnswer?: string;
		correctAnswer?: string;
		options?: string[];
		maxScore?: number;
		score?: number;
		feedback?: string;
	}>;
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

export interface ResultsFilterParams {
	search?: string;
	status?: string;
	department?: string;
	fromDate?: Date;
	toDate?: Date;
	page?: number;
	limit?: number;
}
