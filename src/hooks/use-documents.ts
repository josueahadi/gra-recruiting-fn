import { useCallback, useState } from "react";
import { showToast } from "@/services/toast";
import type { PortfolioLinks, ApplicantData } from "@/types/profile";
import { documentsService } from "@/services/documents";
import type { QueryClient } from "@tanstack/react-query";

export function useDocuments(
	profileData: ApplicantData | null,
	setProfileData: React.Dispatch<React.SetStateAction<ApplicantData | null>>,
	queryClient: QueryClient,
) {
	const [documentsLoading, setDocumentsLoading] = useState(false);

	const uploadFile = useCallback(
		async (type: "avatar" | "resume" | "sample", file: File) => {
			if (!profileData) return;
			setDocumentsLoading(true);

			try {
				// Update UI immediately
				setProfileData((currentData: ApplicantData | null) => {
					if (!currentData) return null;

					if (type === "avatar") {
						return {
							...currentData,
							avatarSrc: URL.createObjectURL(file),
						};
					}

					if (type === "resume") {
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
					}

					if (type === "sample") {
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

				const apiType = type === "avatar" ? "profile-picture" : type;

				// Use the documents service
				const responseData = await documentsService.uploadFile(file, apiType);

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
				setProfileData((currentData: ApplicantData | null) => {
					if (!currentData) return null;

					if (type === "resume") {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								resume: null,
							},
						};
					}

					if (type === "sample" && index !== undefined) {
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
					await documentsService.deleteResume();
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
				setProfileData((currentData: ApplicantData | null) => {
					if (!currentData) return null;
					return {
						...currentData,
						portfolioLinks: links,
					};
				});

				// Make API call with the documents service
				const documentsPayload = {
					linkedinProfileUrl: links.linkedin || "",
					githubProfileUrl: links.github || "",
					resumeUrl: profileData.documents.resume?.url || "",
					behanceProfileUrl: links.behance || "",
					portfolioUrl: links.portfolio || "",
				};

				await documentsService.update(documentsPayload);

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
