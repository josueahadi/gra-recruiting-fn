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
	tempId?: string;
	institutionName: string;
	educationLevel: EducationLevel;
	program: string;
	dateJoined: string;
	dateGraduated: string;
}

export interface Experience {
	id?: string;
	tempId?: string;
	companyName: string;
	jobTitle: string;
	employmentType: EmploymentType;
	country: string;
	startDate: string;
	endDate: string;
}

export interface AddEducationRequest {
	institutionName: string;
	educationLevel: EducationLevel;
	program: string;
	dateJoined: string;
	dateGraduated: string;
}

export interface AddExperienceRequest {
	companyName: string;
	jobTitle: string;
	employmentType: EmploymentType;
	country: string;
	startDate: string;
	endDate: string;
}
