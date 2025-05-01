import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/services/api";
import { formatDateRange, formatDateString } from "@/lib/utils/date-utils";
import { useOptimisticUpdate } from "@/hooks/use-optimistic-update";
import { ApiQueueManager } from "@/lib/utils/api-queue-utils";
import { showToast } from "@/services/toast";

export interface ProfileInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
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
	languageId?: number;
	tempId?: string;
	language: string;
	level: number;
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
	country?: string;
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

const LANGUAGE_LEVEL_MAP: Record<number, string> = {
	1: "BEGINNER",
	5: "INTERMEDIATE",
	7: "FLUENT",
	9: "NATIVE",
};

const REVERSE_LANGUAGE_LEVEL_MAP: Record<string, number> = {
	BEGINNER: 1,
	INTERMEDIATE: 5,
	FLUENT: 7,
	NATIVE: 9,
};

const EDUCATION_LEVEL_MAP: Record<string, string> = {
	"High School": "HIGH_SCHOOL",
	"Associate Degree": "ASSOCIATE",
	"Bachelor's Degree": "BACHELOR",
	"Master's Degree": "MASTER",
	Doctorate: "DOCTORATE",
	Other: "OTHER",
};

const REVERSE_EDUCATION_LEVEL_MAP: Record<string, string> = {
	HIGH_SCHOOL: "High School",
	ASSOCIATE: "Associate Degree",
	BACHELOR: "Bachelor's Degree",
	MASTER: "Master's Degree",
	DOCTORATE: "Doctorate",
	OTHER: "Other",
};

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
	"Full-time": "FULL_TIME",
	"Part-time": "PART_TIME",
	Contract: "CONTRACT",
	Internship: "INTERNSHIP",
	Freelance: "FREELANCE",
};

const REVERSE_EMPLOYMENT_TYPE_MAP: Record<string, string> = {
	FULL_TIME: "Full-time",
	PART_TIME: "Part-time",
	CONTRACT: "Contract",
	INTERNSHIP: "Internship",
	FREELANCE: "Freelance",
};

