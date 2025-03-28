"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Define applicant data structure
export interface ApplicantData {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: "success" | "fail" | "waiting";
	department: string;
	dateApplied: string;
	bio?: string;
	location?: {
		country: string;
		city: string;
		address: string;
		postalCode: string;
	};
	skills?: string[];
	languages?: Array<{ language: string; level: string }>;
	education?: Array<{
		institution: string;
		degree: string;
		field: string;
		startDate: string;
		endDate: string;
	}>;
	experience?: Array<{
		position: string;
		company: string;
		type: string;
		startDate: string;
		endDate: string;
	}>;
	documents?: Array<{ name: string; url: string }>;
	links?: Record<string, string>;
	avatarSrc?: string;
}

// Mock data for demonstration
const MOCK_APPLICANT: ApplicantData = {
	id: "1",
	name: "John Doe",
	email: "johndoe01@gmail.com",
	phone: "+250 787 435 382",
	status: "success",
	department: "Marketing",
	dateApplied: "12/06/2025",
	bio: "Lorem Ipsum Dolor Sit Amet Consectetur",
	location: {
		country: "Rwanda",
		city: "Kigali",
		address: "KN 21 Ave",
		postalCode: "00000",
	},
	skills: [
		"Software Engineering",
		"Frontend Development",
		"Backend Development",
		"Database",
		"MySQL",
		"Data Analysis",
		"AI",
		"Machine Learning",
	],
	languages: [
		{ language: "Kinyarwanda", level: "Native" },
		{ language: "French", level: "Intermediate" },
		{ language: "English", level: "Intermediate" },
	],
	education: [
		{
			institution: "University Of Rwanda",
			degree: "Bachelor's Degree",
			field: "Software Engineering",
			startDate: "01/01/2021",
			endDate: "01/11/2021",
		},
		{
			institution: "College Saint Andre",
			degree: "High School",
			field: "Mathematic Physics & Computer Science",
			startDate: "01/01/2017",
			endDate: "01/11/2019",
		},
	],
	experience: [
		{
			position: "Software Engineer",
			company: "Solution",
			type: "Part-time",
			startDate: "01/01/2021",
			endDate: "01/01/2021",
		},
		{
			position: "Frontend Developer",
			company: "Tap Bits",
			type: "Full-time",
			startDate: "01/01/2021",
			endDate: "01/01/2021",
		},
	],
	documents: [{ name: "Resume.pdf", url: "#" }],
	links: {
		GitHub: "https://github.com/johndoe36",
		Behance: "https://behance.com/johndoe36",
	},
	avatarSrc: "/images/avatar.jpg",
};

interface ApplicantProfileViewProps {
	id: string;
}

