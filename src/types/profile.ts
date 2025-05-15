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
	resumeUrl?: string;
}

export interface LanguageProficiency {
	id?: number;
	languageId?: number;
	language: string;
	level: number;
	proficiencyLevel?: string;
}

export interface Education {
	id?: string;
	institutionName: string;
	educationLevel: string;
	program: string;
	dateJoined?: string | null;
	dateGraduated?: string | null;
}

export interface WorkExperience {
	id: string;
	company: string;
	role: string;
	duration: string;
	responsibilities: string;
	country?: string;
}

export interface Skill {
	id: string | number;
	name: string;
	experienceRating?: string;
	isTemporary?: boolean;
}

export interface ApplicantData {
	id: string;
	name: string;
	personalInfo: ProfileInfo;
	addressInfo: AddressInfo;
	department?: string;
	skills: Skill[];
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
	createdAt?: string;
	updatedAt?: string;
}

export interface DetailedProfileResponse {
	userProfile: {
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
		createdAt?: string;
		updatedAt?: string;
	};
	skillsAndExperienceRatings: Array<{
		id: number;
		skillName: string;
		experienceRating: string;
	}>;
	languagesProficiency: Array<{
		id: number;
		languageName: string;
		proficiencyLevel: string;
	}>;
	educations: Array<{
		id: number;
		institutionName: string;
		educationLevel: string;
		program: string;
		dateJoined: string | null;
		dateGraduated: string | null;
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
	documents?: {
		linkedinProfileUrl?: string;
		githubProfileUrl?: string;
		resumeUrl?: string;
		behanceProfileUrl?: string;
		portfolioUrl?: string;
	};
}

export interface PasswordUpdateData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface CareerResponse {
	id: number;
	name: string;
	status: "ACTIVE" | "INACTIVE";
	createdAt?: string;
}

export interface ListCareersResponse {
	careers: CareerResponse[];
	page: number;
	take: number;
	totalUsers: number;
	pageCount: number;
	hasNextPage: boolean;
}

export interface ApiResponse<T> {
	message: string;
	data: T;
}

export interface SkillResponse {
	id: number;
	skillName: string;
	experienceRating: string;
}

export interface LanguageResponse {
	id: number;
	languageName: string;
	proficiencyLevel: string;
}

export interface DocumentsResponse {
	id: number;
	linkedinProfileUrl?: string;
	githubProfileUrl?: string;
	resumeUrl?: string;
	behanceProfileUrl?: string;
	portfolioUrl?: string;
}

export interface EducationResponse {
	id: number;
	institutionName: string;
	educationLevel: string;
	program: string;
	dateJoined: string | null;
	dateGraduated: string | null;
}

export interface ExperienceResponse {
	id: number;
	companyName: string;
	jobTitle: string;
	employmentType: string;
	country?: string;
	startDate: string;
	endDate?: string;
}
