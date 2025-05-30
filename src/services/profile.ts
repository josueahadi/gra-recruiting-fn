import { uploadFileToFirebaseWithProgress } from "@/lib/upload-file";

export interface UpdateProfilePictureResponse {
	message: string;
}

export const profileService = {
	async uploadProfilePicture(
		file: File,
		userId: string,
		onProgress?: (progress: number) => void,
	): Promise<string> {
		// Upload the file to Firebase storage
		const filePath = `users/${userId}/profile-pictures/profile-picture-${Date.now()}.${file.name.split(".").pop()}`;
		const downloadUrl = await uploadFileToFirebaseWithProgress(
			file,
			filePath,
			onProgress,
		);

		// Return the download URL from Firebase
		return downloadUrl;
	},

	async getAdminApplicantProfile(userId: string) {
		const { data } = await import("@/services/api").then((m) =>
			m.api.get(`/api/v1/admin/get-applicant-profile/${userId}`),
		);
		return data;
	},
};