const ApplicantProfileView: React.FC<ApplicantProfileViewProps> = ({ id }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [applicant, setApplicant] = useState<ApplicantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// In a real app, you would fetch this data from your API using the ID from the URL
		const fetchApplicantData = async () => {
			setIsLoading(true);
			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 500));
				setApplicant(MOCK_APPLICANT);
			} catch (error) {
				console.error("Error fetching applicant data:", error);
				toast({
					title: "Error",
					description: "Failed to load applicant data",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchApplicantData();
	}, [toast, id]);

	const handleGoBack = () => {
		router.push("/admin/applicants");
	};

	// Render loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
			</div>
		);
	}

	// Render error state
	if (!applicant) {
		return (
			<div className="flex flex-col items-center justify-center h-96">
				<h2 className="text-xl font-semibold mb-2">Applicant Not Found</h2>
				<Button onClick={handleGoBack} variant="outline">
					Go Back
				</Button>
			</div>
		);
	}

	// Get first name and last name
	const firstName = applicant.name.split(" ")[0];
	const lastName = applicant.name.split(" ").slice(1).join(" ");

	// Render info field
	const renderInfoField = (label: string, value: string | undefined) => (
		<div>
			<p className="text-gray-600 text-sm">{label}</p>
			<p className="font-medium">{value || "-"}</p>
		</div>
	);

	return (
		<div>
			{/* Header with back button */}
			<div className="flex items-center mb-4">
				<Button variant="ghost" onClick={handleGoBack} size="sm">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
			</div>

			{/* Main content */}
			<div className="bg-white rounded-lg">
				{/* Profile header with picture */}
				<div className="flex flex-col items-center p-6 border-b">
					<div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
						<Image
							src={applicant.avatarSrc || "/images/avatar.jpg"}
							alt={applicant.name}
							fill
							className="object-cover"
						/>
					</div>
					<h2 className="text-2xl font-bold">{applicant.name}</h2>
					<p className="text-gray-600">
						{applicant.location?.city}/{applicant.location?.country}
					</p>
				</div>

				{/* Personal Information Section */}
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold mb-4">Personal Information</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8">
						{renderInfoField("First Name", firstName)}
						{renderInfoField("Last Name", lastName)}
						{renderInfoField("Email Address", applicant.email)}
						{renderInfoField("Phone Number", applicant.phone)}
						{renderInfoField("Bio", applicant.bio)}
					</div>
				</div>

				{/* Address Section */}
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold mb-4">Address</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8">
						{renderInfoField("Country", applicant.location?.country)}
						{renderInfoField("City/State", applicant.location?.city)}
						{renderInfoField("Postal Code", applicant.location?.postalCode)}
						{renderInfoField("Street No", applicant.location?.address)}
					</div>
				</div>

				{/* Department Section */}
				<div className="p-6 border-b flex justify-between">
					<h3 className="text-xl font-bold">Department</h3>
					<span className="text-xl">{applicant.department}</span>
				</div>

				{/* Skills Section */}
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold mb-4">Skills</h3>

					<div className="flex flex-wrap gap-2">
						{applicant.skills?.map((skill, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="bg-slate-600 text-white px-4 py-2 rounded-full"
							>
								{skill}
							</div>
						))}
					</div>
				</div>

				{/* Language Proficiency */}
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold mb-4">Language Proficiency</h3>

					<div className="flex flex-wrap gap-4">
						{applicant.languages?.map((lang, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="bg-blue-50 px-4 py-2 rounded-md text-center min-w-28"
							>
								<div>{lang.language}</div>
								<div className="text-sm text-gray-600">{lang.level}</div>
							</div>
						))}
					</div>
				</div>

				{/* Work Experience */}
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold mb-4">Work Experience</h3>

					<div className="space-y-4">
						{applicant.experience?.map((exp, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="bg-blue-50 rounded-md p-4 flex justify-between items-start relative"
							>
								<div>
									<div className="text-lg font-semibold">{exp.position}</div>
									<div>
										{exp.company} • {exp.type}
									</div>
									<div className="text-sm text-gray-500 mt-1">
										{exp.startDate} - {exp.endDate}
									</div>
								</div>
								<button
									type="button"
									className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>SVG</title>
										<path
											d="M6 18L18 6M6 6L18 18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>

				{/* Education */}
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold mb-4">Education</h3>

					<div className="space-y-4">
						{applicant.education?.map((edu, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="bg-blue-50 rounded-md p-4 flex justify-between items-start relative"
							>
								<div>
									<div className="text-lg font-semibold">{edu.institution}</div>
									<div>
										{edu.degree} • {edu.field}
									</div>
									<div className="text-sm text-gray-500 mt-1">
										{edu.startDate} - {edu.endDate}
									</div>
								</div>
								<button
									type="button"
									className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>SVG</title>
										<path
											d="M6 18L18 6M6 6L18 18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>

				{/* Resume/CV */}
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold mb-4">Resume/CV</h3>

					<div className="p-8 border border-blue-200 border-dashed rounded-md flex justify-center">
						<Button
							className="bg-blue-500 hover:bg-blue-600 py-3 px-6 flex items-center"
							asChild
						>
							<Link href="#" download>
								<Download className="mr-2 h-5 w-5" />
								Download Resume/CV
							</Link>
						</Button>
					</div>
				</div>

				{/* Optional Links */}
				<div className="p-6">
					<h3 className="text-xl font-bold mb-4">Optional Links</h3>

					<div className="space-y-4">
						{Object.entries(applicant.links || {}).map(
							([platform, url], index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={index} className="flex items-center">
									{platform === "GitHub" ? (
										<Github className="h-5 w-5 mr-2 text-gray-600" />
									) : (
										<span className="font-medium min-w-20">{platform}</span>
									)}
									<div className="border rounded-md flex-1 p-2 ml-2">
										<a
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline flex items-center"
										>
											{url}
											<ExternalLink className="h-3 w-3 ml-1" />
										</a>
									</div>
								</div>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ApplicantProfileView;
