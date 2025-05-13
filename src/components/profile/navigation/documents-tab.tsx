import type React from "react";
import type { Document, PortfolioLinks } from "@/types/profile";
import ProfileNavigationButtons from "@/components/profile/navigation/profile-nav-buttons";
import DocumentsSection from "@/components/profile/sections/documents";

interface DocumentsTabProps {
	resume: Document | null;
	samples: Document[];
	portfolioLinks: PortfolioLinks;
	onFileUpload: (type: "resume" | "sample", file: File) => void;
	onFileRemove: (type: "resume" | "sample", index?: number) => void;
	onLinksUpdate: (links: PortfolioLinks) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
	resume,
	samples,
	portfolioLinks,
	onFileUpload,
	onFileRemove,
	onLinksUpdate,
}) => {
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
			/>

			<div className="mt-12">
				<ProfileNavigationButtons />
			</div>
		</>
	);
};

export default DocumentsTab;
