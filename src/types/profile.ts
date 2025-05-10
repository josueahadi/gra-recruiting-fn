import type { SkillsState } from "./skills";

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

export interface Document {
	name: string;
	url: string;
}

export interface Documents {
	resume: Document | null;
	samples: Document[];
}

export interface PortfolioLinks {
	portfolio?: string;
	github?: string;
	behance?: string;
	linkedin?: string;
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

export interface ApplicantData {
	id: string;
	name: string;
	personalInfo: ProfileInfo;
	addressInfo: AddressInfo;
	department?: string;
	skills: SkillsState;
	languages: LanguageProficiency[];
	education: Education[];
	experience: WorkExperience[];
	documents: Documents;
	portfolioLinks: PortfolioLinks;
	avatarSrc?: string;
}

export interface UseProfileOptions {
	id?: string;
	userType: "applicant" | "admin";
}

export interface BasicProfileResponse {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	country?: string;
	city?: string;
	postalCode?: string;
	street?: string;
	careerName?: string;
}

export interface DetailedProfileResponse {
	skillsAndExperienceRatings: Array<{
		skillId: number;
		skillName: string;
		experienceRating: string;
	}>;
	languagesProficiency: Array<{
		languageId: number;
		languageName: string;
		proficiencyLevel: string;
	}>;
	educations: Array<{
		id: number;
		institutionName: string;
		educationLevel: string;
		program: string;
		dateJoined: string;
		dateGraduated: string;
	}>;
	experiences: Array<{
		id: number;
		companyName: string;
		jobTitle: string;
		employmentType: string;
		country: string;
		startDate: string;
		endDate?: string;
	}>;
	documents?: Array<{
		resumeUrl?: string;
		portfolioUrl?: string;
		githubProfileUrl?: string;
		behanceProfileUrl?: string;
		linkedinProfileUrl?: string;
	}>;
}

export interface PasswordUpdateData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
