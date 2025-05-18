// Question Option Types
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
	id?: number;
	description: string;
	imageUrl?: string | null;
	section: QuestionSection;
	careerId: number;
	options: QuestionOption[];
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
export interface AllQuestionsResDto {
	questions: QuestionResDto[];
	page: number;
	take: number;
	totalApplicants: number;
	pageCount: number;
	hasNextPage: boolean;
}

// API Response wrapper type
export interface ApiResponse<T> {
	message: string;
	data: T;
}
