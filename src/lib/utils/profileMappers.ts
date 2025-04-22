import type {
	UserProfileResponse,
	ApplicationProfileResponse,
	ProfileInfo,
	AddressInfo,
	Skill,
	LanguageProficiency,
	Education,
	WorkExperience,
	PortfolioLinks,
	Document,
} from "@/hooks/use-profile";

// Education level mappings
export const EDUCATION_LEVEL_MAP: Record<string, string> = {
	"High School": "HIGH_SCHOOL",
	"Associate Degree": "ASSOCIATE",
	"Bachelor's Degree": "BACHELOR",
	"Master's Degree": "MASTER",
	Doctorate: "DOCTORATE",
	Other: "OTHER",
};

export const REVERSE_EDUCATION_LEVEL_MAP: Record<string, string> = {
	HIGH_SCHOOL: "High School",
	ASSOCIATE: "Associate Degree",
	BACHELOR: "Bachelor's Degree",
	MASTER: "Master's Degree",
	DOCTORATE: "Doctorate",
	OTHER: "Other",
};

// Employment type mappings
export const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
	"Full-time": "FULL_TIME",
	"Part-time": "PART_TIME",
	Contract: "CONTRACT",
	Internship: "INTERNSHIP",
	Freelance: "FREELANCE",
};

export const REVERSE_EMPLOYMENT_TYPE_MAP: Record<string, string> = {
	FULL_TIME: "Full-time",
	PART_TIME: "Part-time",
	CONTRACT: "Contract",
	INTERNSHIP: "Internship",
	FREELANCE: "Freelance",
};

// Skill rating mappings
export const SKILL_RATING_MAP: Record<string, string> = {
	"1": "ONE",
	"2": "TWO",
	"3": "THREE",
	"4": "FOUR",
	"5": "FIVE",
};

export const REVERSE_SKILL_RATING_MAP = Object.entries(SKILL_RATING_MAP).reduce(
	(acc, [key, value]) => ({ ...acc, [value]: key }),
	{},
) as Record<string, string>;

// Language proficiency mappings
export const LANGUAGE_PROFICIENCY_MAP: Record<string, string> = {
	"1": "BEGINNER",
	"3": "ELEMENTARY",
	"5": "INTERMEDIATE",
	"7": "ADVANCED",
	"9": "NATIVE",
};

export const REVERSE_LANGUAGE_PROFICIENCY_MAP = Object.entries(
	LANGUAGE_PROFICIENCY_MAP,
).reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {}) as Record<
	string,
	string
>;

// Function to map basic profile data from API to frontend format
export function mapBasicProfileData(apiData: UserProfileResponse) {
	if (!apiData) return null;

	return {
		personalInfo: {
			firstName: apiData.firstName || "",
			lastName: apiData.lastName || "",
			email: apiData.email || "",
			phone: apiData.phoneNumber || "",
			bio: "", // Not provided in this API
		},
		addressInfo: {
			country: apiData.country || "",
			city: apiData.city || "",
			postalCode: apiData.postalCode || "",
			address: apiData.street || "",
		},
		department: apiData.careerName || undefined,
	};
}

// Function to map detailed profile data
export function mapDetailedProfileData(apiData: ApplicationProfileResponse) {
	if (!apiData) return null;

	return {
		skills: {
			technical: apiData.skillsAndExperienceRatings.map((skill) => ({
				id: String(skill.skillId || Date.now()),
				name: skill.skillName,
			})),
			soft: [], // API doesn't differentiate between skill types
		},
		languages: apiData.languagesProficiency.map((lang) => ({
			id: String(lang.languageId || Date.now()),
			language: lang.languageName,
			level: Number(
				REVERSE_LANGUAGE_PROFICIENCY_MAP[lang.proficiencyLevel] || 5,
			),
		})),
		education: apiData.educations.map((edu) => ({
			id: String(edu.id || Date.now()),
			institution: edu.institutionName,
			degree:
				REVERSE_EDUCATION_LEVEL_MAP[edu.educationLevel] || edu.educationLevel,
			program: edu.program,
			startYear: formatDateString(edu.dateJoined),
			endYear: formatDateString(edu.dateGraduated),
		})),
		experience: apiData.experiences.map((exp) => ({
			id: String(exp.id || Date.now()),
			company: exp.companyName,
			role: exp.jobTitle,
			duration: formatDateRange(exp.startDate, exp.endDate),
			responsibilities:
				REVERSE_EMPLOYMENT_TYPE_MAP[exp.employmentType] || exp.employmentType,
		})),
		documents: {
			resume: apiData.documents[0]?.resumeUrl
				? {
						name: "Resume",
						url: apiData.documents[0].resumeUrl,
					}
				: null,
			samples: [],
		},
		portfolioLinks: {
			portfolio: apiData.documents[0]?.portfolioUrl || "",
			github: apiData.documents[0]?.githubProfileUrl || "",
			behance: apiData.documents[0]?.behanceProfileUrl || "",
			linkedin: apiData.documents[0]?.linkedinProfileUrl || "",
		},
	};
}

