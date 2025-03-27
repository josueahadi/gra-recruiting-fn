import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import React from "react";

interface DocumentItem {
	name: string;
	url: string;
}

interface ApplicantDocumentsProps {
	documents?: DocumentItem[];
	links?: Record<string, string>;
}

export const ApplicantDocuments: React.FC<ApplicantDocumentsProps> = ({
	documents,
	links,
}) => {
	const hasContent =
		(documents && documents.length > 0) ||
		(links && Object.keys(links).length > 0);

	if (!hasContent) {
		return (
			<div className="text-center p-4 text-gray-500">
				No documents or links available
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{documents && documents.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
					<div className="space-y-2">
						{documents.map((doc, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
							>
								<span className="font-medium">{doc.name}</span>
								<Button
									variant="outline"
									size="sm"
									className="text-primary-base"
									asChild
								>
									<a href={doc.url} target="_blank" rel="noopener noreferrer">
										<Download className="h-4 w-4 mr-2" />
										Download
									</a>
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

			{links && Object.keys(links).length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">Links</h3>
					<div className="space-y-2">
						{Object.entries(links).map(([platform, url], index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
							>
								<span className="font-medium">{platform}</span>
								<Button
									variant="outline"
									size="sm"
									className="text-primary-base"
									asChild
								>
									<a href={url} target="_blank" rel="noopener noreferrer">
										<ExternalLink className="h-4 w-4 mr-2" />
										Visit
									</a>
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ApplicantDocuments;
