import type React from "react";
import { useState, useRef } from "react";
import ProfileSection from "@/components/profile/core/profile-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, ExternalLink } from "lucide-react";
import type { Document, PortfolioLinks } from "@/hooks/use-profile";
import { FaBehance, FaGithub } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { Separator } from "@/components/ui/separator";

interface DocumentsSectionProps {
	resume: Document | null;
	samples: Document[];
	portfolioLinks: PortfolioLinks;
	canEdit: boolean;
	onFileUpload: (type: "resume" | "sample", file: File) => void;
	onFileRemove: (type: "resume" | "sample", index?: number) => void;
	onLinksUpdate: (links: PortfolioLinks) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
	resume,
	// samples,
	portfolioLinks,
	canEdit,
	onFileUpload,
	onFileRemove,
	onLinksUpdate,
}) => {
	// Resume upload state
	const [isUploading, setIsUploading] = useState(false);
	const resumeInputRef = useRef<HTMLInputElement>(null);

	// Portfolio links editing state
	const [isEditingLinks, setIsEditingLinks] = useState(false);
	const [links, setLinks] = useState<PortfolioLinks>(portfolioLinks);

	// Resume/CV handling
	const handleResumeUpload = () => {
		if (canEdit && resumeInputRef.current) {
			resumeInputRef.current.click();
		}
	};

	const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setIsUploading(true);
			onFileUpload("resume", files[0]);

			// Reset the input value
			e.target.value = "";

			// Simulate upload delay
			setTimeout(() => {
				setIsUploading(false);
			}, 1000);
		}
	};

	// Portfolio links handlers
	const handleEditLinks = () => {
		setIsEditingLinks(true);
	};

	const handleSaveLinks = () => {
		setIsEditingLinks(false);
		onLinksUpdate(links);
	};

	const handleCancelLinks = () => {
		setIsEditingLinks(false);
		setLinks(portfolioLinks);
	};

	const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLinks((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<>
			{/* Resume/CV Section */}
			<ProfileSection
				title="Resume"
				canEdit={false} // No edit button for this section as it has its own upload interface
				isEditing={false}
				onEdit={() => {}}
				onSave={() => {}}
			>
				<div className="border border-dashed border-primary-base rounded-md p-10 bg-primary-base bg-opacity-10">
					{resume ? (
						<div className="flex flex-col sm:flex-row justify-center gap-2">
							<Button
								className="bg-primary-base text-white font-semibold hover:bg-custom-skyBlue flex items-center justify-center gap-2 px-4 md:px-8 w-full sm:w-auto"
								onClick={() => window.open(resume.url, "_blank")}
							>
								Download Resume <Download className="h-4 w-4" />
							</Button>

							{canEdit && (
								<Button
									variant="ghost"
									className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto md:ml-2"
									onClick={() => onFileRemove("resume")}
								>
									Remove
								</Button>
							)}
						</div>
					) : (
						<div className="flex justify-center">
							{canEdit ? (
								<>
									<Button
										className="bg-white border border-custom-navyBlue text-black hover:bg-white hover:bg-opacity-50 flex items-center gap-2"
										onClick={handleResumeUpload}
										disabled={isUploading}
									>
										{isUploading ? (
											<>
												<div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
												Uploading...
											</>
										) : (
											<>
												<span>Upload Resume/CV</span>
												<Upload className="h-4 w-4" />
											</>
										)}
									</Button>
									<input
										ref={resumeInputRef}
										type="file"
										accept=".pdf,.doc,.docx"
										className="hidden"
										onChange={handleResumeFileChange}
									/>
								</>
							) : (
								<p className="text-gray-500 italic">No resume uploaded yet.</p>
							)}
						</div>
					)}
				</div>
			</ProfileSection>

			<div className="md:px-10">
				<Separator className="my-8 bg-custom-separator bg-opacity-50" />
			</div>

			{/* Portfolio Links Section */}
			<ProfileSection
				title="Optional Links"
				canEdit={canEdit}
				isEditing={isEditingLinks}
				onEdit={handleEditLinks}
				onSave={handleSaveLinks}
				onCancel={handleCancelLinks}
			>
				<div className="space-y-4 md:px-4">
					{/* GitHub Link */}
					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<FaGithub className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">GitHub</span>
						</div>

						{isEditingLinks ? (
							<Input
								name="github"
								value={links.github || ""}
								onChange={handleLinkChange}
								placeholder="GitHub Link"
								className="w-full"
							/>
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

					{/* Behance Link */}
					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<FaBehance className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">Behance</span>
						</div>

						{isEditingLinks ? (
							<Input
								name="behance"
								value={links.behance || ""}
								onChange={handleLinkChange}
								placeholder="Behance Link"
								className="w-full"
							/>
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

					{/* Portfolio Link */}
					<div className="flex flex-wrap items-start gap-2 sm:gap-4">
						<div className="flex items-center gap-2 w-full sm:w-28">
							<BiWorld className="w-5 h-5 text-primary-base flex-shrink-0" />
							<span className="font-medium">Website</span>
						</div>

						{isEditingLinks ? (
							<Input
								name="portfolio"
								value={links.portfolio || ""}
								onChange={handleLinkChange}
								placeholder="Portfolio Website Link"
								className="w-full"
							/>
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
