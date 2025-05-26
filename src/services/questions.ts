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
	ResultsFilterParams,
	PaginatedResults,
	TestResult,
	ExamResultsResDto,
} from "@/types/questions";

interface AdminNotification {
	message: string;
	type: "INSUFFICIENT_QUESTIONS";
	section: "section1" | "section2";
	required: number;
	available: number;
}

// Question management service for admin and applicant flows
export const questionsService = {
	// Admin functions - CRUD operations

	/**
	 * Get all questions with pagination and filtering
	 *
	 * @param page - Current page number (default: 1)
	 * @param take - Number of items per page (default: 10)
	 * @param searchTerm - Search through questions
	 * @param section - Filter by section (MATH, COMPUTER_LITERACY, GENERAL_PROBLEM_SOLVING, GENERAL_QUESTIONS)
	 * @param fromDate - Start date filter (YYYY-MM-DD)
	 * @param toDate - End date filter (YYYY-MM-DD)
	 * @param presetTimeFrame - Preset time filter (Today, Yesterday, ThisWeek, LastWeek, ThisMonth, LastMonth, ThisYear, LastYear)
	 * @param sortingOptions - Sort direction (ASC or DESC, default: DESC)
	 * @param careerId - Filter by career ID
	 */
	async getAllQuestions(
		page = 1,
		take = 10,
		searchTerm = "",
		section?: string,
		fromDate?: string,
		toDate?: string,
		presetTimeFrame?: string,
		sortingOptions = "DESC",
		careerId?: number,
	): Promise<AllQuestionsResDto> {
		let url = `/api/v1/admin/get-all-questions?page=${page}&take=${take}`;

		if (searchTerm) {
			url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
		}

		if (section) {
			url += `&section=${encodeURIComponent(section)}`;
		}

		if (fromDate) {
			url += `&fromDate=${encodeURIComponent(fromDate)}`;
		}

		if (toDate) {
			url += `&toDate=${encodeURIComponent(toDate)}`;
		}

		if (presetTimeFrame) {
			url += `&presetTimeFrame=${encodeURIComponent(presetTimeFrame)}`;
		}

		url += `&sortingOptions=${encodeURIComponent(sortingOptions)}`;

		if (careerId) {
			url += `&careerId=${careerId}`;
		}

		const response = await api.get(url);
		return response.data;
	},

	/**
	 * Get question details by ID
	 *
	 * @param questionId - The ID of the question to retrieve
	 */
	async getQuestionById(
		questionId: number,
	): Promise<ApiResponse<QuestionDetailsResDto>> {
		const response = await api.get(`/api/v1/admin/get-question/${questionId}`);
		return response.data;
	},

	/**
	 * Add a new question
	 *
	 * @param questionData - Question data including description, image URL, section, career ID, and options
	 */
	async addQuestion(
		questionData: AddQuestionReqDto,
	): Promise<AddQuestionResDto> {
		const response = await api.post(
			"/api/v1/questions/add-question",
			questionData,
		);
		return response.data;
	},

	/**
	 * Update an existing question
	 *
	 * @param questionId - The ID of the question to update
	 * @param questionData - Updated question data
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
	 *
	 * @param questionId - The ID of the question to delete
	 */
	async deleteQuestion(questionId: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/admin/delete-question/${questionId}`,
		);
		return response.data;
	},

	/**
	 * Update a question option
	 *
	 * @param optionId
	 */
	async addQuestionOption(
		optionId: number,
	): Promise<ApiResponse<QuestionOptionResDto>> {
		const response = await api.patch(
			`/api/v1/questions/add-question-option/${optionId}`,
		);
		return response.data;
	},

	/**
	 * Update an existing question option
	 *
	 * @param optionId - The ID of the option to update
	 * @param optionData - Updated option data
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
	 *
	 * @param optionId - The ID of the option to delete
	 */
	async deleteQuestionOption(optionId: number): Promise<{ message: string }> {
		const response = await api.delete(
			`/api/v1/admin/delete-question-option/${optionId}`,
		);
		return response.data;
	},

	/**
	 * Notify admin about issues with the exam
	 *
	 * @param notification - The notification data to send to admin
	 */
	async notifyAdmin(
		notification: AdminNotification,
	): Promise<{ message: string }> {
		const response = await api.post(
			"/api/v1/admin/notifications",
			notification,
		);
		return response.data;
	},

	// Applicant functions - Exam taking

	/**
	 * Get exam questions for an applicant based on their career
	 * Retrieves questions specific to the applicant's chosen career path
	 */
	async getExamQuestions(): Promise<ExamResDto> {
		const response = await api.get("/api/v1/questions/get-exam-questions");
		return response.data;
	},

	/**
	 * Submit an exam with answers
	 *
	 * @param examData - Contains multiple choice answers and essay answers
	 */
	async submitExam(examData: SubmitExamReqDto): Promise<{ message: string }> {
		const response = await api.post("/api/v1/questions/submit-exam", examData);
		return response.data;
	},

	/**
	 * Upload an image for a question
	 *
	 * @param file - The image file to upload
	 * @returns The URL of the uploaded image
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
	 *
	 * @param file - The image file to upload
	 * @returns The URL of the uploaded image
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

	/**
	 * Get all exam results with pagination and filtering
	 */
	async getAllResults(params: ResultsFilterParams): Promise<PaginatedResults> {
		const response = await api.get("/api/v1/admin/get-all-results", { params });
		return response.data;
	},

	/**
	 * Get exam result details by ID
	 */
	async getResultById(id: string): Promise<TestResult> {
		const response = await api.get(`/api/v1/admin/get-result/${id}`);
		return response.data;
	},

	/**
	 * Trigger AI grading for an exam result
	 */
	async triggerAIGrading(resultId: string): Promise<TestResult> {
		const response = await api.post(
			`/api/v1/admin/trigger-ai-grading/${resultId}`,
		);
		return response.data;
	},

	/**
	 * Get applicant's own exam results
	 */
	async getMyResults(): Promise<ExamResultsResDto> {
		const response = await api.get("/api/v1/questions/get-my-results");
		return response.data;
	},
};
