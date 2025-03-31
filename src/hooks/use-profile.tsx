import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ProfileInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	bio: string;
}

export interface AddressInfo {
	country: string;
	city: string;
	postalCode: string;
	address: string;
}

export interface Skill {
	id: string;
	name: string;
}

export interface LanguageProficiency {
	language: string;
	level: number; // 1-10 scale
}

export interface Education {
	id: string;
	institution: string;
	degree: string;
	program: string;
	startYear: string;
	endYear: string;
}

export interface WorkExperience {
	id: string;
	company: string;
	role: string;
	duration: string;
	responsibilities: string;
}

export interface Document {
	name: string;
	url: string;
}

export interface PortfolioLinks {
	portfolio?: string;
	github?: string;
	behance?: string;
	[key: string]: string | undefined;
}

// Complete profile data structure
export interface ProfileData {
	id: string;
	personalInfo: ProfileInfo;
	addressInfo: AddressInfo;
	department?: string;
	dateApplied?: string;
	status?: string;
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
	completionPercentage?: number;
}

interface UseProfileOptions {
	id?: string;
	userType: "applicant" | "admin";
}

/**
 * Custom hook for managing profile data and operations
 * Works for both applicant (self-view) and admin (viewing others) contexts
 */
export function useProfile({ id, userType }: UseProfileOptions) {
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	// Fetch profile data on initial load
	useEffect(() => {
		const fetchProfileData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// In a real app, endpoint would depend on context:
				// For admin: /api/applicants/{id}
				// For applicant: /api/me/profile
				// const endpoint = userType === 'admin' && id
				//   ? `/api/applicants/${id}`
				//   : '/api/me/profile';
				// const response = await fetch(endpoint);
				// const data = await response.json();

				// Simulate API delay for demonstration
				await new Promise((resolve) => setTimeout(resolve, 800));

				// Mock data for demonstration
				const mockData: ProfileData = {
					id: id || "current-user",
					personalInfo: {
						firstName: "John",
						lastName: "Doe",
						email: "johndoe01@gmail.com",
						phone: "+250 787 435 382",
						bio: "Full stack developer with experience in React and Node.js",
					},
					addressInfo: {
						country: "Rwanda",
						city: "Kigali",
						postalCode: "00000",
						address: "KN 21 Ave",
					},
					department: userType === "admin" ? "Marketing" : undefined,
					dateApplied: userType === "admin" ? "12/06/2025" : undefined,
					status: userType === "admin" ? "success" : undefined,
					skills: {
						technical: [
							{ id: "1", name: "React" },
							{ id: "2", name: "TypeScript" },
							{ id: "3", name: "Node.js" },
							{ id: "4", name: "NextJS" },
						],
						soft: [
							{ id: "1", name: "Communication" },
							{ id: "2", name: "Team Work" },
							{ id: "3", name: "Problem Solving" },
						],
					},
					languages: [
						{ language: "English", level: 8 },
						{ language: "French", level: 5 },
						{ language: "Kinyarwanda", level: 10 },
					],
					education: [
						{
							id: "1",
							institution: "UR- Nyarugenge",
							degree: "Bachelor Degree",
							program: "Software Engineering",
							startYear: "2016",
							endYear: "2021",
						},
					],
					experience: [
						{
							id: "1",
							company: "Tesla",
							role: "Web Developer",
							duration: "2 years",
							responsibilities: "Website Development",
						},
					],
					documents: {
						resume: null,
						samples: [],
					},
					portfolioLinks: {
						portfolio: "",
						github: "https://github.com/yourusername",
						behance: "https://behance.net/yourprofile",
					},
					avatarSrc: "/images/avatar.jpg",
					completionPercentage: 75,
				};

				setProfileData(mockData);
			} catch (err) {
				console.error("Error fetching profile data:", err);
				setError("Failed to load profile data");
				toast({
					title: "Error",
					description: "Failed to load profile data",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfileData();
	}, [toast, userType, id]);

	/**
	 * Update profile data - handles both partial and full updates
	 */
	const updateProfile = useCallback(
		async (updates: Partial<ProfileData>) => {
			if (!profileData) return;

			try {
				// In a real app, this would make an API call:
				// await fetch('/api/profile', {
				//   method: 'PATCH',
				//   headers: { 'Content-Type': 'application/json' },
				//   body: JSON.stringify(updates)
				// });

				// Optimistic update
				setProfileData((prevData) => {
					if (!prevData) return null;
					return { ...prevData, ...updates };
				});

				// Show success message
				toast({
					title: "Profile Updated",
					description: "Your profile has been updated successfully",
				});

				return true;
			} catch (err) {
				console.error("Error updating profile:", err);
				toast({
					title: "Update Failed",
					description: "Could not update your profile. Please try again.",
					variant: "destructive",
				});
				return false;
			}
		},
		[profileData, toast],
	);

	/**
	 * Update personal information
	 */
	const updatePersonalInfo = useCallback(
		(personalInfo: ProfileInfo) => {
			return updateProfile({ personalInfo });
		},
		[updateProfile],
	);

	/**
	 * Update address information
	 */
	const updateAddress = useCallback(
		(addressInfo: AddressInfo) => {
			return updateProfile({ addressInfo });
		},
		[updateProfile],
	);

	/**
	 * Update skills and languages
	 */
	const updateSkills = useCallback(
		(data: {
			technical: Skill[];
			soft: Skill[];
			languages: LanguageProficiency[];
		}) => {
			return updateProfile({
				skills: {
					technical: data.technical,
					soft: data.soft,
				},
				languages: data.languages,
			});
		},
		[updateProfile],
	);

	/**
	 * Update education and work experience
	 */
	const updateWorkEducation = useCallback(
		(data: {
			education: Education[];
			experience: WorkExperience[];
		}) => {
			return updateProfile({
				education: data.education,
				experience: data.experience,
			});
		},
		[updateProfile],
	);

	/**
	 * Upload a file (avatar, resume, sample)
	 */
	const uploadFile = useCallback(
		async (fileType: "avatar" | "resume" | "sample", file: File) => {
			if (!profileData) return false;

			try {
				// In a real app, this would create a FormData and upload the file:
				// const formData = new FormData();
				// formData.append('file', file);
				// const response = await fetch(`/api/profile/upload/${fileType}`, {
				//   method: 'POST',
				//   body: formData
				// });
				// const data = await response.json();

				if (fileType === "avatar") {
					// Create a temporary URL to preview the image
					const reader = new FileReader();
					reader.onload = (e) => {
						if (e.target?.result) {
							updateProfile({ avatarSrc: e.target.result as string });
						}
					};
					reader.readAsDataURL(file);
				} else if (fileType === "resume" && profileData) {
					// Mock file upload response
					const fakeDocument = {
						name: file.name,
						url: URL.createObjectURL(file), // This would be a real URL in production
					};

					updateProfile({
						documents: {
							...profileData.documents,
							resume: fakeDocument,
						},
					});
				} else if (fileType === "sample" && profileData) {
					// Mock file upload response
					const fakeDocument = {
						name: file.name,
						url: URL.createObjectURL(file), // This would be a real URL in production
					};

					updateProfile({
						documents: {
							...profileData.documents,
							samples: [...profileData.documents.samples, fakeDocument],
						},
					});
				}

				toast({
					title: "File Uploaded",
					description: `Your ${fileType} has been uploaded successfully`,
				});
				return true;
			} catch (err) {
				console.error(`Error uploading ${fileType}:`, err);
				toast({
					title: "Upload Failed",
					description: `Could not upload your ${fileType}. Please try again.`,
					variant: "destructive",
				});
				return false;
			}
		},
		[profileData, toast, updateProfile],
	);

	/**
	 * Remove a document (resume or sample)
	 */
	const removeDocument = useCallback(
		(type: "resume" | "sample", index?: number) => {
			if (!profileData) return false;

			try {
				if (type === "resume") {
					updateProfile({
						documents: {
							...profileData.documents,
							resume: null,
						},
					});
				} else if (type === "sample" && typeof index === "number") {
					const newSamples = [...profileData.documents.samples];
					newSamples.splice(index, 1);

					updateProfile({
						documents: {
							...profileData.documents,
							samples: newSamples,
						},
					});
				}
				return true;
			} catch (err) {
				console.error(`Error removing ${type}:`, err);
				return false;
			}
		},
		[profileData, updateProfile],
	);

	/**
	 * Update portfolio links
	 */
	const updatePortfolioLinks = useCallback(
		(links: PortfolioLinks) => {
			return updateProfile({ portfolioLinks: links });
		},
		[updateProfile],
	);

	return {
		profileData,
		isLoading,
		error,
		updateProfile,
		updatePersonalInfo,
		updateAddress,
		updateSkills,
		updateWorkEducation,
		uploadFile,
		removeDocument,
		updatePortfolioLinks,
		canEdit: userType === "applicant", // Only applicants can edit their own profiles
	};
}
