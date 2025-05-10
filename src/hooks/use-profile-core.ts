import { useState, useEffect } from "react";
import type { ApplicantData, UseProfileOptions } from "@/types/profile";
import { useBasicProfile } from "./use-basic-profile";
import { useDetailedProfile } from "./use-detailed-profile";
import { formatDateString, formatDateRange } from "@/lib/utils/date-utils";
import { useProfileCompletion } from "./use-profile-completion";

export function useProfileCore(options: UseProfileOptions) {
	const { id, userType } = options;
	const canEdit = userType === "applicant" || !id;

	const [profileData, setProfileData] = useState<ApplicantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch basic profile data (personal info, etc.)
	const {
		data: basicProfileData,
		isLoading: isBasicProfileLoading,
		error: basicProfileError,
	} = useBasicProfile(id);

	// Fetch detailed profile data (skills, education, etc.)
	const {
		data: detailedProfileData,
		isLoading: isDetailedProfileLoading,
		error: detailedProfileError,
	} = useDetailedProfile(basicProfileData);

	// Calculate profile completion percentage
	const { getProfileCompletion } = useProfileCompletion(profileData);

	// Transform and combine profile data
	useEffect(() => {
		const fetchAndTransformData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				if (basicProfileData && detailedProfileData) {
					const basicProfile = basicProfileData;
					const detailedProfile = detailedProfileData;

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
									level: mapLanguageLevelFromApi(lang.proficiencyLevel),
								}))
							: [],
						education: Array.isArray(detailedProfile.educations)
							? detailedProfile.educations.map((edu) => ({
									id: String(edu.id || Date.now()),
									institution: edu.institutionName,
									degree: mapEducationLevelFromApi(edu.educationLevel),
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
										responsibilities: mapEmploymentTypeFromApi(
											exp.employmentType,
										),
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

				if (basicProfileData) {
					const basicProfile = basicProfileData;

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
	}, [basicProfileData, detailedProfileData, id]);

	// Update URL and localStorage when profile completion changes
	useEffect(() => {
		if (!profileData) return;

		const completion = getProfileCompletion();
		localStorage.setItem("profileCompletion", String(completion));

		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.set("completion", String(completion));
			window.history.replaceState({}, "", url.toString());
		}
	}, [profileData, getProfileCompletion]);

	// Helper functions for mapping API values to display values
	function mapLanguageLevelFromApi(level: string): number {
		const REVERSE_LANGUAGE_LEVEL_MAP: Record<string, number> = {
			BEGINNER: 1,
			INTERMEDIATE: 5,
			FLUENT: 7,
			NATIVE: 9,
		};
		return REVERSE_LANGUAGE_LEVEL_MAP[level] || 5;
	}

	function mapEducationLevelFromApi(level: string): string {
		const REVERSE_EDUCATION_LEVEL_MAP: Record<string, string> = {
			HIGH_SCHOOL: "High School",
			ASSOCIATE: "Associate Degree",
			BACHELOR: "Bachelor's Degree",
			MASTER: "Master's Degree",
			DOCTORATE: "Doctorate",
			OTHER: "Other",
		};
		return REVERSE_EDUCATION_LEVEL_MAP[level] || level;
	}

	function mapEmploymentTypeFromApi(type: string): string {
		const REVERSE_EMPLOYMENT_TYPE_MAP: Record<string, string> = {
			FULL_TIME: "Full-time",
			PART_TIME: "Part-time",
			CONTRACT: "Contract",
			INTERNSHIP: "Internship",
			FREELANCE: "Freelance",
		};
		return REVERSE_EMPLOYMENT_TYPE_MAP[type] || type;
	}

	return {
		profileData,
		setProfileData,
		isLoading: isLoading || isBasicProfileLoading || isDetailedProfileLoading,
		error: error || basicProfileError || detailedProfileError,
		canEdit,
		getProfileCompletion,
	};
}
