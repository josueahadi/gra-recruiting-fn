import type React from "react";
import { useState, useEffect } from "react";
import SectionLayout from "@/components/applicant/section-layout";
import PersonalInfoSection from "@/components/profile/sections/personal-info";
import AddressSection from "@/components/profile/sections/address";
import SkillsSection, {
	type Skill,
	type LanguageProficiency,
} from "@/components/profile/sections/skills";
import WorkEducationSection, {
	type Education,
	type WorkExperience,
} from "@/components/profile/sections/work-education";
import DocumentsSection, {
	type Document,
	type PortfolioLinks,
} from "@/components/profile/sections/documents";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Combined applicant data interface
export interface ApplicantData {
	id: string;
	name: string;
	personalInfo: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		bio: string;
	};
	addressInfo: {
		country: string;
		city: string;
		postalCode: string;
		address: string;
	};
	department?: string;
	dateApplied?: string;
	skills: {
		technical: Skill[];
		soft: Skill[];
	};
	languages: LanguageProficiency[];
	education: Education[];
	experience: WorkExperience[];
	documents: {
		resume: Document | null;
		samples: Document[];
	};
	portfolioLinks: PortfolioLinks;
	avatarSrc?: string;
}

interface UnifiedProfileViewProps {
	id: string;
	userType: "applicant" | "admin";
	initialData?: ApplicantData | null;
	onNavigateBack?: () => void;
	onDataChange?: (data: Partial<ApplicantData>) => void;
	isLoading?: boolean;
}

/**
 * UnifiedProfileView - A component to display and edit applicant profiles
 * Works for both applicant (self-view) and admin (viewing applicants) contexts
 */
