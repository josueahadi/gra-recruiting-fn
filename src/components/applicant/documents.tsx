"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionLayout, {
	SectionItem,
} from "@/components/layout/applicant/section-layout";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DocumentsSection = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadedCV, setUploadedCV] = useState<string | null>(null);
	const [uploadedSamples, setUploadedSamples] = useState<string[]>([]);

	const [portfolioLinks, setPortfolioLinks] = useState({
		portfolio: "",
		github: "https://github.com/yourusername",
		behance: "https://behance.net/yourprofile",
	});

	const [isEditingLinks, setIsEditingLinks] = useState(false);

	const handleUploadCV = () => {
		// Trigger file input click
		document.getElementById("cv-upload")?.click();
	};

	const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setIsUploading(true);

			// Simulate upload delay
			setTimeout(() => {
				setUploadedCV(files[0].name);
				setIsUploading(false);
			}, 1500);
		}
	};

	const handleSamplesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setIsUploading(true);

			// Simulate upload delay
			setTimeout(() => {
				const newSamples = Array.from(files).map((file) => file.name);
				setUploadedSamples((prev) => [...prev, ...newSamples]);
				setIsUploading(false);
			}, 1500);
		}
	};

	const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPortfolioLinks((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRemoveSample = (index: number) => {
		setUploadedSamples((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSaveLinks = () => {
		setIsEditingLinks(false);
		// You would normally call an API to save here
	};

	return (
		<SectionLayout title="Documents & Portfolio">
			{/* Resume/CV Section */}
			<SectionItem title="Resume" showEditButton={false}>
				<div className="space-y-6">
					<h3 className="text-lg font-medium">Resume/CV Upload</h3>

					{isUploading && (
						<div className="py-3 px-4 bg-blue-50 text-blue-700 rounded-md flex items-center">
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Upload Icon</title>
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
							Uploading your document...
						</div>
					)}

					{uploadedCV ? (
						<div className="flex items-center justify-between bg-gray-50 border rounded-md p-3">
							<div className="flex items-center">
								<svg
									className="h-6 w-6 text-primary-base mr-2"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Upload Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								<span>{uploadedCV}</span>
							</div>
							<Button
								variant="ghost"
								onClick={() => setUploadedCV(null)}
								className="text-red-500 hover:text-red-700 p-1 h-auto"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<div className="flex items-center mt-4">
							<Button
								variant="outline"
								className="py-6 px-8 border rounded-md flex items-center space-x-2 hover:bg-gray-50"
								onClick={handleUploadCV}
							>
								<div className="flex items-center">
									<HiOutlineCloudUpload className="h-5 w-5 text-primary-base mr-2" />
									Resume/CV Upload
								</div>
							</Button>
							<input
								id="cv-upload"
								type="file"
								accept=".pdf,.doc,.docx"
								className="hidden"
								onChange={handleCVUpload}
							/>
						</div>
					)}
				</div>

				<div className="mt-8">
					<h3 className="text-lg font-medium mb-4">Work Samples (Optional)</h3>

					{uploadedSamples.length > 0 && (
						<div className="mb-4 space-y-2">
							{uploadedSamples.map((sample, index) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									className="flex items-center justify-between bg-gray-50 border rounded-md p-3"
								>
									<div className="flex items-center">
										<svg
											className="h-6 w-6 text-primary-base mr-2"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<title>Upload Icon</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										<span>{sample}</span>
									</div>
									<Button
										variant="ghost"
										onClick={() => handleRemoveSample(index)}
										className="text-red-500 hover:text-red-700 p-1 h-auto"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					)}

					<div className="flex flex-wrap gap-4 mt-4">
						<Button
							variant="outline"
							className="py-6 px-8 border rounded-md flex items-center space-x-2 hover:bg-gray-50"
							onClick={() => document.getElementById("samples-upload")?.click()}
						>
							<div className="flex items-center">
								<HiOutlineCloudUpload className="h-5 w-5 text-blue-400 mr-2" />
								PDFs
							</div>
						</Button>
						<input
							id="samples-upload"
							type="file"
							multiple
							accept=".pdf"
							className="hidden"
							onChange={handleSamplesUpload}
						/>

						<Button
							variant="outline"
							className="py-6 px-8 border rounded-md flex items-center space-x-2 hover:bg-gray-50"
						>
							<div className="flex items-center">
								<svg
									width="21"
									height="20"
									viewBox="0 0 21 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="w-5 h-5 mr-2"
								>
									<title>GitHub Icon</title>
									<path
										d="M10.5 0.246704C8.1255 0.246803 5.82849 1.09182 4.01999 2.63055C2.21149 4.16929 1.00953 6.30133 0.62916 8.64519C0.248793 10.989 0.714845 13.3918 1.94393 15.4235C3.17301 17.4551 5.08491 18.9832 7.33755 19.7342C7.83755 19.8217 8.02505 19.5217 8.02505 19.2592C8.02505 19.0217 8.01254 18.2342 8.01254 17.3967C5.50003 17.8592 4.85003 16.7842 4.65003 16.2217C4.4281 15.6747 4.0763 15.1899 3.62503 14.8092C3.27503 14.6217 2.77503 14.1592 3.61252 14.1467C3.9323 14.1814 4.23901 14.2927 4.50666 14.4711C4.7743 14.6495 4.99499 14.8899 5.15003 15.1717C5.2868 15.4174 5.47071 15.6337 5.69122 15.8082C5.91173 15.9827 6.1645 16.112 6.43506 16.1886C6.70562 16.2652 6.98864 16.2877 7.26791 16.2548C7.54717 16.2219 7.8172 16.1342 8.06251 15.9967C8.1058 15.4883 8.33237 15.013 8.70003 14.6592C6.47503 14.4092 4.15003 13.5467 4.15003 9.72173C4.13597 8.72788 4.50271 7.76631 5.17503 7.03423C4.86931 6.17045 4.90508 5.22252 5.27503 4.38423C5.27503 4.38423 6.1125 4.12172 8.02503 5.40923C9.66131 4.95921 11.3887 4.95921 13.025 5.40923C14.9375 4.10923 15.775 4.38423 15.775 4.38423C16.145 5.22251 16.1808 6.17046 15.875 7.03423C16.5494 7.76506 16.9164 8.72747 16.9 9.72173C16.9 13.5592 14.5625 14.4092 12.3375 14.6592C12.5762 14.9011 12.76 15.1915 12.8764 15.5107C12.9929 15.83 13.0393 16.1705 13.0125 16.5092C13.0125 17.8468 13 18.9217 13 19.2592C13 19.5217 13.1875 19.8342 13.6875 19.7342C15.9362 18.9771 17.8426 17.4455 19.0664 15.4128C20.2903 13.38 20.7519 10.9785 20.3689 8.63694C19.9859 6.29535 18.7832 4.16608 16.9755 2.62922C15.1678 1.09235 12.8727 0.247939 10.5 0.246704Z"
										fill="#39ADE3"
									/>
								</svg>
								GitHub
							</div>
						</Button>

						<Button
							variant="outline"
							className="py-6 px-8 border rounded-md flex items-center space-x-2 hover:bg-gray-50"
						>
							<div className="flex items-center">
								<svg
									width="21"
									height="14"
									viewBox="0 0 21 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="w-5 h-5 mr-2"
								>
									<title>Behance Icon</title>
									<path
										d="M9.67699 2.1053C10.0545 2.6448 10.2433 3.2883 10.2433 4.041C10.2433 4.8145 10.0545 5.4385 9.67199 5.9091C9.45698 6.1704 9.1432 6.4122 8.72817 6.6293C9.35822 6.8659 9.83326 7.239 10.157 7.7486C10.4771 8.2582 10.6383 8.8783 10.6383 9.6063C10.6383 10.3577 10.4546 11.0324 10.087 11.6278C9.85451 12.0217 9.56198 12.3558 9.21196 12.6249C8.79829 12.9434 8.32107 13.1611 7.81559 13.2619C7.27805 13.3763 6.69675 13.4322 6.0692 13.4322H0.5V0.753296H6.47298C7.98061 0.776696 9.04694 1.2265 9.67699 2.1053ZM2.96395 2.9555V5.7531H5.96919C6.50424 5.7531 6.94052 5.6478 7.2768 5.4385C7.61058 5.2292 7.77934 4.8574 7.77934 4.3257C7.77934 3.7329 7.55807 3.3442 7.11554 3.1531C6.73301 3.0218 6.24547 2.9555 5.65417 2.9555H2.96395ZM2.96395 7.8513V11.2326H5.96544C6.50174 11.2326 6.92052 11.1585 7.21804 11.009C7.76059 10.7308 8.03061 10.2056 8.03061 9.4256C8.03061 8.7639 7.76934 8.3115 7.2443 8.0645C6.94927 7.928 6.53674 7.8552 6.0067 7.8513H2.96395ZM18.1102 4.2477C18.749 4.5402 19.274 5.003 19.6878 5.6348C20.0653 6.1925 20.3079 6.8386 20.4179 7.5731C20.4829 8.0021 20.5079 8.6248 20.4979 9.4347H13.8386C13.8786 10.3746 14.1936 11.035 14.7962 11.412C15.1612 11.6473 15.5987 11.7656 16.115 11.7656C16.6576 11.7656 17.1001 11.6226 17.4401 11.3366C17.6276 11.1806 17.7914 10.9661 17.9327 10.6918H20.3729C20.3079 11.2469 20.0116 11.8124 19.4878 12.387C18.669 13.297 17.5226 13.7533 16.0488 13.7533C14.8312 13.7533 13.7586 13.3698 12.8297 12.6002C11.8972 11.8319 11.4334 10.58 11.4334 8.8471C11.4334 7.2221 11.8534 5.9754 12.6922 5.1083C13.5336 4.2438 14.6211 3.8083 15.96 3.8083C16.7576 3.807 17.4739 3.9539 18.1102 4.2477ZM14.5361 6.3654C14.1986 6.7229 13.9861 7.2065 13.8986 7.8162H18.0177C17.9739 7.1649 17.7601 6.6722 17.3814 6.3329C16.9976 5.9962 16.5263 5.8285 15.9625 5.8285C15.3512 5.8298 14.8737 6.0092 14.5361 6.3654ZM13.281 2.923H18.5777V1.3448H13.281V2.923Z"
										fill="#39ADE3"
									/>
								</svg>
								Behance
							</div>
						</Button>
					</div>
				</div>
			</SectionItem>

			{/* Portfolio Links Section */}
			<SectionItem
				title="Portfolio Links"
				showEditButton={true}
				onEdit={() => setIsEditingLinks(!isEditingLinks)}
			>
				<div className="space-y-6">
					<div>
						<Label htmlFor="portfolio">Portfolio Website</Label>
						<div className="flex mt-1">
							<Input
								id="portfolio"
								name="portfolio"
								placeholder="https://yourportfolio.com"
								value={portfolioLinks.portfolio}
								onChange={handleLinkChange}
								disabled={!isEditingLinks}
								className={cn(
									"rounded-r-none",
									!isEditingLinks && "bg-gray-50",
								)}
							/>
							{isEditingLinks && (
								<Button className="rounded-l-none bg-primary-base hover:bg-primary-dark">
									Save
								</Button>
							)}
						</div>
					</div>

					<div>
						<Label htmlFor="github">GitHub Profile</Label>
						<div className="flex mt-1">
							<Input
								id="github"
								name="github"
								placeholder="https://github.com/yourusername"
								value={portfolioLinks.github}
								onChange={handleLinkChange}
								disabled={!isEditingLinks}
								className={cn(
									"rounded-r-none",
									!isEditingLinks && "bg-gray-50",
								)}
							/>
							{isEditingLinks && (
								<Button className="rounded-l-none bg-primary-base hover:bg-primary-dark">
									Save
								</Button>
							)}
						</div>
					</div>

					<div>
						<Label htmlFor="behance">Behance Profile</Label>
						<div className="flex mt-1">
							<Input
								id="behance"
								name="behance"
								placeholder="https://behance.net/yourprofile"
								value={portfolioLinks.behance}
								onChange={handleLinkChange}
								disabled={!isEditingLinks}
								className={cn(
									"rounded-r-none",
									!isEditingLinks && "bg-gray-50",
								)}
							/>
							{isEditingLinks && (
								<Button className="rounded-l-none bg-primary-base hover:bg-primary-dark">
									Save
								</Button>
							)}
						</div>
					</div>

					{isEditingLinks && (
						<div className="flex justify-end">
							<Button
								onClick={handleSaveLinks}
								className="bg-primary-base hover:bg-primary-dark"
							>
								<Check className="h-4 w-4 mr-2" />
								Save All Changes
							</Button>
						</div>
					)}
				</div>
			</SectionItem>
		</SectionLayout>
	);
};

export default DocumentsSection;
