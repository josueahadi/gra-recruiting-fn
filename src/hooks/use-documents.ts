import { useCallback, useState } from "react";
import { showToast } from "@/services/toast";
import type { PortfolioLinks, ApplicantData } from "@/types/profile";
import { documentsService } from "@/services/documents";
import type { QueryClient } from "@tanstack/react-query";
import { uploadFileToFirebaseWithProgress } from "@/lib/upload-file";
import type { ApiErrorResponse } from "@/types/errors";

export function useDocuments(
	profileData: ApplicantData | null,
	setProfileData: React.Dispatch<React.SetStateAction<ApplicantData | null>>,
	queryClient: QueryClient,
) {
	const [documentsLoading, setDocumentsLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const isValidUrl = useCallback((url: string): boolean => {
		if (!url) return true; // Empty is valid (optional)
		try {
			new URL(url);
			return true;
		} catch (e) {
			console.error("Error validating URL:", e);
			return false;
		}
	}, []);

	const extractFieldErrors = useCallback(
		(error: ApiErrorResponse): Record<string, string> => {
			const errors: Record<string, string> = {};

			if (
				error?.response?.data?.message &&
				Array.isArray(error.response.data.message)
			) {
				error.response.data.message.forEach((msg) => {
					// Handle both string messages and object messages with field/message properties
					let errorMessage: string;
					let fieldName: string | null = null;

					if (typeof msg === "string") {
						errorMessage = msg;

						if (msg.includes("linkedinProfileUrl")) {
							fieldName = "linkedin";
						} else if (msg.includes("githubProfileUrl")) {
							fieldName = "github";
						} else if (msg.includes("resumeUrl")) {
							fieldName = "resumeUrl";
						} else if (msg.includes("behanceProfileUrl")) {
							fieldName = "behance";
						} else if (msg.includes("portfolioUrl")) {
							fieldName = "portfolio";
						}
					} else if (
						typeof msg === "object" &&
						msg !== null &&
						"field" in msg &&
						"message" in msg
					) {
						const fieldError = msg as { field: string; message: string };
						errorMessage = fieldError.message;

						switch (fieldError.field) {
							case "linkedinProfileUrl":
								fieldName = "linkedin";
								break;
							case "githubProfileUrl":
								fieldName = "github";
								break;
							case "resumeUrl":
								fieldName = "resumeUrl";
								break;
							case "behanceProfileUrl":
								fieldName = "behance";
								break;
							case "portfolioUrl":
								fieldName = "portfolio";
								break;
							default:
								fieldName = fieldError.field;
						}
					} else {
						// Skip if message is neither string nor expected object
						return;
					}

					if (fieldName) {
						errors[fieldName] = errorMessage;
					}
				});
			}

			return errors;
		},
		[],
	);

	/**
	 * @deprecated Using updateResumeUrl at the moment instead for better performance
	 */
	const uploadFile = useCallback(
		async (type: "avatar" | "resume" | "sample", file: File) => {
			if (!profileData) return;
			setDocumentsLoading(true);
			setUploadProgress(null);
			setUploadError(null);

			// File validation for resume
			if (type === "resume") {
				const allowedTypes = ["application/pdf"];
				if (!allowedTypes.includes(file.type)) {
					setUploadError("Only PDF files are allowed.");
					setDocumentsLoading(false);
					return;
				}
				if (file.size > 5 * 1024 * 1024) {
					setUploadError("File size must be less than 5 MB.");
					setDocumentsLoading(false);
					return;
				}
			}

			try {
				if (type === "resume") {
					const userId = profileData.id || "unknown";
					const path = `resumes/${userId}-${Date.now()}-${file.name}`;
					const firebaseUrl = await uploadFileToFirebaseWithProgress(
						file,
						path,
						(progress) => setUploadProgress(progress),
					);

					setProfileData((currentData) => {
						if (!currentData) return null;
						return {
							...currentData,
							documents: {
								...currentData.documents,
								resume: {
									name: file.name,
									url: firebaseUrl,
								},
							},
						};
					});

					// Send URL to backend (add or update)
					await documentsService.add({ resumeUrl: firebaseUrl });

					queryClient.invalidateQueries({ queryKey: ["application-profile"] });

					showToast({
						title: `${file.name} uploaded successfully`,
						variant: "success",
					});

					setUploadProgress(null);
					return { fileUrl: firebaseUrl };
				}

				if (type === "avatar") {
					return {
						...profileData,
						avatarSrc: URL.createObjectURL(file),
					};
				}

				if (type === "sample") {
					return {
						...profileData,
						documents: {
							...profileData.documents,
							samples: [
								...profileData.documents.samples,
								{ name: file.name, url: URL.createObjectURL(file) },
							],
						},
					};
				}

				return profileData;
			} catch (err) {
				console.error("Error uploading file:", err);
				setUploadError("Failed to upload file. Please try again.");
				showToast({
					title: "Failed to upload file",
					variant: "error",
				});
				return null;
			} finally {
				setDocumentsLoading(false);
				setUploadProgress(null);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const updateResumeUrl = useCallback(
		async (resumeUrl: string) => {
			if (!profileData) return false;
			setDocumentsLoading(true);
			setFieldErrors({});

			if (resumeUrl && !isValidUrl(resumeUrl)) {
				setFieldErrors({ resumeUrl: "Please enter a valid URL" });
				setDocumentsLoading(false);
				return false;
			}

			try {
				setProfileData((currentData) => {
					if (!currentData) return null;
					return {
						...currentData,
						documents: {
							...currentData.documents,
							resume: resumeUrl
								? {
										name: "Resume",
										url: resumeUrl,
									}
								: null,
						},
					};
				});

				// Prepare payload with only non-empty values
				const payload: Record<string, string> = {};

				if (resumeUrl) {
					payload.resumeUrl = resumeUrl;
				}

				// Include other existing links if they exist
				if (profileData.portfolioLinks.linkedin) {
					payload.linkedinProfileUrl = profileData.portfolioLinks.linkedin;
				}

				if (profileData.portfolioLinks.github) {
					payload.githubProfileUrl = profileData.portfolioLinks.github;
				}

				if (profileData.portfolioLinks.behance) {
					payload.behanceProfileUrl = profileData.portfolioLinks.behance;
				}

				if (profileData.portfolioLinks.portfolio) {
					payload.portfolioUrl = profileData.portfolioLinks.portfolio;
				}

				// Check if any documents already exist in the profile
				const hasExistingDocuments =
					profileData.portfolioLinks.linkedin ||
					profileData.portfolioLinks.github ||
					profileData.portfolioLinks.behance ||
					profileData.portfolioLinks.portfolio ||
					profileData.documents.resume;

				// Determine if we should use add or update endpoint
				if (hasExistingDocuments) {
					// If documents already exist, use update endpoint
					await documentsService.update(payload);
				} else {
					// If no documents exist yet, use add endpoint
					await documentsService.add(payload);
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: resumeUrl
						? "Resume link added successfully"
						: "Resume link removed",
					variant: "success",
				});

				return true;
			} catch (err) {
				console.error("Error updating resume URL:", err);

				// Extract field errors from API response
				const errors = extractFieldErrors(err as ApiErrorResponse);
				setFieldErrors(errors);

				// Revert to original data
				setProfileData(profileData);

				// Only show toast if no specific field errors
				if (Object.keys(errors).length === 0) {
					showToast({
						title: "Failed to update resume link",
						variant: "error",
					});
				}

				return false;
			} finally {
				setDocumentsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient, isValidUrl, extractFieldErrors],
	);

	const removeDocument = useCallback(
		async (type: "resume" | "sample", index?: number) => {
			if (!profileData) return false;
			setDocumentsLoading(true);

			try {
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

				if (type === "resume") {
					await documentsService.deleteResume();
				} else if (type === "sample" && index !== undefined) {
					console.log("Delete sample at index", index);
					// API for deleting
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
			setFieldErrors({});

			// Validate URLs
			const errors: Record<string, string> = {};

			if (links.linkedin && !isValidUrl(links.linkedin)) {
				errors.linkedin = "Please enter a valid LinkedIn URL";
			}

			if (links.github && !isValidUrl(links.github)) {
				errors.github = "Please enter a valid GitHub URL";
			}

			if (links.behance && !isValidUrl(links.behance)) {
				errors.behance = "Please enter a valid Behance URL";
			}

			if (links.portfolio && !isValidUrl(links.portfolio)) {
				errors.portfolio = "Please enter a valid portfolio URL";
			}

			if (links.resumeUrl && !isValidUrl(links.resumeUrl)) {
				errors.resumeUrl = "Please enter a valid resume URL";
			}

			if (Object.keys(errors).length > 0) {
				setFieldErrors(errors);
				setDocumentsLoading(false);
				return false;
			}

			try {
				// Handle resume URL separately and create a portfolio links object without it
				const resumeUrl = links.resumeUrl;
				// Extract all properties except resumeUrl to avoid unused variable warning
				const portfolioLinks = {
					linkedin: links.linkedin,
					github: links.github,
					behance: links.behance,
					portfolio: links.portfolio,
				};

				setProfileData((currentData: ApplicantData | null) => {
					if (!currentData) return null;

					// If resumeUrl is provided, update the resume document
					const updatedDocuments = resumeUrl
						? {
								...currentData.documents,
								resume: {
									name: "Resume",
									url: resumeUrl,
								},
							}
						: currentData.documents;

					return {
						...currentData,
						portfolioLinks,
						documents: updatedDocuments,
					};
				});

				// Prepare payload with only non-empty values
				const documentsPayload: Record<string, string> = {};

				if (portfolioLinks.linkedin) {
					documentsPayload.linkedinProfileUrl = portfolioLinks.linkedin;
				}

				if (portfolioLinks.github) {
					documentsPayload.githubProfileUrl = portfolioLinks.github;
				}

				if (resumeUrl || profileData.documents.resume?.url) {
					documentsPayload.resumeUrl =
						resumeUrl || profileData.documents.resume?.url || "";
				}

				if (portfolioLinks.behance) {
					documentsPayload.behanceProfileUrl = portfolioLinks.behance;
				}

				if (portfolioLinks.portfolio) {
					documentsPayload.portfolioUrl = portfolioLinks.portfolio;
				}

				// Only make API call if there are values to update
				if (Object.keys(documentsPayload).length > 0) {
					const hasExistingDocuments =
						profileData.portfolioLinks.linkedin ||
						profileData.portfolioLinks.github ||
						profileData.portfolioLinks.behance ||
						profileData.portfolioLinks.portfolio ||
						profileData.documents.resume;

					// Determine if we should use add or update endpoint
					if (hasExistingDocuments) {
						// If documents already exist, use update endpoint
						await documentsService.update(documentsPayload);
					} else {
						// If no documents exist yet, use add endpoint
						await documentsService.add(documentsPayload);
					}
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: "Document links updated",
					variant: "success",
				});
				return true;
			} catch (err) {
				console.error("Error updating portfolio links:", err);

				const errors = extractFieldErrors(err as ApiErrorResponse);
				setFieldErrors(errors);

				// Revert to original data
				setProfileData(profileData);

				// Only show toast if no specific field errors
				if (Object.keys(errors).length === 0) {
					showToast({
						title: "Failed to update document links",
						variant: "error",
					});
				}

				return false;
			} finally {
				setDocumentsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient, isValidUrl, extractFieldErrors],
	);

	const updateSingleLink = useCallback(
		async (field: keyof PortfolioLinks, value: string): Promise<boolean> => {
			if (!profileData) return false;
			setDocumentsLoading(true);
			setFieldErrors({});

			if (value && !isValidUrl(value)) {
				setFieldErrors({ [field]: `Please enter a valid ${field} URL` });
				setDocumentsLoading(false);
				return false;
			}

			try {
				const documentsPayload: Record<string, string> = {};

				switch (field) {
					case "linkedin":
						documentsPayload.linkedinProfileUrl = value;
						break;
					case "github":
						documentsPayload.githubProfileUrl = value;
						break;
					case "behance":
						documentsPayload.behanceProfileUrl = value;
						break;
					case "portfolio":
						documentsPayload.portfolioUrl = value;
						break;
					case "resumeUrl":
						documentsPayload.resumeUrl = value;
						break;
				}

				setProfileData((currentData: ApplicantData | null) => {
					if (!currentData) return null;

					if (field === "resumeUrl") {
						const updatedDocuments = value
							? {
									...currentData.documents,
									resume: {
										name: "Resume",
										url: value,
									},
								}
							: {
									...currentData.documents,
									resume: null,
								};

						return {
							...currentData,
							documents: updatedDocuments,
						};
					}

					// For other portfolio links
					return {
						...currentData,
						portfolioLinks: {
							...currentData.portfolioLinks,
							[field]: value,
						},
					};
				});

				// Check if any documents already exist in the profile
				const hasExistingDocuments =
					profileData.portfolioLinks.linkedin ||
					profileData.portfolioLinks.github ||
					profileData.portfolioLinks.behance ||
					profileData.portfolioLinks.portfolio ||
					profileData.documents.resume;

				// Determine if we should use add or update endpoint
				if (hasExistingDocuments) {
					// If documents already exist, use update endpoint
					await documentsService.update(documentsPayload);
				} else {
					// If no documents exist yet, use add endpoint
					await documentsService.add(documentsPayload);
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${field.charAt(0).toUpperCase() + field.slice(1)} link updated`,
					variant: "success",
				});
				return true;
			} catch (err) {
				console.error(`Error updating ${field}:`, err);

				// Extract field errors from API response
				const errors = extractFieldErrors(err as ApiErrorResponse);
				setFieldErrors(errors);

				// Revert to original data
				setProfileData(profileData);

				// Only show toast if no specific field errors
				if (Object.keys(errors).length === 0) {
					showToast({
						title: `Failed to update ${field}`,
						variant: "error",
					});
				}

				return false;
			} finally {
				setDocumentsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient, isValidUrl, extractFieldErrors],
	);

	return {
		uploadFile,
		removeDocument,
		updatePortfolioLinks,
		updateResumeUrl,
		updateSingleLink,
		documentsLoading,
		uploadProgress,
		uploadError,
		setUploadError,
		fieldErrors,
	};
}
