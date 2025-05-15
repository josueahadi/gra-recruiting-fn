import type React from "react";
import type { Document, PortfolioLinks } from "@/types/profile";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";
import DocumentsSection from "@/components/profile/sections/documents";
import { useDocuments } from "@/hooks/use-documents";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentsTabProps {
	resume: Document | null;
	samples: Document[];
	portfolioLinks: PortfolioLinks;
	onFileUpload: (type: "resume" | "sample", file: File) => void;
	onFileRemove: (type: "resume" | "sample", index?: number) => void;
	onLinksUpdate: (links: PortfolioLinks) => void;
	updateResumeUrl?: (url: string) => Promise<boolean>;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
	resume,
	samples,
	portfolioLinks,
	onFileUpload,
	onFileRemove,
	onLinksUpdate,
	updateResumeUrl,
}) => {
	const queryClient = useQueryClient();
	const { fieldErrors, updateSingleLink } = useDocuments(
		null,
		() => {},
		queryClient,
	);

	return (
		<>
			<h1 className="text-2xl font-bold text-primary-base mb-6">Documents</h1>

			<DocumentsSection
				resume={resume}
				samples={samples}
				portfolioLinks={portfolioLinks}
				canEdit={true}
				onFileUpload={onFileUpload}
				onFileRemove={onFileRemove}
				onLinksUpdate={onLinksUpdate}
				updateResumeUrl={updateResumeUrl}
				fieldErrors={fieldErrors}
				updateSingleLink={updateSingleLink}
			/>

			<div className="mt-12">
				<ProfileNavigationButtons />
			</div>
		</>
	);
};

export default DocumentsTab;
