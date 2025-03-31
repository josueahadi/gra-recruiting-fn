"use client";

import React from "react";
import { DocumentsSection } from "@/components/profile";
import { type Document, type PortfolioLinks } from "@/hooks/use-profile";
import ProfileNavigationButtons from "./profile-nav-buttons";

interface DocumentsTabProps {
	resume: Document | null;
	samples: Document[];
	portfolioLinks: PortfolioLinks;
	onFileUpload: (type: "resume" | "sample", file: File) => void;
	onFileRemove: (type: "resume" | "sample", index?: number) => void;
	onLinksUpdate: (links: PortfolioLinks) => void;
}

/**
 * Component for Documents tab in applicant view
 */
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
			<h1 className="text-2xl font-bold text-primary-base mb-6">
				Documents & Portfolio
			</h1>

			<DocumentsSection
				resume={resume}
				samples={samples}
				portfolioLinks={portfolioLinks}
				canEdit={true}
				onFileUpload={onFileUpload}
				onFileRemove={onFileRemove}
				onLinksUpdate={onLinksUpdate}
			/>

			<ProfileNavigationButtons />
		</>
	);
};

export default DocumentsTab;
