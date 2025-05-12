export interface Skill {
	id: string | number;
	name: string;
	experienceRating?: string;
	isTemporary?: boolean;
}

export interface SkillPayload {
	skillName: string;
	experienceRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
}

export interface AddSkillResponse {
	id: number;
	skillName: string;
	experienceRating: string;
}
