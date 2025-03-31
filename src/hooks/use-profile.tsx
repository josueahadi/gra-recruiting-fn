import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// Types for profile data
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
	linkedin?: string;
}

export interface ApplicantData {
	id: string;
	name: string;
	personalInfo: ProfileInfo;
	addressInfo: AddressInfo;
	department?: string;
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

interface UseProfileOptions {
	id?: string;
	userType: "applicant" | "admin";
}

/**
 * Custom hook for managing profile data across the application
 */
export function useProfile(options: UseProfileOptions) {
	const { id, userType } = options;
	const [profileData, setProfileData] = useState<ApplicantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	// Determine if current user can edit this profile
	const canEdit = userType === "applicant" || !id;

	// Fetch profile data on initial load
	useEffect(() => {
		const fetchProfileData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// In a real app, this would be an API call
				// const response = await fetch(`/api/profile${id ? `/${id}` : ''}`);
				// const data = await response.json();

				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Mock data for demonstration
				const mockData: ApplicantData = {
					id: id || "current-user",
					name: "John Doe",
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
					department: "Software Development",
					skills: {
						technical: [
							{ id: "1", name: "Software Engineering" },
							{ id: "2", name: "Frontend Development" },
							{ id: "3", name: "Backend Development" },
							{ id: "4", name: "Data Analysis" },
							{ id: "5", name: "Database" },
							{ id: "6", name: "MySQL" },
							{ id: "7", name: "AI" },
							{ id: "8", name: "Machine Learning" },
						],
						soft: [
							{ id: "1", name: "Communication" },
							{ id: "2", name: "Team Work" },
							{ id: "3", name: "Problem Solving" },
						],
					},
					languages: [
						{ language: "Kinyarwanda", level: 10 },
						{ language: "French", level: 5 },
						{ language: "English", level: 6 },
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
	}, [id, toast]);

	/**
	 * Update personal information
	 */
	const updatePersonalInfo = useCallback(
		async (info: ProfileInfo) => {
			if (!profileData) return;

			try {
				// In a real app, this would be an API call
				// await fetch(`/api/profile/personal`, { method: 'PUT', body: JSON.stringify(info) });

				// Optimistic update
				setProfileData((prev) =>
					prev
						? {
								...prev,
								personalInfo: info,
								name: `${info.firstName} ${info.lastName}`,
							}
						: null,
				);

				toast({
					title: "Success",
					description: "Personal information updated",
				});
			} catch (err) {
				console.error("Error updating personal info:", err);
				toast({
					title: "Error",
					description: "Failed to update personal information",
					variant: "destructive",
				});
			}
		},
		[profileData, toast],
	);

	/**
	 * Update address information
	 */
	const updateAddress = useCallback(
		async (info: AddressInfo) => {
			if (!profileData) return;

			try {
				// In a real app, this would be an API call
				// await fetch(`/api/profile/address`, { method: 'PUT', body: JSON.stringify(info) });

				// Optimistic update
				setProfileData((prev) =>
					prev ? { ...prev, addressInfo: info } : null,
				);

				toast({
					title: "Success",
					description: "Address information updated",
				});
			} catch (err) {
				console.error("Error updating address:", err);
				toast({
					title: "Error",
					description: "Failed to update address information",
					variant: "destructive",
				});
			}
		},
		[profileData, toast],
	);

	/**
	 * Update skills and languages
	 */
	const updateSkills = useCallback(
		async (data: {
			technical: Skill[];
			soft: Skill[];
			languages: LanguageProficiency[];
			department?: string;
		}) => {
			if (!profileData) return;

			try {
				// In a real app, this would be an API call
				// await fetch(`/api/profile/skills`, { method: 'PUT', body: JSON.stringify(data) });

				// Optimistic update
				setProfileData((prev) =>
					prev
						? {
								...prev,
								skills: {
									technical: data.technical,
									soft: data.soft,
								},
								languages: data.languages,
								department: data.department,
							}
						: null,
				);

				toast({
					title: "Success",
					description: "Skills and languages updated",
				});
			} catch (err) {
				console.error("Error updating skills:", err);
				toast({
					title: "Error",
					description: "Failed to update skills and languages",
					variant: "destructive",
				});
			}
		},
		[profileData, toast],
	);

	/**
	 * Update work and education information
	 */
	const updateWorkEducation = useCallback(
		async (data: {
			education: Education[];
			experience: WorkExperience[];
		}) => {
			if (!profileData) return;

			try {
				// In a real app, this would be an API call
				// await fetch(`/api/profile/background`, { method: 'PUT', body: JSON.stringify(data) });

				// Optimistic update
				setProfileData((prev) =>
					prev
						? {
								...prev,
								education: data.education,
								experience: data.experience,
							}
						: null,
				);

				toast({
					title: "Success",
					description: "Work and education information updated",
				});
			} catch (err) {
				console.error("Error updating work/education:", err);
				toast({
					title: "Error",
					description: "Failed to update work and education information",
					variant: "destructive",
				});
			}
		},
		[profileData, toast],
	);

	/**
	 * Upload a file (avatar, resume, or sample document)
	 */
	const uploadFile = useCallback(
		async (type: "avatar" | "resume" | "sample", file: File) => {
			if (!profileData) return;

			try {
				// In a real app, this would be an API call with FormData
				// const formData = new FormData();
				// formData.append('file', file);
				// await fetch(`/api/profile/upload/${type}`, { method: 'POST', body: formData });

				// Simulate upload response
				const uploadedUrl = URL.createObjectURL(file);

				// Optimistic update based on file type
				if (type === "avatar") {
					setProfileData((prev) =>
						prev ? { ...prev, avatarSrc: uploadedUrl } : null,
					);
				} else if (type === "resume") {
					setProfileData((prev) =>
						prev
							? {
									...prev,
									documents: {
										...prev.documents,
										resume: { name: file.name, url: uploadedUrl },
									},
								}
							: null,
					);
				} else if (type === "sample") {
					setProfileData((prev) =>
						prev
							? {
									...prev,
									documents: {
										...prev.documents,
										samples: [
											...prev.documents.samples,
											{ name: file.name, url: uploadedUrl },
										],
									},
								}
							: null,
					);
				}

				toast({
					title: "Success",
					description: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`,
				});
			} catch (err) {
				console.error(`Error uploading ${type}:`, err);
				toast({
					title: "Error",
					description: `Failed to upload ${type}`,
					variant: "destructive",
				});
			}
		},
		[profileData, toast],
	);

	/**
	 * Remove a document (resume or sample)
	 */
	const removeDocument = useCallback(
		async (type: "resume" | "sample", index?: number) => {
			if (!profileData) return;

			try {
				// In a real app, this would be an API call
				// await fetch(`/api/profile/document/${type}${index !== undefined ? `/${index}` : ''}`, { method: 'DELETE' });

				// Optimistic update
				if (type === "resume") {
					setProfileData((prev) =>
						prev
							? {
									...prev,
									documents: {
										...prev.documents,
										resume: null,
									},
								}
							: null,
					);
				} else if (type === "sample" && index !== undefined) {
					setProfileData((prev) =>
						prev
							? {
									...prev,
									documents: {
										...prev.documents,
										samples: prev.documents.samples.filter(
											(_, i) => i !== index,
										),
									},
								}
							: null,
					);
				}

				toast({
					title: "Success",
					description: `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`,
				});
			} catch (err) {
				console.error(`Error removing ${type}:`, err);
				toast({
					title: "Error",
					description: `Failed to remove ${type}`,
					variant: "destructive",
				});
			}
		},
		[profileData, toast],
	);

	/**
	 * Update portfolio links
	 */
	const updatePortfolioLinks = useCallback(
		async (links: PortfolioLinks) => {
			if (!profileData) return;

			try {
				// In a real app, this would be an API call
				// await fetch(`/api/profile/links`, { method: 'PUT', body: JSON.stringify(links) });

				// Optimistic update
				setProfileData((prev) =>
					prev ? { ...prev, portfolioLinks: links } : null,
				);

				toast({
					title: "Success",
					description: "Portfolio links updated",
				});
			} catch (err) {
				console.error("Error updating links:", err);
				toast({
					title: "Error",
					description: "Failed to update portfolio links",
					variant: "destructive",
				});
			}
		},
		[profileData, toast],
	);

	return {
		profileData,
		isLoading,
		error,
		canEdit,
		updatePersonalInfo,
		updateAddress,
		updateSkills,
		updateWorkEducation,
		uploadFile,
		removeDocument,
		updatePortfolioLinks,
	};
}