export function useProfile(options: UseProfileOptions) {
	const { id, userType } = options;
	const queryClient = useQueryClient();
	const canEdit = userType === "applicant" || !id;

	const {
		state: profileData,
		setState: setProfileData,
		isUpdating,
		updateError,
		update,
		clearError,
	} = useOptimisticUpdate<ApplicantData | null>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const pendingOperationsRef = useRef(0);
	const languageApiQueue = new ApiQueueManager({ delayBetweenRequests: 500 });

	const basicProfileQuery = useQuery({
		queryKey: ["user-profile", id],
		queryFn: async () => {
			try {
				const { data } = await api.get("/api/v1/users/view-profile");
				return data;
			} catch (error) {
				console.error("Error fetching user profile:", error);
				throw new Error("Failed to load profile data");
			}
		},
		enabled: !id, // Only fetch for current user if no id is provided
	});

	const detailedProfileQuery = useQuery({
		queryKey: ["application-profile", id],
		queryFn: async () => {
			try {
				const { data } = await api.get(
					"/api/v1/applicants/get-application-profile",
				);
				return data;
			} catch (error) {
				console.error("Error fetching application profile:", error);
				throw new Error("Failed to load detailed profile data");
			}
		},
		enabled: !!basicProfileQuery.data,
	});

	useEffect(() => {
		const fetchAndTransformData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				if (basicProfileQuery.data && detailedProfileQuery.data) {
					const basicProfile = basicProfileQuery.data;
					const detailedProfile = detailedProfileQuery.data;

					const transformed: ApplicantData = {
						id: basicProfile.id.toString(),
						name: `${basicProfile.firstName} ${basicProfile.lastName}`,
						personalInfo: {
							firstName: basicProfile.firstName || "",
							lastName: basicProfile.lastName || "",
							email: basicProfile.email || "",
							phone: basicProfile.phoneNumber || "",
						},
						addressInfo: {
							country: basicProfile.country || "",
							city: basicProfile.city || "",
							postalCode: basicProfile.postalCode || "",
							address: basicProfile.street || "",
						},
						department: basicProfile.careerName || undefined,
						skills: {
							technical: Array.isArray(
								detailedProfile.skillsAndExperienceRatings,
							)
								? detailedProfile.skillsAndExperienceRatings.map((skill) => ({
										id: String(skill.skillId || Date.now()),
										name: skill.skillName,
									}))
								: [],
							soft: [],
						},

						languages: Array.isArray(detailedProfile.languagesProficiency)
							? detailedProfile.languagesProficiency.map((lang) => ({
									languageId: lang.languageId,
									language: lang.languageName,
									level: REVERSE_LANGUAGE_LEVEL_MAP[lang.proficiencyLevel] || 5,
								}))
							: [],

						education: Array.isArray(detailedProfile.educations)
							? detailedProfile.educations.map((edu) => ({
									id: String(edu.id || Date.now()),
									institution: edu.institutionName,
									degree:
										REVERSE_EDUCATION_LEVEL_MAP[edu.educationLevel] ||
										edu.educationLevel,
									program: edu.program,
									startYear: formatDateString(edu.dateJoined),
									endYear: formatDateString(edu.dateGraduated),
								}))
							: [],

						experience: Array.isArray(detailedProfile.experiences)
							? detailedProfile.experiences.map((exp) => {
									const startDate = formatDateString(exp.startDate);
									const endDate = exp.endDate
										? formatDateString(exp.endDate)
										: "Present";
									const duration = formatDateRange(startDate, endDate);

									return {
										id: String(exp.id || Date.now()),
										company: exp.companyName,
										role: exp.jobTitle,
										duration: duration,
										responsibilities:
											REVERSE_EMPLOYMENT_TYPE_MAP[exp.employmentType] ||
											exp.employmentType,
										country: exp.country,
									};
								})
							: [],

						documents: {
							resume:
								Array.isArray(detailedProfile.documents) &&
								detailedProfile.documents.length > 0 &&
								detailedProfile.documents[0]?.resumeUrl
									? {
											name: "Resume",
											url: detailedProfile.documents[0].resumeUrl,
										}
									: null,
							samples: [],
						},

						portfolioLinks: {
							portfolio:
								Array.isArray(detailedProfile.documents) &&
								detailedProfile.documents.length > 0
									? detailedProfile.documents[0]?.portfolioUrl || ""
									: "",
							github:
								Array.isArray(detailedProfile.documents) &&
								detailedProfile.documents.length > 0
									? detailedProfile.documents[0]?.githubProfileUrl || ""
									: "",
							behance:
								Array.isArray(detailedProfile.documents) &&
								detailedProfile.documents.length > 0
									? detailedProfile.documents[0]?.behanceProfileUrl || ""
									: "",
							linkedin:
								Array.isArray(detailedProfile.documents) &&
								detailedProfile.documents.length > 0
									? detailedProfile.documents[0]?.linkedinProfileUrl || ""
									: "",
						},
						avatarSrc: "/images/avatar.jpg", // Placeholder (API doesn't provide avatar)
					};

					setProfileData(transformed);
				} else if (id) {
					// For admin viewing a specific user, (simulating with mock data for now)
					await new Promise((resolve) => setTimeout(resolve, 500));

					const mockData: ApplicantData = {
						id: id,
						name: "John Doe",
						personalInfo: {
							firstName: "John",
							lastName: "Doe",
							email: "johndoe01@gmail.com",
							phone: "+250 787 435 382",
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
							],
							soft: [],
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
						],
						experience: [
							{
								id: "1",
								company: "Tesla",
								role: "Web Developer",
								duration: "Jun 2021 - Present (3 yrs 4 mos)",
								responsibilities: "Full-time",
								country: "USA",
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
							linkedin: "https://linkedin.com/in/yourprofile",
						},
						avatarSrc: "/images/avatar.jpg",
					};

					setProfileData(mockData);
				}
			} catch (err) {
				console.error("Error transforming profile data:", err);
				setError("Failed to load profile data");

				if (basicProfileQuery.data) {
					const basicProfile = basicProfileQuery.data;

					const fallbackData: ApplicantData = {
						id: basicProfile.id.toString(),
						name: `${basicProfile.firstName} ${basicProfile.lastName}`,
						personalInfo: {
							firstName: basicProfile.firstName || "",
							lastName: basicProfile.lastName || "",
							email: basicProfile.email || "",
							phone: basicProfile.phoneNumber || "",
						},
						addressInfo: {
							country: basicProfile.country || "",
							city: basicProfile.city || "",
							postalCode: basicProfile.postalCode || "",
							address: basicProfile.street || "",
						},
						department: basicProfile.careerName || undefined,
						skills: { technical: [], soft: [] },
						languages: [],
						education: [],
						experience: [],
						documents: { resume: null, samples: [] },
						portfolioLinks: {
							portfolio: "",
							github: "",
							behance: "",
							linkedin: "",
						},
						avatarSrc: "/images/avatar.jpg",
					};

					setProfileData(fallbackData);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchAndTransformData();
	}, [basicProfileQuery.data, detailedProfileQuery.data, id, setProfileData]);

	useEffect(() => {
		if (!profileData) return;

		const calculateCompletion = () => {
			let completed = 0;
			let total = 0;

			if (profileData.personalInfo) {
				total += 5; // 5 fields
				if (profileData.personalInfo.firstName) completed++;
				if (profileData.personalInfo.lastName) completed++;
				if (profileData.personalInfo.email) completed++;
				if (profileData.personalInfo.phone) completed++;
			}

			if (profileData.addressInfo) {
				total += 4; // 4 fields
				if (profileData.addressInfo.country) completed++;
				if (profileData.addressInfo.city) completed++;
				if (profileData.addressInfo.postalCode) completed++;
				if (profileData.addressInfo.address) completed++;
			}

			if (profileData.skills) {
				total += 2; // Technical and soft skills
				if (profileData.skills.technical.length > 0) completed++;
				if (profileData.skills.soft.length > 0) completed++;
			}

			if (profileData.languages) {
				total += 1;
				if (profileData.languages.length > 0) completed++;
			}

			if (profileData.education) {
				total += 1;
				if (profileData.education.length > 0) completed++;
			}

			if (profileData.experience) {
				total += 1;
				if (profileData.experience.length > 0) completed++;
			}

			if (profileData.documents) {
				total += 2;
				if (profileData.documents.resume) completed++;
				if (
					profileData.portfolioLinks &&
					(profileData.portfolioLinks.github ||
						profileData.portfolioLinks.portfolio ||
						profileData.portfolioLinks.behance)
				) {
					completed++;
				}
			}

			return Math.round((completed / total) * 100);
		};

		const completion = calculateCompletion();
		localStorage.setItem("profileCompletion", String(completion));

		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.set("completion", String(completion));
			window.history.replaceState({}, "", url.toString());
		}
	}, [profileData]);

	const updatePersonalInfo = useCallback(
		async (info: ProfileInfo) => {
			if (!profileData) return false;

			return update(
				(currentData) => {
					if (!currentData) return null;
					return {
						...currentData,
						personalInfo: info,
						name: `${info.firstName} ${info.lastName}`,
					};
				},
				async (newData) => {
					if (!newData) throw new Error("No profile data available");

					await api.patch("/api/v1/users/update-user-profile", {
						firstName: info.firstName,
						lastName: info.lastName,
						phoneNumber: info.phone,
					});

					queryClient.invalidateQueries({ queryKey: ["user-profile"] });

					toast.success("Personal information updated");
					return true;
				},
			).catch((err) => {
				console.error("Error updating personal info:", err);
				toast.error("Failed to update personal information");
				return false;
			});
		},
		[profileData, update, queryClient],
	);

	const updateAddress = useCallback(
		async (info: AddressInfo) => {
			if (!profileData) return false;

			return update(
				(currentData) => {
					if (!currentData) return null;
					return {
						...currentData,
						addressInfo: info,
					};
				},
				async (newData) => {
					if (!newData) throw new Error("No profile data available");

					await api.patch("/api/v1/users/update-user-profile", {
						country: info.country,
						city: info.city,
						postalCode: info.postalCode,
						street: info.address,
					});

					queryClient.invalidateQueries({ queryKey: ["user-profile"] });

					toast.success("Address information updated");
					return true;
				},
			).catch((err) => {
				console.error("Error updating address:", err);
				toast.error("Failed to update address information");
				return false;
			});
		},
		[profileData, update, queryClient],
	);

	const updateSkills = useCallback(
		async (data: {
			technical: Skill[];
			soft: Skill[];
			languages: LanguageProficiency[];
			department?: string;
		}) => {
			if (!profileData) return false;

			pendingOperationsRef.current += 1;

			try {
				// Optimistic update
				setProfileData((prevData) => {
					if (!prevData) return null;
					return {
						...prevData,
						skills: {
							technical: data.technical,
							soft: data.soft,
						},
						department: data.department,
					};
				});

				if (data.department !== profileData.department) {
					try {
						await api.patch("/api/v1/users/update-user-profile", {
							careerName: data.department,
						});
					} catch (error) {
						console.error("Error updating department:", error);
					}
				}

				if (data.technical.length > 0) {
					const skillsPayload = data.technical.map((skill) => ({
						skillName: skill.name,
						experienceRating: "FIVE", // Default rating
					}));

					// Use update or add based on whether we have skills already
					const hasSkills = profileData.skills.technical.length > 0;

					try {
						if (hasSkills) {
							await api.patch("/api/v1/applicants/update-skills", {
								skillsAndExperienceRatings: skillsPayload,
							});
						} else {
							await api.post("/api/v1/applicants/add-skills", {
								skillsAndExperienceRatings: skillsPayload,
							});
						}
					} catch (error) {
						console.error("Error updating skills:", error);
						throw error;
					}
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });
				queryClient.invalidateQueries({ queryKey: ["user-profile"] });

				return true;
			} catch (error) {
				console.error("Error updating skills:", error);

				setProfileData(profileData);

				toast.error("Failed to update skills");
				return false;
			} finally {
				pendingOperationsRef.current -= 1;
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const updateWorkEducation = useCallback(
		async (data: {
			education: Education[];
			experience: WorkExperience[];
		}) => {
			if (!profileData) return false;

			return update(
				(currentData) => {
					if (!currentData) return null;
					return {
						...currentData,
						education: data.education,
						experience: data.experience,
					};
				},
				async (newData) => {
					if (!newData) throw new Error("No profile data available");

					const existingEducation = profileData.education || [];

					for (const edu of data.education) {
						const existingEntry = existingEducation.find(
							(e) => e.id === edu.id,
						);

						if (!existingEntry) {
							await api.post("/api/v1/applicants/add-education", {
								institutionName: edu.institution,
								educationLevel: EDUCATION_LEVEL_MAP[edu.degree] || "BACHELOR",
								program: edu.program,
								dateJoined: convertUIDateToApiDate(edu.startYear),
								dateGraduated: convertUIDateToApiDate(
									edu.endYear === "Present"
										? new Date().toLocaleDateString()
										: edu.endYear,
								),
							});
						} else {
							if (edu.id) {
								const originalId = edu.id.includes("-edit-")
									? edu.id.split("-edit-")[0]
									: edu.id;

								const educationId = Number.isNaN(Number(originalId))
									? originalId
									: Number(originalId);

								await api.patch(
									`/api/v1/applicants/update-education/${educationId}`,
									{
										institutionName: edu.institution,
										educationLevel:
											EDUCATION_LEVEL_MAP[edu.degree] || "BACHELOR",
										program: edu.program,
										dateJoined: convertUIDateToApiDate(edu.startYear),
										dateGraduated: convertUIDateToApiDate(
											edu.endYear === "Present"
												? new Date().toLocaleDateString()
												: edu.endYear,
										),
									},
								);
							}
						}
					}

					const existingExperience = profileData.experience || [];

					for (const exp of data.experience) {
						const durationParts = exp.duration.split("-").map((p) => p.trim());
						const startDate = durationParts[0];
						const endDateWithParentheses = durationParts[1];
						const endDate =
							endDateWithParentheses.split("(")[0].trim() === "Present"
								? undefined
								: endDateWithParentheses.split("(")[0].trim();

						const existingEntry = existingExperience.find(
							(e) => e.id === exp.id,
						);

						if (!existingEntry) {
							await api.post("/api/v1/applicants/add-experience", {
								companyName: exp.company,
								jobTitle: exp.role,
								employmentType:
									EMPLOYMENT_TYPE_MAP[exp.responsibilities] || "FULL_TIME",
								country: exp.country || "Rwanda",
								startDate: convertUIDateToApiDate(startDate),
								endDate: endDate ? convertUIDateToApiDate(endDate) : undefined,
							});
						} else {
							const originalId = exp.id.includes("-edit-")
								? exp.id.split("-edit-")[0]
								: exp.id;

							await api.patch(
								`/api/v1/applicants/update-experience/${originalId}`,
								{
									companyName: exp.company,
									jobTitle: exp.role,
									employmentType:
										EMPLOYMENT_TYPE_MAP[exp.responsibilities] || "FULL_TIME",
									country: "Rwanda",
									startDate: convertUIDateToApiDate(startDate),
									endDate: endDate
										? convertUIDateToApiDate(endDate)
										: undefined,
								},
							);
						}
					}

					queryClient.invalidateQueries({ queryKey: ["application-profile"] });

					toast.success("Work and education information updated");
					return true;
				},
			).catch((err) => {
				console.error("Error updating work/education:", err);
				toast.error("Failed to update work and education information");
				return false;
			});
		},
		[profileData, update, queryClient],
	);

	const uploadFile = useCallback(
		async (type: "avatar" | "resume" | "sample", file: File) => {
			if (!profileData) return;

			return update(
				(currentData) => {
					if (!currentData) return null;

					if (type === "avatar") {
						return {
							...currentData,
							avatarSrc: URL.createObjectURL(file),
						};
					} else if (type === "resume") {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								resume: {
									name: file.name,
									url: URL.createObjectURL(file),
								},
							},
						};
					} else if (type === "sample") {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								samples: [
									...currentData.documents.samples,
									{ name: file.name, url: URL.createObjectURL(file) },
								],
							},
						};
					}

					return currentData;
				},
				async (newData) => {
					if (!newData) throw new Error("No profile data available");

					const formData = new FormData();
					formData.append("file", file);

					let uploadUrl = "";
					let responseData;

					if (type === "avatar") {
						const { data } = await api.post(
							"/api/v1/users/upload-profile-picture",
							formData,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							},
						);
						responseData = data;
						uploadUrl = data.fileUrl || URL.createObjectURL(file);
					} else if (type === "resume") {
						const { data } = await api.post(
							"/api/v1/users/upload-resume",
							formData,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							},
						);
						responseData = data;
						uploadUrl = data.fileUrl || URL.createObjectURL(file);
					} else if (type === "sample") {
						const { data } = await api.post(
							"/api/v1/users/upload-sample",
							formData,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							},
						);
						responseData = data;
						uploadUrl = data.fileUrl || URL.createObjectURL(file);
					}

					queryClient.invalidateQueries({ queryKey: ["application-profile"] });

					toast.success(`${file.name} uploaded successfully`);
					return responseData;
				},
			).catch((err) => {
				console.error("Error uploading file:", err);
				toast.error("Failed to upload file");
				return null;
			});
		},
		[profileData, update, queryClient],
	);

	const removeDocument = useCallback(
		async (type: "resume" | "sample", index?: number) => {
			if (!profileData) return false;

			return update(
				(currentData) => {
					if (!currentData) return null;

					if (type === "resume") {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								resume: null,
							},
						};
					} else if (type === "sample" && index !== undefined) {
						return {
							...currentData,
							documents: {
								...currentData.documents,
								samples: currentData.documents.samples.filter(
									(_, i) => i !== index,
								),
							},
						};
					}

					return currentData;
				},
				async (newData) => {
					if (!newData) throw new Error("No profile data available");

					if (type === "resume") {
						await api.delete("/api/v1/applicants/delete-resume");
					} else if (type === "sample" && index !== undefined) {
						console.log("Delete sample at index", index);
					}

					queryClient.invalidateQueries({ queryKey: ["application-profile"] });

					toast.success(
						`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`,
					);
					return true;
				},
			).catch((err) => {
				console.error(`Error removing ${type}:`, err);
				toast.error(`Failed to remove ${type}`);
				return false;
			});
		},
		[profileData, update, queryClient],
	);

	const updatePortfolioLinks = useCallback(
		async (links: PortfolioLinks) => {
			if (!profileData) return false;

			return update(
				(currentData) => {
					if (!currentData) return null;
					return {
						...currentData,
						portfolioLinks: links,
					};
				},
				async (newData) => {
					if (!newData) throw new Error("No profile data available");

					const documentsPayload = {
						linkedinProfileUrl: links.linkedin || "",
						githubProfileUrl: links.github || "",
						resumeUrl: profileData.documents.resume?.url || "",
						behanceProfileUrl: links.behance || "",
						portfolioUrl: links.portfolio || "",
					};

					await api.patch(
						"/api/v1/applicants/update-applicantion-documents",
						documentsPayload,
					);

					queryClient.invalidateQueries({ queryKey: ["application-profile"] });

					toast.success("Portfolio links updated");
					return true;
				},
			).catch((err) => {
				console.error("Error updating portfolio links:", err);
				toast.error("Failed to update portfolio links");
				return false;
			});
		},
		[profileData, update, queryClient],
	);

	const convertUIDateToApiDate = (uiDate: string): string => {
		try {
			// If it's just a year (e.g., "2021")
			if (/^\d{4}$/.test(uiDate)) {
				return `${uiDate}-01-01`;
			}

			// If it's in "Month Year" format (e.g., "Jun 2021")
			const monthYearMatch = uiDate.match(/^([A-Za-z]{3}) (\d{4})$/);
			if (monthYearMatch) {
				const monthMap: Record<string, string> = {
					Jan: "01",
					Feb: "02",
					Mar: "03",
					Apr: "04",
					May: "05",
					Jun: "06",
					Jul: "07",
					Aug: "08",
					Sep: "09",
					Oct: "10",
					Nov: "11",
					Dec: "12",
				};

				const month = monthMap[monthYearMatch[1]];
				const year = monthYearMatch[2];

				return `${year}-${month}-01`;
			}

			// If it's already in ISO format or another parseable format
			const date = new Date(uiDate);
			if (!Number.isNaN(date.getTime())) {
				return date.toISOString().split("T")[0];
			}

			// If all parsing attempts fail, return original
			return uiDate;
		} catch (e) {
			console.error(`Error converting date: ${uiDate}`, e);
			return uiDate;
		}
	};

	const updatePassword = useMutation({
		mutationFn: async (data: PasswordUpdateData) => {
			return api.patch("/api/v1/users/update-user-profile", {
				oldPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
		},
		onSuccess: () => {
			toast.success("Password updated successfully!");
		},
		onError: (error: unknown) => {
			const apiError = error as { response?: { data?: { message?: string } } };
			const errorMessage =
				apiError.response?.data?.message || "Failed to update password";
			toast.error(`${errorMessage}. Please try again!`);
		},
	});

	const getProfileCompletion = useCallback(() => {
		if (!profileData) return 0;

		let completed = 0;
		let total = 0;

		if (profileData.personalInfo) {
			total += 5; // 5 fields
			if (profileData.personalInfo.firstName) completed++;
			if (profileData.personalInfo.lastName) completed++;
			if (profileData.personalInfo.email) completed++;
			if (profileData.personalInfo.phone) completed++;
		}

		if (profileData.addressInfo) {
			total += 4; // 4 fields
			if (profileData.addressInfo.country) completed++;
			if (profileData.addressInfo.city) completed++;
			if (profileData.addressInfo.postalCode) completed++;
			if (profileData.addressInfo.address) completed++;
		}

		if (profileData.skills) {
			total += 2; // Technical and soft skills
			if (profileData.skills.technical.length > 0) completed++;
			if (profileData.skills.soft.length > 0) completed++;
		}

		if (profileData.languages) {
			total += 1;
			if (profileData.languages.length > 0) completed++;
		}

		if (profileData.education) {
			total += 1;
			if (profileData.education.length > 0) completed++;
		}

		if (profileData.experience) {
			total += 1;
			if (profileData.experience.length > 0) completed++;
		}

		if (profileData.documents) {
			total += 2;
			if (profileData.documents.resume) completed++;
			if (
				profileData.portfolioLinks &&
				(profileData.portfolioLinks.github ||
					profileData.portfolioLinks.portfolio ||
					profileData.portfolioLinks.behance)
			) {
				completed++;
			}
		}

		return Math.round((completed / total) * 100);
	}, [profileData]);

	useEffect(() => {
		return () => {
			languageApiQueue.clear();
		};
	}, [languageApiQueue]);

	const PROFICIENCY_LEVEL_MAP: Record<number, string> = {
		1: "BEGINNER",
		5: "INTERMEDIATE",
		7: "FLUENT",
		9: "NATIVE",
	};

	const REVERSE_PROFICIENCY_LEVEL_MAP: Record<string, number> = {
		BEGINNER: 1,
		INTERMEDIATE: 5,
		FLUENT: 7,
		NATIVE: 9,
	};

	const addLanguage = useCallback(
		async (language: string, proficiencyLevel: number) => {
			if (!profileData) return false;

			try {
				pendingOperationsRef.current += 1;

				// Create a temporary ID for optimistic UI update
				const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: [
							...current.languages,
							{
								language,
								level: proficiencyLevel,
								tempId,
							},
						],
					};
				});

				// Make the API call
				const { data } = await api.post(
					"/api/v1/applicants/add-language-proficiency",
					{
						languageName: language,
						proficiencyLevel:
							LANGUAGE_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE",
					},
				);

				// Update the language with the real ID from the server
				setProfileData((current) => {
					if (!current) return null;

					const updatedLanguages = current.languages.map((lang) => {
						if (lang.tempId === tempId) {
							return {
								language,
								level: proficiencyLevel,
								languageId: data.id || data.languageId,
							};
						}
						return lang;
					});

					return {
						...current,
						languages: updatedLanguages,
					};
				});

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${language} added successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error adding language:", error);

				// Rollback the optimistic update
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: current.languages.filter(
							(lang) => !lang.tempId || lang.language !== language,
						),
					};
				});

				showToast({
					title: `Failed to add ${language}`,
					variant: "error",
				});

				return false;
			} finally {
				pendingOperationsRef.current -= 1;
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const updateLanguage = useCallback(
		async (languageId: number, language: string, proficiencyLevel: number) => {
			if (!profileData) return false;

			try {
				pendingOperationsRef.current += 1;

				// Store original state for rollback
				const originalLanguages = [...profileData.languages];

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;

					const updatedLanguages = current.languages.map((lang) => {
						if (lang.languageId === languageId) {
							return {
								...lang,
								language,
								level: proficiencyLevel,
							};
						}
						return lang;
					});

					return {
						...current,
						languages: updatedLanguages,
					};
				});

				// Make the API call
				await api.patch(
					`/api/v1/applicants/update-language-proficiency/${languageId}`,
					{
						languageName: language,
						proficiencyLevel:
							LANGUAGE_LEVEL_MAP[proficiencyLevel] || "INTERMEDIATE",
					},
				);

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${language} updated successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error updating language:", error);

				// Rollback to original state
				if (profileData) {
					setProfileData({
						...profileData,
						languages: [...originalLanguages],
					});
				}

				showToast({
					title: `Failed to update language`,
					variant: "error",
				});

				return false;
			} finally {
				pendingOperationsRef.current -= 1;
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const deleteLanguage = useCallback(
		async (languageName: string) => {
			if (!profileData) return false;

			const languageToDelete = profileData.languages.find(
				(lang) => lang.language === languageName,
			);

			if (!languageToDelete || !languageToDelete.languageId) {
				console.error(
					"Cannot delete language - no valid ID found for:",
					languageName,
				);
				return false;
			}

			const languageId = languageToDelete.languageId;

			try {
				pendingOperationsRef.current += 1;

				// Store original state for rollback
				const originalLanguages = [...profileData.languages];

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						languages: current.languages.filter(
							(lang) => lang.language !== languageName,
						),
					};
				});

				// Make the API call
				await api.delete(
					`/api/v1/applicants/delete-language-proficiency/${languageId}`,
				);

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${languageToDelete.language} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting language:", error);

				// Rollback to original state
				if (profileData) {
					setProfileData({
						...profileData,
						languages: [...originalLanguages],
					});
				}

				showToast({
					title: `Failed to remove ${languageToDelete.language}`,
					variant: "error",
				});

				return false;
			} finally {
				pendingOperationsRef.current -= 1;
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const addSkill = useCallback(
		async (skillName: string) => {
			if (!profileData) return false;

			try {
				pendingOperationsRef.current += 1;

				// Create a temporary ID for optimistic UI update
				const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: [
								...current.skills.technical,
								{
									id: tempId,
									name: skillName,
									tempId,
								},
							],
						},
					};
				});

				// Make the API call
				const { data } = await api.post("/api/v1/applicants/add-skills", {
					skillsAndExperienceRatings: [
						{
							skillName,
							experienceRating: "FIVE", // Default rating
						},
					],
				});

				// Update with server ID if available
				const serverId =
					data?.id || data?.skillId || (Array.isArray(data) && data[0]?.id);

				if (serverId) {
					setProfileData((current) => {
						if (!current) return null;

						const updatedSkills = current.skills.technical.map((skill) => {
							if (skill.tempId === tempId) {
								return {
									id: serverId.toString(),
									name: skillName,
								};
							}
							return skill;
						});

						return {
							...current,
							skills: {
								...current.skills,
								technical: updatedSkills,
							},
						};
					});
				}

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${skillName} added successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error adding skill:", error);

				// Rollback the optimistic update
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: current.skills.technical.filter(
								(skill) => !skill.tempId || skill.name !== skillName,
							),
						},
					};
				});

				showToast({
					title: `Failed to add ${skillName}`,
					variant: "error",
				});

				return false;
			} finally {
				pendingOperationsRef.current -= 1;
			}
		},
		[profileData, setProfileData, queryClient],
	);

	// Delete a skill
	const deleteSkill = useCallback(
		async (skillId: string) => {
			if (!profileData) return false;

			const skillToDelete = profileData.skills.technical.find(
				(skill) => skill.id === skillId,
			);

			if (!skillToDelete) {
				console.error("Cannot delete skill - not found:", skillId);
				return false;
			}

			try {
				pendingOperationsRef.current += 1;

				// Store original state for rollback
				const originalSkills = [...profileData.skills.technical];

				// Update UI immediately (optimistic update)
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: current.skills.technical.filter(
								(skill) => skill.id !== skillId,
							),
						},
					};
				});

				// Make the API call if it's not a temporary skill
				if (!skillToDelete.tempId) {
					await api.delete(`/api/v1/applicants/delete-skill/${skillId}`);
				}

				// Invalidate queries to ensure data consistency
				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: `${skillToDelete.name} removed successfully`,
					variant: "success",
				});

				return true;
			} catch (error) {
				console.error("Error deleting skill:", error);

				// Rollback to original state
				setProfileData((current) => {
					if (!current) return null;
					return {
						...current,
						skills: {
							...current.skills,
							technical: originalSkills,
						},
					};
				});

				showToast({
					title: `Failed to remove skill`,
					variant: "error",
				});

				return false;
			} finally {
				pendingOperationsRef.current -= 1;
			}
		},
		[profileData, setProfileData, queryClient],
	);

	return {
		profileData,
		isLoading:
			isLoading ||
			isUpdating ||
			basicProfileQuery.isLoading ||
			detailedProfileQuery.isLoading,
		error: error || updateError?.message || null,
		canEdit,
		updatePersonalInfo,
		updateAddress,
		updateSkills,
		updateWorkEducation,
		uploadFile,
		removeDocument,
		updatePortfolioLinks,
		updatePassword: (data: PasswordUpdateData) => updatePassword.mutate(data),
		getProfileCompletion,
		pendingOperations: pendingOperationsRef.current > 0,
		clearError,
		addLanguage,
		updateLanguage,
		deleteLanguage,
		addSkill,
		deleteSkill,
	};
}
