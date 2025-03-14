"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X, File, FileText, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Document {
	id: string;
	name: string;
	type: "cv" | "certificate" | "portfolio";
	uploadDate: string;
	size: string;
}

const DocumentsSection = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [documents, setDocuments] = useState<Document[]>([
		{
			id: "1",
			name: "John_Doe_CV_2024.pdf",
			type: "cv",
			uploadDate: "Mar 10, 2024",
			size: "1.2 MB",
		},
		{
			id: "2",
			name: "Computer_Science_Degree.pdf",
			type: "certificate",
			uploadDate: "Feb 15, 2024",
			size: "3.5 MB",
		},
		{
			id: "3",
			name: "Portfolio_Website.pdf",
			type: "portfolio",
			uploadDate: "Jan 5, 2024",
			size: "5.7 MB",
		},
	]);

	const [portfolioLinks, setPortfolioLinks] = useState({
		portfolio: "",
		github: "",
		linkedin: "",
	});

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setIsUploading(true);

			// Simulate upload delay
			setTimeout(() => {
				const newDocs = Array.from(files).map((file) => ({
					id:
						Date.now().toString() + Math.random().toString(36).substring(2, 9),
					name: file.name,
					type: "cv" as const, // Default type, can be changed later
					uploadDate: new Date().toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					}),
					size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
				}));

				setDocuments([...documents, ...newDocs]);
				setIsUploading(false);
			}, 1500);
		}
	};

	const handleDocumentDelete = (id: string) => {
		setDocuments(documents.filter((doc) => doc.id !== id));
	};

	const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setPortfolioLinks({
			...portfolioLinks,
			[id.split("-")[0]]: value,
		});
	};

	const getDocumentIcon = (type: string) => {
		switch (type) {
			case "cv":
				return <FileText className="h-6 w-6 text-primary-500" />;
			case "certificate":
				return <File className="h-6 w-6 text-green-500" />;
			case "portfolio":
				return <FileText className="h-6 w-6 text-purple-500" />;
			default:
				return <File className="h-6 w-6 text-gray-500" />;
		}
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-primary-600">
					Documents & Portfolio
				</h1>
			</div>

			<div className="space-y-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl text-primary-500">
							My Documents
						</CardTitle>
						<Button
							onClick={() => document.getElementById("file-upload")?.click()}
							className="bg-primary-base hover:bg-primary-dark"
						>
							<Upload className="h-4 w-4 mr-2" />
							Upload Files
						</Button>
						<input
							id="file-upload"
							type="file"
							multiple
							className="hidden"
							onChange={handleFileUpload}
						/>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						{isUploading && (
							<div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<title>Loading</title>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Uploading files...
							</div>
						)}

						<div className="overflow-hidden rounded-md border">
							<div className="bg-gray-50 px-4 py-3 text-sm font-medium">
								All Documents
							</div>

							<div className="divide-y">
								{documents.length === 0 ? (
									<div className="py-6 text-center text-gray-500">
										<p>No documents uploaded yet</p>
									</div>
								) : (
									documents.map((doc) => (
										<div
											key={doc.id}
											className="flex items-center justify-between px-4 py-3"
										>
											<div className="flex items-center space-x-3">
												{getDocumentIcon(doc.type)}
												<div>
													<p className="font-medium">{doc.name}</p>
													<p className="text-xs text-gray-500">
														Uploaded on {doc.uploadDate} • {doc.size}
													</p>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Button variant="outline" size="sm">
													<Download className="h-4 w-4 mr-1" />
													Download
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-500 hover:text-red-700"
													onClick={() => handleDocumentDelete(doc.id)}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-xl text-primary-500">
							Portfolio Links
						</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="space-y-4">
							<div>
								<Label htmlFor="portfolio-link">Portfolio Website</Label>
								<div className="flex mt-1">
									<Input
										id="portfolio-link"
										placeholder="https://yourportfolio.com"
										value={portfolioLinks.portfolio}
										onChange={handleLinkChange}
										className="rounded-r-none"
									/>
									<Button className="rounded-l-none">Save</Button>
								</div>
							</div>

							<div>
								<Label htmlFor="github-link">GitHub Profile</Label>
								<div className="flex mt-1">
									<Input
										id="github-link"
										placeholder="https://github.com/yourusername"
										value={portfolioLinks.github}
										onChange={handleLinkChange}
										className="rounded-r-none"
									/>
									<Button className="rounded-l-none">Save</Button>
								</div>
							</div>

							<div>
								<Label htmlFor="linkedin-link">LinkedIn Profile</Label>
								<div className="flex mt-1">
									<Input
										id="linkedin-link"
										placeholder="https://linkedin.com/in/yourusername"
										value={portfolioLinks.linkedin}
										onChange={handleLinkChange}
										className="rounded-r-none"
									/>
									<Button className="rounded-l-none">Save</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-xl text-primary-500">Projects</CardTitle>
					</CardHeader>

					<Separator className="mb-4" />

					<CardContent>
						<div className="text-center py-6">
							<div className="mb-4">
								<FileText className="h-12 w-12 text-gray-300 mx-auto" />
							</div>
							<h3 className="text-lg font-medium mb-2">
								No projects added yet
							</h3>
							<p className="text-gray-500 mb-4">
								Showcase your work by adding projects to your portfolio
							</p>
							<Button className="bg-primary-base hover:bg-primary-dark">
								<Plus className="h-4 w-4 mr-2" />
								Add Project
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DocumentsSection;
