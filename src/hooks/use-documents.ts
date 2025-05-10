import { useCallback, useState } from "react";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import type { PortfolioLinks, ApplicantData } from "@/types/profile";

export function useDocuments(
	profileData: ApplicantData | null,
	setProfileData: (data: ApplicantData | null) => void,
	queryClient: any,
) {
	const [documentsLoading, setDocumentsLoading] = useState(false);

	const uploadFile = useCallback(
		async (type: "avatar" | "resume" | "sample", file: File) => {
			if (!profileData) return;
			setDocumentsLoading(true);

			try {
				// Update UI immediately
				setProfileData((currentData) => {
					if (!currentData) return null;

					if (type === "avatar") {
						return {
							...currentData,
							avatarSrc: URL.createObjectURL(file),
						};
					} else if (type === "resume") {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								resume: {
									name: file.name,
									url: URL.createObjectURL(file),
								},
							},
						};
					} else if (type === "sample") {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								samples: [
									...currentData.documents.samples,
									{ name: file.name, url: URL.createObjectURL(file) },
								],
							},
						};
					}

					return currentData;
				});

				// Create form data
				const formData = new FormData();
				formData.append("file", file);

				let uploadUrl = "";
				let responseData;

				// Make API call based on file type
				if (type === "avatar") {
					const { data } = await api.post(
						"/api/v1/users/upload-profile-picture",
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						},
					);
					responseData = data;
					uploadUrl = data.fileUrl || URL.createObjectURL(file);
				} else if (type === "resume") {
					const { data } = await api.post(
						"/api/v1/users/upload-resume",
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						},
					);
					responseData = data;
					uploadUrl = data.fileUrl || URL.createObjectURL(file);
				} else if (type === "sample") {
					const { data } = await api.post(
						"/api/v1/users/upload-sample",
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						},
					);
					responseData = data;
					uploadUrl = data.fileUrl || URL.createObjectURL(file);
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${file.name} uploaded successfully`,
					variant: "success",
				});

				return responseData;
			} catch (err) {
				console.error("Error uploading file:", err);
				showToast({
					title: "Failed to upload file",
					variant: "error",
				});
				return null;
			} finally {
				setDocumentsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const removeDocument = useCallback(
		async (type: "resume" | "sample", index?: number) => {
			if (!profileData) return false;
			setDocumentsLoading(true);

			try {
				// Update UI optimistically
				setProfileData((currentData) => {
					if (!currentData) return null;

					if (type === "resume") {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								resume: null,
							},
						};
					} else if (type === "sample" && index !== undefined) {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								samples: currentData.documents.samples.filter(
									(_, i) => i !== index,
								),
							},
						};
					}

					return currentData;
				});

				// Make API call
				if (type === "resume") {
					await api.delete("/api/v1/applicants/delete-resume");
				} else if (type === "sample" && index !== undefined) {
					console.log("Delete sample at index", index);
					// API for deleting sample would go here
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`,
					variant: "success",
				});
				return true;
			} catch (err) {
				console.error(`Error removing ${type}:`, err);
				// Revert to original data
				setProfileData(profileData);
				showToast({
					title: `Failed to remove ${type}`,
					variant: "error",
				});
				return false;
			} finally {
				setDocumentsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const updatePortfolioLinks = useCallback(
		async (links: PortfolioLinks) => {
			if (!profileData) return false;
			setDocumentsLoading(true);

			try {
				// Update UI optimistically
				setProfileData((currentData) => {
					if (!currentData) return null;
					return {
						...currentData,
						portfolioLinks: links,
					};
				});

				// Make API call
				const documentsPayload = {
					linkedinProfileUrl: links.linkedin || "",
					githubProfileUrl: links.github || "",
					resumeUrl: profileData.documents.resume?.url || "",
					behanceProfileUrl: links.behance || "",
					portfolioUrl: links.portfolio || "",
				};

				await api.patch(
					"/api/v1/applicants/update-applicantion-documents",
					documentsPayload,
				);

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: "Portfolio links updated",
					variant: "success",
				});
				return true;
			} catch (err) {
				console.error("Error updating portfolio links:", err);
				// Revert to original data
				setProfileData(profileData);
				showToast({
					title: "Failed to update portfolio links",
					variant: "error",
				});
				return false;
			} finally {
				setDocumentsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	return {
		uploadFile,
		removeDocument,
		updatePortfolioLinks,
		documentsLoading,
	};
}
