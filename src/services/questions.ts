import { api } from "@/services/api";
import type {
	AddQuestionReqDto,
	AddQuestionResDto,
	AllQuestionsResDto,
	ApiResponse,
	EditQuestionOptionReqDto,
	EditQuestionOptionResDto,
	EditQuestionReqDto,
	EditQuestionResDto,
	ExamResDto,
	QuestionDetailsResDto,
	QuestionOptionReqDto,
	SubmitExamReqDto,
	QuestionOptionResDto,
} from "@/types/questions";

// Question management service for admin and applicant flows
export const questionsService = {
	// Admin functions - CRUD operations

	async getAllQuestions(
		page = 1,
		take = 10,
		searchTerm = "",
		careerId?: number,
	): Promise<AllQuestionsResDto> {
		let url = `/api/v1/admin/get-questions?page=${page}&take=${take}`;

		if (searchTerm) {
			url += `&search=${encodeURIComponent(searchTerm)}`;
		}

		if (careerId) {
			url += `&careerId=${careerId}`;
		}

		const response = await api.get(url);
		return response.data;
	},

	// get question details by id
	async getQuestionById(
		questionId: number,
	): Promise<ApiResponse<QuestionDetailsResDto>> {
		const response = await api.get(`/api/v1/admin/get-question/${questionId}`);
		return response.data;
	},

	/**
	 * Add a new question
	 */
	async addQuestion(
		questionData: AddQuestionReqDto,
	): Promise<AddQuestionResDto> {
		const response = await api.post("/api/v1/admin/add-question", questionData);
		return response.data;
	},

	/**
	 * Update an existing question
	 */
	async updateQuestion(
		questionId: number,
		questionData: EditQuestionReqDto,
	): Promise<EditQuestionResDto> {
		const response = await api.patch(
			`/api/v1/admin/update-question/${questionId}`,
			questionData,
		);
		return response.data;
	},

	/**
	 * Delete a question
	 */
	async deleteQuestion(questionId: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/admin/delete-question/${questionId}`,
		);
		return response.data;
	},

	/**
	 * Add a new option to a question
	 */
	async addQuestionOption(
		questionId: number,
		optionData: QuestionOptionReqDto,
	): Promise<ApiResponse<QuestionOptionResDto>> {
		const response = await api.post(
			`/api/v1/admin/add-question-option/${questionId}`,
			optionData,
		);
		return response.data;
	},

	/**
	 * Update an existing question option
	 */
	async updateQuestionOption(
		optionId: number,
		optionData: EditQuestionOptionReqDto,
	): Promise<EditQuestionOptionResDto> {
		const response = await api.patch(
			`/api/v1/admin/update-question-option/${optionId}`,
			optionData,
		);
		return response.data;
	},

	/**
	 * Delete a question option
	 */
	async deleteQuestionOption(optionId: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/admin/delete-question-option/${optionId}`,
		);
		return response.data;
	},

	// Applicant functions - Exam taking

	/**
	 * Get exam questions for an applicant based on their career
	 */
	async getExamQuestions(): Promise<ExamResDto> {
		const response = await api.get("/api/v1/applicants/get-exam");
		return response.data;
	},

	/**
	 * Submit an exam with answers
	 */
	async submitExam(examData: SubmitExamReqDto): Promise<{ message: string }> {
		const response = await api.post("/api/v1/applicants/submit-exam", examData);
		return response.data;
	},

	/**
	 * Upload an image for a question
	 */
	async uploadQuestionImage(file: File): Promise<{ fileUrl: string }> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await api.post(
			"/api/v1/admin/upload-question-image",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);

		return response.data;
	},

	/**
	 * Upload an image for a question option
	 */
	async uploadOptionImage(file: File): Promise<{ fileUrl: string }> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await api.post(
			"/api/v1/admin/upload-option-image",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);

		return response.data;
	},
};