const UnifiedProfileView: React.FC<UnifiedProfileViewProps> = ({
	// id,
	userType,
	initialData = null,
	onNavigateBack,
	onDataChange,
	isLoading = false,
}) => {
	const { toast } = useToast();
	const [applicantData, setApplicantData] = useState<ApplicantData | null>(
		null,
	);

	useEffect(() => {
		if (initialData) {
			setApplicantData(initialData);
		}
	}, [initialData]);

	const handleGoBack = () => {
		if (onNavigateBack) {
			onNavigateBack();
		}
	};

	// Update the applicant data and notify parent component
	const updateApplicantData = (data: Partial<ApplicantData>) => {
		if (applicantData) {
			const updatedData = { ...applicantData, ...data };
			setApplicantData(updatedData);

			if (onDataChange) {
				onDataChange(data);
			}

			toast({
				title: "Profile Updated",
				description: "Your changes have been saved successfully.",
			});
		}
	};

	// Handler for personal information updates
	const handlePersonalInfoUpdate = (personalInfo: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		bio: string;
	}) => {
		updateApplicantData({ personalInfo });
	};

	// Handler for address information updates
	const handleAddressUpdate = (addressInfo: {
		country: string;
		city: string;
		postalCode: string;
		address: string;
	}) => {
		updateApplicantData({ addressInfo });
	};

	// Handler for skills updates
	const handleSkillsUpdate = (data: {
		technicalSkills: Skill[];
		softSkills: Skill[];
		languages: LanguageProficiency[];
	}) => {
		updateApplicantData({
			skills: {
				technical: data.technicalSkills,
				soft: data.softSkills,
			},
			languages: data.languages,
		});
	};

	// Handler for work and education updates
	const handleWorkEducationUpdate = (data: {
		educationList: Education[];
		workList: WorkExperience[];
	}) => {
		updateApplicantData({
			education: data.educationList,
			experience: data.workList,
		});
	};

	// Handler for document uploads
	const handleCVUpload = (file: File) => {
		// In a real app, this would upload the file to a server and get back a URL
		const fakeDocument: Document = {
			name: file.name,
			url: "#", // This would be the real URL in production
		};

		if (applicantData) {
			updateApplicantData({
				documents: {
					...applicantData.documents,
					resume: fakeDocument,
				},
			});
		}
	};

	// Handler for sample uploads
	const handleSamplesUpload = (files: FileList) => {
		// In a real app, this would upload the files to a server and get back URLs
		const newSamples: Document[] = Array.from(files).map((file) => ({
			name: file.name,
			url: "#", // This would be the real URL in production
		}));

		if (applicantData) {
			updateApplicantData({
				documents: {
					...applicantData.documents,
					samples: [...applicantData.documents.samples, ...newSamples],
				},
			});
		}
	};

	// Handler for CV removal
	const handleCVRemove = () => {
		if (applicantData) {
			updateApplicantData({
				documents: {
					...applicantData.documents,
					resume: null,
				},
			});
		}
	};

	// Handler for sample removal
	const handleSampleRemove = (index: number) => {
		if (applicantData) {
			const newSamples = [...applicantData.documents.samples];
			newSamples.splice(index, 1);

			updateApplicantData({
				documents: {
					...applicantData.documents,
					samples: newSamples,
				},
			});
		}
	};

	// Handler for portfolio links updates
	const handleLinksUpdate = (links: PortfolioLinks) => {
		updateApplicantData({ portfolioLinks: links });
	};

	// Handler for avatar change
	const handleAvatarChange = (file: File) => {
		// In a real app, this would upload the file to a server and get back a URL
		// Here we create a temporary URL to preview the image
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				updateApplicantData({ avatarSrc: e.target.result as string });
			}
		};
		reader.readAsDataURL(file);
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
	if (!applicantData) {
		return (
			<div className="flex flex-col items-center justify-center h-96">
				<h2 className="text-xl font-semibold mb-2">Applicant Not Found</h2>
				<Button onClick={handleGoBack} variant="outline">
					Go Back
				</Button>
			</div>
		);
	}

	// Format location for display
	const locationLabel =
		applicantData.addressInfo.city && applicantData.addressInfo.country
			? `${applicantData.addressInfo.city}/${applicantData.addressInfo.country}`
			: undefined;

	return (
		<div>
			{/* Header with back button - only show for admin view */}
			{userType === "admin" && (
				<div className="flex items-center mb-4">
					<Button variant="ghost" onClick={handleGoBack} size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
				</div>
			)}

			{/* Main content */}
			<SectionLayout
				title={userType === "admin" ? "Applicant Profile" : "User Profile"}
			>
				{/* Personal Information Section */}
				<PersonalInfoSection
					personalInfo={applicantData.personalInfo}
					avatarSrc={applicantData.avatarSrc}
					userType={userType}
					onSave={handlePersonalInfoUpdate}
					onAvatarChange={handleAvatarChange}
					locationLabel={locationLabel}
				/>

				<Separator className="my-6" />

				{/* Address Section */}
				<AddressSection
					addressInfo={applicantData.addressInfo}
					userType={userType}
					onSave={handleAddressUpdate}
				/>

				{/* Department - visible only in admin view */}
				{userType === "admin" && applicantData.department && (
					<>
						<Separator className="my-6" />
						<div className="flex justify-between p-2">
							<h3 className="text-xl font-bold">Department</h3>
							<span className="text-xl">{applicantData.department}</span>
						</div>
					</>
				)}

				<Separator className="my-6" />

				{/* Skills Section */}
				<SkillsSection
					technicalSkills={applicantData.skills.technical}
					softSkills={applicantData.skills.soft}
					languages={applicantData.languages}
					userType={userType}
					onSave={handleSkillsUpdate}
				/>

				<Separator className="my-6" />

				{/* Work & Education Section */}
				<WorkEducationSection
					educationList={applicantData.education}
					workList={applicantData.experience}
					userType={userType}
					onSave={handleWorkEducationUpdate}
				/>

				<Separator className="my-6" />

				{/* Documents Section */}
				<DocumentsSection
					uploadedCV={applicantData.documents.resume}
					uploadedSamples={applicantData.documents.samples}
					portfolioLinks={applicantData.portfolioLinks}
					userType={userType}
					onCVUpload={handleCVUpload}
					onSampleUpload={handleSamplesUpload}
					onCVRemove={handleCVRemove}
					onSampleRemove={handleSampleRemove}
					onLinksUpdate={handleLinksUpdate}
				/>
			</SectionLayout>
		</div>
	);
};

export default UnifiedProfileView;
