export interface Skill {
	id?: number;
	name: string;
	experienceRating?: string;
	tempId?: string; // Added for optimistic updates
}

export interface SkillsState {
	technical: Skill[];
	soft: Skill[];
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

export interface UpdateSkillsData {
	technical: Skill[];
	soft: Skill[];
	department?: string;
}
