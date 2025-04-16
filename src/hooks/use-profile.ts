import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/services/api";

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

export interface PasswordUpdateData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface UseProfileOptions {
	id?: string;
	userType: "applicant" | "admin";
}

export function useProfile(options: UseProfileOptions) {
	const { id, userType } = options;
	const [profileData, setProfileData] = useState<ApplicantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const canEdit = userType === "applicant" || !id;

	const updateProfile = useMutation({
		mutationFn: async (data: Partial<ApplicantData>) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Profile updated successfully!");
		},
		onError: (error) => {
			toast.error(`Failed to update profile: ${error}. Please try again!`);
		},
	});

	const updatePassword = useMutation({
		mutationFn: async (data: PasswordUpdateData) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Password updated successfully!");
		},
		onError: (error) => {
			toast.error(`Failed to update password: ${error}. Please try again!`);
		},
	});

	useEffect(() => {
		const fetchProfileData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				await new Promise((resolve) => setTimeout(resolve, 500));

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
							degree: "Bachelor's Degree",
							program: "Software Engineering",
							startYear: "Sep 2016",
							endYear: "Jul 2021",
						},
						{
							id: "2",
							institution: "College Saint Andre",
							degree: "High School",
							program: "Mathematic Physics & Computer Science",
							startYear: "Jan 2012",
							endYear: "Dec 2015",
						},
					],
					experience: [
						{
							id: "1",
							company: "Tesla",
							role: "Web Developer",
							duration: "Jun 2021 - Present (3 yrs 4 mos)",
							responsibilities: "Full-time",
						},
						{
							id: "2",
							company: "Microsoft",
							role: "Frontend Developer Intern",
							duration: "Jan 2021 - May 2021 (5 mos)",
							responsibilities: "Internship",
						},
						{
							id: "3",
							company: "Local Tech Startup",
							role: "Junior Developer",
							duration: "May 2020 - Dec 2020 (8 mos)",
							responsibilities: "Part-time",
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
				toast.error("Failed to load profile data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfileData();
	}, [id]);

	const updatePersonalInfo = useCallback(
		async (info: ProfileInfo) => {
			if (!profileData) return;

			try {
				setProfileData((prev) =>
					prev
						? {
								...prev,
								personalInfo: info,
								name: `${info.firstName} ${info.lastName}`,
							}
						: null,
				);

				toast.success("Personal information updated");
			} catch (err) {
				console.error("Error updating personal info:", err);
				toast.error("Failed to update personal information");
			}
		},
		[profileData],
	);

	const updateAddress = useCallback(
		async (info: AddressInfo) => {
			if (!profileData) return;

			try {
				setProfileData((prev) =>
					prev ? { ...prev, addressInfo: info } : null,
				);

				toast.success("Address information updated");
			} catch (err) {
				console.error("Error updating address:", err);
				toast.error("Failed to update address information");
			}
		},
		[profileData],
	);

	const updateSkills = useCallback(
		async (data: {
			technical: Skill[];
			soft: Skill[];
			languages: LanguageProficiency[];
			department?: string;
		}) => {
			if (!profileData) return;

			try {
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

				toast.success("Skills and languages updated");
			} catch (err) {
				console.error("Error updating skills:", err);
				toast.error("Failed to update skills and languages");
			}
		},
		[profileData],
	);

	const updateWorkEducation = useCallback(
		async (data: {
			education: Education[];
			experience: WorkExperience[];
		}) => {
			if (!profileData) return;

			try {
				setProfileData((prev) =>
					prev
						? {
								...prev,
								education: data.education,
								experience: data.experience,
							}
						: null,
				);

				toast.success("Work and education information updated");
			} catch (err) {
				console.error("Error updating work/education:", err);
				toast.error("Failed to update work and education information");
			}
		},
		[profileData],
	);

	const uploadFile = useCallback(
		async (type: "avatar" | "resume" | "sample", file: File) => {
			if (!profileData) return;

			try {
				const uploadedUrl = URL.createObjectURL(file);

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

				toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
			} catch (err) {
				console.error(`Error uploading ${type}:`, err);
				toast.error(`Failed to upload ${type}`);
			}
		},
		[profileData],
	);

	const removeDocument = useCallback(
		async (type: "resume" | "sample", index?: number) => {
			if (!profileData) return;

			try {
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

				toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`);
			} catch (err) {
				console.error(`Error removing ${type}:`, err);
				toast.error(`Failed to remove ${type}`);
			}
		},
		[profileData],
	);

	const updatePortfolioLinks = useCallback(
		async (links: PortfolioLinks) => {
			if (!profileData) return;

			try {
				setProfileData((prev) =>
					prev ? { ...prev, portfolioLinks: links } : null,
				);

				toast.success("Portfolio links updated");
			} catch (err) {
				console.error("Error updating links:", err);
				toast.error("Failed to update portfolio links");
			}
		},
		[profileData],
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
		updateProfile,
		updatePassword,
	};
}
