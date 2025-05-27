import type React from "react";
import { useState, useEffect } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, CheckCircle } from "lucide-react";
import type { Document, PortfolioLinks } from "@/types/profile";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa";
import { BiWorld, BiFile } from "react-icons/bi";
import { showToast } from "@/services/toast";
import { uploadFileToFirebase } from "@/lib/upload-file";

interface DocumentsSectionProps {
	resume: Document | null;
	samples: Document[];
	portfolioLinks: PortfolioLinks;
	canEdit: boolean;
	onFileUpload: (type: "resume" | "sample", file: File) => void;
	onFileRemove: (type: "resume" | "sample", index?: number) => void;
	onLinksUpdate: (links: PortfolioLinks) => void;
	updateResumeUrl?: (url: string) => Promise<boolean>;
	fieldErrors?: Record<string, string>;
	updateSingleLink?: (
		field: keyof PortfolioLinks,
		value: string,
	) => Promise<boolean>;
}

// Utility to extract file name from Firebase URL
function getFileNameFromUrl(url: string) {
	try {
		const decoded = decodeURIComponent(url);
		const match = decoded.match(/resumes\/([^?]+)/);
		return match ? match[1] : "Resume";
	} catch {
		return "Resume";
	}
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
	resume,
	portfolioLinks,
	canEdit,
	onLinksUpdate,
	fieldErrors = {},
	updateSingleLink,
}) => {
	const [isEditingLinks, setIsEditingLinks] = useState(false);
	const [links, setLinks] = useState<PortfolioLinks>(() => {
		// Initialize with portfolioLinks and add resumeUrl if resume exists
		const initialLinks = { ...portfolioLinks };
		if (resume?.url) {
			initialLinks.resumeUrl = resume.url;
		}
		return initialLinks;
	});
	const [originalLinks, setOriginalLinks] = useState<PortfolioLinks>(() => {
		// Initialize with portfolioLinks and add resumeUrl if resume exists
		const initialLinks = { ...portfolioLinks };
		if (resume?.url) {
			initialLinks.resumeUrl = resume.url;
		}
		return initialLinks;
	});
	const [localErrors, setLocalErrors] =
		useState<Record<string, string>>(fieldErrors);
	const [savingField, setSavingField] = useState<string | null>(null);
	const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({});
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (Object.keys(fieldErrors).length > 0) {
			setLocalErrors(fieldErrors);
		}
	}, [fieldErrors]);

	useEffect(() => {
		const updatedLinks = { ...portfolioLinks };
		if (resume?.url) {
			updatedLinks.resumeUrl = resume.url;
		}
		setLinks(updatedLinks);
		setOriginalLinks(updatedLinks);
	}, [portfolioLinks, resume]);

	const validateUrl = (url: string): boolean => {
		if (!url) return true;
		try {
			new URL(url);
			return true;
		} catch (e) {
			console.error("Error validating URL:", e);
			return false;
		}
	};

	const handleEditLinks = () => {
		setIsEditingLinks(true);
		const updatedLinks = { ...portfolioLinks };
		if (resume?.url) {
			updatedLinks.resumeUrl = resume.url;
		}
		setLinks(updatedLinks);
		setOriginalLinks(updatedLinks);
		setLocalErrors({});
		setHasChanges({});
	};

	const handleSaveLinks = async () => {
		const errors: Record<string, string> = {};
		let hasErrors = false;

		Object.entries(links).forEach(([key, value]) => {
			if (value && !validateUrl(value)) {
				errors[key] = `Please enter a valid ${key} URL`;
				hasErrors = true;
			}
		});

		if (hasErrors) {
			setLocalErrors(errors);
			return;
		}

		try {
			await onLinksUpdate(links);
			setIsEditingLinks(false);
			setLocalErrors({});
			setHasChanges({});
		} catch (error) {
			console.error("Error saving links:", error);
		}
	};

	const handleCancelLinks = () => {
		setIsEditingLinks(false);
		const updatedLinks = { ...portfolioLinks };
		if (resume?.url) {
			updatedLinks.resumeUrl = resume.url;
		}
		setLinks(updatedLinks);
		setOriginalLinks(updatedLinks);
		setLocalErrors({});
		setHasChanges({});
	};

	const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLinks((prev) => ({ ...prev, [name]: value }));

		const hasChanged = value !== originalLinks[name as keyof PortfolioLinks];
		setHasChanges((prev) => ({ ...prev, [name]: hasChanged }));

		if (value && !validateUrl(value)) {
			setLocalErrors((prev) => ({
				...prev,
				[name]: `Please enter a valid ${name} URL`,
			}));
		} else {
			setLocalErrors((prev) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { resumeUrl, ...rest } = prev;
				return rest;
			});
		}
	};

	const handleSaveField = async (fieldName: string) => {
		const value = links[fieldName as keyof PortfolioLinks] || "";

		if (!hasChanges[fieldName]) {
			return;
		}

		if (value && !validateUrl(value)) {
			setLocalErrors((prev) => ({
				...prev,
				[fieldName]: `Please enter a valid ${fieldName} URL`,
			}));
			return;
		}

		setSavingField(fieldName);

		try {
			let success = false;

			if (updateSingleLink) {
				success = await updateSingleLink(
					fieldName as keyof PortfolioLinks,
					value,
				);
			} else {
				const updatePayload = { ...originalLinks, [fieldName]: value };
				await onLinksUpdate(updatePayload);
				success = true;
			}

			if (success) {
				setOriginalLinks((prev) => ({ ...prev, [fieldName]: value }));

				setHasChanges((prev) => ({ ...prev, [fieldName]: false }));

				showToast({
					title: value
						? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} link updated`
						: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} link removed`,
					variant: "success",
				});
			}
		} catch (error) {
			console.error(`Error saving ${fieldName}:`, error);
			showToast({
				title: `Failed to save ${fieldName}`,
				variant: "error",
			});
		} finally {
			setSavingField(null);
		}
	};

	const handleResumeFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const path = `resumes/${Date.now()}-${file.name}`;
			const url = await uploadFileToFirebase(file, path);
			const updatedLinks = { ...links, resumeUrl: url };
			setLinks(updatedLinks);
			await onLinksUpdate(updatedLinks);
			setOriginalLinks(updatedLinks);
			setHasChanges((prev) => ({ ...prev, resumeUrl: false }));
			setLocalErrors((prev) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { resumeUrl, ...rest } = prev;
				return rest;
			});
		} catch {
			setLocalErrors((prev) => ({
				...prev,
				resumeUrl: "Failed to upload file",
			}));
		} finally {
			setUploading(false);
		}
	};

	const anyChanges = Object.values(hasChanges).some(Boolean);
	const anyErrors = Object.keys(localErrors).length > 0;

	return (
		<>
			<ProfileSection
				title="Document Links"
				canEdit={canEdit}
				isEditing={isEditingLinks}
				onEdit={handleEditLinks}
				onSave={handleSaveLinks}
				onCancel={handleCancelLinks}
				saveButtonText="Save Changes"
				isSubmitting={savingField !== null}
				saveDisabled={!anyChanges || anyErrors}
			>
				<div className="space-y-4 md:px-4">
					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<BiFile className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">Resume</span>
						</div>

						{isEditingLinks ? (
							<div className="w-full relative">
								<div className="flex items-center">
									<input
										type="file"
										accept="application/pdf"
										onChange={handleResumeFileChange}
										disabled={uploading}
										className="w-full"
									/>
									{uploading && (
										<span className="ml-2 text-blue-600">Uploading...</span>
									)}
								</div>
								{localErrors.resumeUrl && (
									<p className="text-red-500 text-xs mt-1">
										{localErrors.resumeUrl}
									</p>
								)}
								{links.resumeUrl && !localErrors.resumeUrl && (
									<p className="text-green-600 text-xs mt-1">
										Resume uploaded successfully.
									</p>
								)}
							</div>
						) : resume ? (
							<div className="flex-1 min-w-0">
								<a
									href={resume.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-dark hover:underline inline-flex items-center gap-1 break-all"
								>
									<span className="break-words">
										{getFileNameFromUrl(resume.url)}
									</span>
									<ExternalLink className="h-3 w-3 flex-shrink-0 inline align-text-bottom" />
								</a>
							</div>
						) : (
							<span className="text-gray-500">Not provided</span>
						)}
					</div>

					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<FaLinkedin className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">LinkedIn</span>
						</div>

						{isEditingLinks ? (
							<div className="w-full relative">
								<div className="flex items-center">
									<Input
										name="linkedin"
										value={links.linkedin || ""}
										onChange={handleLinkChange}
										placeholder="LinkedIn Profile URL"
										className={`w-full ${localErrors.linkedin ? "border-red-500" : hasChanges.linkedin ? "border-blue-500" : ""}`}
									/>
									<Button
										size="sm"
										className="ml-2"
										onClick={() => handleSaveField("linkedin")}
										disabled={
											!hasChanges.linkedin ||
											!!localErrors.linkedin ||
											savingField === "linkedin"
										}
									>
										{savingField === "linkedin" ? (
											<span className="animate-spin">⏳</span>
										) : (
											<CheckCircle className="h-4 w-4" />
										)}
									</Button>
								</div>
								{localErrors.linkedin && (
									<p className="text-red-500 text-xs mt-1">
										{localErrors.linkedin}
									</p>
								)}
								{hasChanges.linkedin && !localErrors.linkedin && (
									<p className="text-red-500 font-medium text-xs mt-1">
										Changes not saved (Please save changes when you are done)
									</p>
								)}
							</div>
						) : links.linkedin ? (
							<div className="flex-1 min-w-0">
								<a
									href={links.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-dark hover:underline inline-flex items-center gap-1 break-all"
								>
									<span className="break-words">
										{links.linkedin.replace(/^https?:\/\/(www\.)?/i, "")}
									</span>
									<ExternalLink className="h-3 w-3 flex-shrink-0 inline align-text-bottom" />
								</a>
							</div>
						) : (
							<span className="text-gray-500">Not provided</span>
						)}
					</div>

					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<FaGithub className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">GitHub</span>
						</div>

						{isEditingLinks ? (
							<div className="w-full relative">
								<div className="flex items-center">
									<Input
										name="github"
										value={links.github || ""}
										onChange={handleLinkChange}
										placeholder="GitHub Link"
										className={`w-full ${localErrors.github ? "border-red-500" : hasChanges.github ? "border-blue-500" : ""}`}
									/>
									<Button
										size="sm"
										className="ml-2"
										onClick={() => handleSaveField("github")}
										disabled={
											!hasChanges.github ||
											!!localErrors.github ||
											savingField === "github"
										}
									>
										{savingField === "github" ? (
											<span className="animate-spin">⏳</span>
										) : (
											<CheckCircle className="h-4 w-4" />
										)}
									</Button>
								</div>
								{localErrors.github && (
									<p className="text-red-500 text-xs mt-1">
										{localErrors.github}
									</p>
								)}
								{hasChanges.github && !localErrors.github && (
									<p className="text-red-500 font-medium text-xs mt-1">
										Changes not saved (Please save changes when you are done)
									</p>
								)}
							</div>
						) : links.github ? (
							<div className="flex-1 min-w-0">
								<a
									href={links.github}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-dark hover:underline inline-flex items-center gap-1 break-all"
								>
									<span className="break-words">
										{links.github.replace(/^https?:\/\/(www\.)?/i, "")}
									</span>
									<ExternalLink className="h-3 w-3 flex-shrink-0 inline align-text-bottom" />
								</a>
							</div>
						) : (
							<span className="text-gray-500">Not provided</span>
						)}
					</div>

					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<FaBehance className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">Behance</span>
						</div>

						{isEditingLinks ? (
							<div className="w-full relative">
								<div className="flex items-center">
									<Input
										name="behance"
										value={links.behance || ""}
										onChange={handleLinkChange}
										placeholder="Behance Link"
										className={`w-full ${localErrors.behance ? "border-red-500" : hasChanges.behance ? "border-blue-500" : ""}`}
									/>
									<Button
										size="sm"
										className="ml-2"
										onClick={() => handleSaveField("behance")}
										disabled={
											!hasChanges.behance ||
											!!localErrors.behance ||
											savingField === "behance"
										}
									>
										{savingField === "behance" ? (
											<span className="animate-spin">⏳</span>
										) : (
											<CheckCircle className="h-4 w-4" />
										)}
									</Button>
								</div>
								{localErrors.behance && (
									<p className="text-red-500 text-xs mt-1">
										{localErrors.behance}
									</p>
								)}
								{hasChanges.behance && !localErrors.behance && (
									<p className="text-red-500 font-medium text-xs mt-1">
										Changes not saved (Please save changes when you are done)
									</p>
								)}
							</div>
						) : links.behance ? (
							<div className="flex-1 min-w-0">
								<a
									href={links.behance}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-dark hover:underline inline-flex items-center gap-1 break-all"
								>
									<span className="break-words">
										{links.behance.replace(/^https?:\/\/(www\.)?/i, "")}
									</span>
									<ExternalLink className="h-3 w-3 flex-shrink-0 inline align-text-bottom" />
								</a>
							</div>
						) : (
							<span className="text-gray-500">Not provided</span>
						)}
					</div>

					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<BiWorld className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">Website</span>
						</div>

						{isEditingLinks ? (
							<div className="w-full relative">
								<div className="flex items-center">
									<Input
										name="portfolio"
										value={links.portfolio || ""}
										onChange={handleLinkChange}
										placeholder="Portfolio Website Link"
										className={`w-full ${localErrors.portfolio ? "border-red-500" : hasChanges.portfolio ? "border-blue-500" : ""}`}
									/>
									<Button
										size="sm"
										className="ml-2"
										onClick={() => handleSaveField("portfolio")}
										disabled={
											!hasChanges.portfolio ||
											!!localErrors.portfolio ||
											savingField === "portfolio"
										}
									>
										{savingField === "portfolio" ? (
											<span className="animate-spin">⏳</span>
										) : (
											<CheckCircle className="h-4 w-4" />
										)}
									</Button>
								</div>
								{localErrors.portfolio && (
									<p className="text-red-500 text-xs mt-1">
										{localErrors.portfolio}
									</p>
								)}
								{hasChanges.portfolio && !localErrors.portfolio && (
									<p className="text-red-500 font-medium text-xs mt-1">
										Changes not saved (Please save changes when you are done)
									</p>
								)}
							</div>
						) : links.portfolio ? (
							<div className="flex-1 min-w-0">
								<a
									href={links.portfolio}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline inline-flex items-center gap-1 break-all"
								>
									<span className="break-words">
										{links.portfolio.replace(/^https?:\/\/(www\.)?/i, "")}
									</span>
									<ExternalLink className="h-3 w-3 flex-shrink-0 inline align-text-bottom" />
								</a>
							</div>
						) : (
							<span className="text-gray-500">Not provided</span>
						)}
					</div>
				</div>
			</ProfileSection>
		</>
	);
};

export default DocumentsSection;
