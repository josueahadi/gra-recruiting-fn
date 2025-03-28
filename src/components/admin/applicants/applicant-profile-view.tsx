"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import UnifiedProfileView, {
	type ApplicantData,
} from "@/components/profile/container/unified-profile-view";

interface ApplicantProfileViewProps {
	id: string;
}

const ApplicantProfileView: React.FC<ApplicantProfileViewProps> = ({ id }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [applicantData, setApplicantData] = useState<ApplicantData | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);

	// In a real app, you would fetch this data from your API using the ID
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchApplicantData = async () => {
			setIsLoading(true);
			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Mock data for demonstration
				const mockApplicant: ApplicantData = {
					id: "1",
					name: "John Doe",
					personalInfo: {
						firstName: "John",
						lastName: "Doe",
						email: "johndoe01@gmail.com",
						phone: "+250 787 435 382",
						bio: "Lorem Ipsum Dolor Sit Amet Consectetur",
					},
					addressInfo: {
						country: "Rwanda",
						city: "Kigali",
						address: "KN 21 Ave",
						postalCode: "00000",
					},
					department: "Marketing",
					dateApplied: "12/06/2025",
					skills: {
						technical: [
							{ id: "1", name: "Software Engineering" },
							{ id: "2", name: "Frontend Development" },
							{ id: "3", name: "Backend Development" },
							{ id: "4", name: "Database" },
							{ id: "5", name: "MySQL" },
							{ id: "6", name: "Data Analysis" },
							{ id: "7", name: "AI" },
							{ id: "8", name: "Machine Learning" },
						],
						soft: [
							{ id: "1", name: "Communication" },
							{ id: "2", name: "Teamwork" },
							{ id: "3", name: "Problem Solving" },
						],
					},
					languages: [
						{ language: "Kinyarwanda", level: 10 },
						{ language: "French", level: 6 },
						{ language: "English", level: 7 },
					],
					education: [
						{
							id: "1",
							institution: "University Of Rwanda",
							degree: "Bachelor's Degree",
							program: "Software Engineering",
							startYear: "2019",
							endYear: "2023",
						},
						{
							id: "2",
							institution: "College Saint Andre",
							degree: "High School",
							program: "Mathematic Physics & Computer Science",
							startYear: "2017",
							endYear: "2019",
						},
					],
					experience: [
						{
							id: "1",
							company: "Solution",
							role: "Software Engineer",
							duration: "1 year",
							responsibilities: "Backend development with Node.js and Express",
						},
						{
							id: "2",
							company: "Tap Bits",
							role: "Frontend Developer",
							duration: "2 years",
							responsibilities: "Frontend development with React and Next.js",
						},
					],
					documents: {
						resume: { name: "Resume.pdf", url: "#" },
						samples: [],
					},
					portfolioLinks: {
						github: "https://github.com/johndoe36",
						behance: "https://behance.com/johndoe36",
					},
					avatarSrc: "/images/avatar.jpg",
				};

				setApplicantData(mockApplicant);
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

	const handleDataChange = (data: Partial<ApplicantData>) => {
		// In a real app, you would make an API call to update the data
		console.log("Updating applicant data:", data);

		// For demo purposes we just show a toast
		toast({
			title: "Applicant Updated",
			description: "The applicant profile has been updated.",
		});
	};

	return (
		<UnifiedProfileView
			id={id}
			userType="admin"
			initialData={applicantData}
			onNavigateBack={handleGoBack}
			onDataChange={handleDataChange}
			isLoading={isLoading}
		/>
	);
};

export default ApplicantProfileView;
