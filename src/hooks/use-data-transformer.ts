import { formatDateString, formatDateRange } from "@/lib/utils/date-utils";
import type {
	BasicProfileResponse,
	DetailedProfileResponse,
	ApplicantData,
} from "@/types/profile";

export function useDataTransformer() {
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

	function mapLanguageLevelToApi(level: number): string {
		const LANGUAGE_LEVEL_MAP: Record<number, string> = {
			1: "BEGINNER",
			5: "INTERMEDIATE",
			7: "FLUENT",
			9: "NATIVE",
		};
		return LANGUAGE_LEVEL_MAP[level] || "INTERMEDIATE";
	}

	function mapEducationLevelToApi(level: string): string {
		const EDUCATION_LEVEL_MAP: Record<string, string> = {
			"High School": "HIGH_SCHOOL",
			"Associate Degree": "ASSOCIATE",
			"Bachelor's Degree": "BACHELOR",
			"Master's Degree": "MASTER",
			Doctorate: "DOCTORATE",
			Other: "OTHER",
		};
		return EDUCATION_LEVEL_MAP[level] || "BACHELOR";
	}

	function mapEmploymentTypeToApi(type: string): string {
		const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
			"Full-time": "FULL_TIME",
			"Part-time": "PART_TIME",
			Contract: "CONTRACT",
			Internship: "INTERNSHIP",
			Freelance: "FREELANCE",
		};
		return EMPLOYMENT_TYPE_MAP[type] || "FULL_TIME";
	}

	function transformProfileData(
		basicProfile: BasicProfileResponse,
		detailedProfile: DetailedProfileResponse,
	): ApplicantData {
		return {
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
			skills: Array.isArray(detailedProfile.skillsAndExperienceRatings)
				? detailedProfile.skillsAndExperienceRatings.map((skill) => ({
						id: String(skill.id || Date.now()),
						name: skill.skillName,
						experienceRating: skill.experienceRating,
					}))
				: [],
			languages: Array.isArray(detailedProfile.languagesProficiency)
				? detailedProfile.languagesProficiency.map((lang) => ({
						languageId: lang.id,
						language: lang.languageName,
						level: mapLanguageLevelFromApi(lang.proficiencyLevel),
					}))
				: [],
			education: Array.isArray(detailedProfile.educations)
				? detailedProfile.educations.map((edu) => ({
						id: String(edu.id || Date.now()),
						institutionName: edu.institutionName,
						educationLevel: edu.educationLevel,
						program: edu.program,
						dateJoined: edu.dateJoined ?? undefined,
						dateGraduated: edu.dateGraduated ?? undefined,
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
							responsibilities: mapEmploymentTypeFromApi(exp.employmentType),
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
	}

	function createFallbackData(
		basicProfile: BasicProfileResponse,
	): ApplicantData {
		return {
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
			skills: [],
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
	}

	return {
		mapLanguageLevelFromApi,
		mapEducationLevelFromApi,
		mapEmploymentTypeFromApi,
		mapLanguageLevelToApi,
		mapEducationLevelToApi,
		mapEmploymentTypeToApi,
		transformProfileData,
		createFallbackData,
	};
}
