export type EducationLevel =
	| "HIGH_SCHOOL"
	| "ASSOCIATE"
	| "BACHELOR"
	| "MASTER"
	| "DOCTORATE";
export type EmploymentType =
	| "FULL_TIME"
	| "PART_TIME"
	| "CONTRACT"
	| "INTERNSHIP"
	| "FREELANCE";

export interface Education {
	id?: string;
	institutionName: string;
	educationLevel: string;
	program: string;
	dateJoined?: string | null;
	dateGraduated?: string | null;
}

export interface Experience {
	id?: string;
	companyName: string;
	jobTitle: string;
	employmentType: string;
	country?: string;
	startDate?: string;
	endDate?: string;
}

export interface AddEducationRequest {
	institutionName: string;
	educationLevel: string;
	program: string;
	dateJoined?: string | null;
	dateGraduated?: string | null;
}

export interface AddExperienceRequest {
	companyName: string;
	jobTitle: string;
	employmentType: string;
	country?: string;
	startDate?: string;
	endDate?: string;
}
