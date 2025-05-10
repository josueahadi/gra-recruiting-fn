import { api } from "@/services/api";
import type { DocumentsResponse, ApiResponse } from "@/types/profile";

export interface AddDocumentsPayload {
	linkedinProfileUrl?: string;
	githubProfileUrl?: string;
	resumeUrl?: string;
	behanceProfileUrl?: string;
	portfolioUrl?: string;
}

export interface UpdateDocumentsPayload extends AddDocumentsPayload {
	id?: number;
}

export interface UploadFileResponse {
	message: string;
	fileUrl: string;
}

export const documentsService = {
	async add(
		data: AddDocumentsPayload,
	): Promise<ApiResponse<DocumentsResponse>> {
		const response = await api.post("/api/v1/applicants/add-documents", data);
		return response.data;
	},

	async update(
		data: UpdateDocumentsPayload,
	): Promise<ApiResponse<DocumentsResponse>> {
		const response = await api.patch(
			"/api/v1/applicants/update-application-documents",
			data,
		);
		return response.data;
	},

	async uploadFile(
		file: File,
		type: "profile-picture" | "resume" | "sample",
	): Promise<UploadFileResponse> {
		const formData = new FormData();
		formData.append("file", file);

		let endpoint = "";
		switch (type) {
			case "profile-picture":
				endpoint = "/api/v1/users/upload-profile-picture";
				break;
			case "resume":
				endpoint = "/api/v1/users/upload-resume";
				break;
			case "sample":
				endpoint = "/api/v1/users/upload-sample";
				break;
		}

		const response = await api.post(endpoint, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	},

	async deleteResume(): Promise<{ message: string }> {
		const response = await api.delete("/api/v1/applicants/delete-resume");
		return response.data;
	},
};