// Helper date formatting functions
export function formatDateString(dateStr?: string): string {
	if (!dateStr) return "";

	try {
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return dateStr;

		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return `${months[date.getMonth()]} ${date.getFullYear()}`;
	} catch (e) {
		return dateStr;
	}
}

export function formatDateRange(startDate?: string, endDate?: string): string {
	const start = formatDateString(startDate);
	const end = endDate ? formatDateString(endDate) : "Present";

	return `${start} - ${end}`;
}

// Mapping functions for API requests
export function mapPersonalInfoToApi(data: ProfileInfo) {
	return {
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phoneNumber: data.phone,
	};
}

export function mapAddressToApi(data: AddressInfo) {
	return {
		country: data.country,
		city: data.city,
		postalCode: data.postalCode,
		street: data.address,
	};
}

export function mapSkillsToApi(skills: Skill[]) {
	return skills.map((skill) => ({
		skillName: skill.name,
		experienceRating: SKILL_RATING_MAP["5"], // Default rating
	}));
}

export function mapLanguageToApi(language: string, level: number) {
	return {
		languageName: language,
		proficiencyLevel: LANGUAGE_PROFICIENCY_MAP[String(level)] || "INTERMEDIATE",
	};
}

export function mapEducationToApi(education: Education) {
	// Parse date strings into API format
	const formatApiDate = (dateStr: string) => {
		try {
			// If it's just a year (e.g., "2021")
			if (/^\d{4}$/.test(dateStr)) {
				return `${dateStr}-01-01`;
			}

			// If it's in Month Year format
			const monthYearMatch = dateStr.match(/^([A-Za-z]{3}) (\d{4})$/);
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

			// If it's already in a parseable format
			const date = new Date(dateStr);
			return date.toISOString().split("T")[0];
		} catch (e) {
			console.error(`Error formatting date: ${dateStr}`, e);
			return dateStr;
		}
	};

	return {
		institutionName: education.institution,
		educationLevel: EDUCATION_LEVEL_MAP[education.degree] || "BACHELOR",
		program: education.program,
		dateJoined: formatApiDate(education.startYear),
		dateGraduated:
			education.endYear === "Present"
				? formatApiDate(new Date().toISOString())
				: formatApiDate(education.endYear),
	};
}

export function mapExperienceToApi(experience: WorkExperience) {
	// Parse duration string into start and end dates
	const parseExperienceDates = (duration: string) => {
		try {
			// Extract the date range part if it includes the calculated duration in parentheses
			let dateRange = duration;
			if (duration.includes("(")) {
				dateRange = duration.split("(")[0].trim();
			}

			// Split the range
			const parts = dateRange.split("-").map((p) => p.trim());

			// Format for API
			return {
				startDate: parts[0],
				endDate: parts[1] === "Present" ? undefined : parts[1],
			};
		} catch (e) {
			console.error(`Error parsing experience duration: ${duration}`, e);
			return { startDate: "", endDate: undefined };
		}
	};

	const dates = parseExperienceDates(experience.duration);

	return {
		companyName: experience.company,
		jobTitle: experience.role,
		employmentType:
			EMPLOYMENT_TYPE_MAP[experience.responsibilities] || "FULL_TIME",
		country: "Rwanda", // Default, would need to be provided
		startDate: dates.startDate,
		endDate: dates.endDate,
	};
}

export function mapPortfolioLinksToApi(links: PortfolioLinks) {
	return {
		linkedinProfileUrl: links.linkedin || "",
		githubProfileUrl: links.github || "",
		behanceProfileUrl: links.behance || "",
		portfolioUrl: links.portfolio || "",
	};
}

export function calculateProfileCompletion(profileData: any) {
	let completed = 0;
	let total = 0;

	// Personal info
	if (profileData.personalInfo) {
		total += 5; // 5 fields
		if (profileData.personalInfo.firstName) completed++;
		if (profileData.personalInfo.lastName) completed++;
		if (profileData.personalInfo.email) completed++;
		if (profileData.personalInfo.phone) completed++;
		if (profileData.personalInfo.bio) completed++;
	}

	// Address
	if (profileData.addressInfo) {
		total += 4; // 4 fields
		if (profileData.addressInfo.country) completed++;
		if (profileData.addressInfo.city) completed++;
		if (profileData.addressInfo.postalCode) completed++;
		if (profileData.addressInfo.address) completed++;
	}

	// Skills
	if (profileData.skills) {
		total += 2; // Technical and soft skills
		if (profileData.skills.technical.length > 0) completed++;
		if (profileData.skills.soft.length > 0) completed++;
	}

	// Languages
	if (profileData.languages) {
		total += 1;
		if (profileData.languages.length > 0) completed++;
	}

	// Education
	if (profileData.education) {
		total += 1;
		if (profileData.education.length > 0) completed++;
	}

	// Experience
	if (profileData.experience) {
		total += 1;
		if (profileData.experience.length > 0) completed++;
	}

	// Documents
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
}
