export interface Skill {
	id: string;
	name: string;
	tempId?: string; // Added for optimistic updates
}

export interface SkillsState {
	technical: Skill[];
	soft: Skill[];
}

export interface SkillPayload {
	skillName: string;
	experienceRating: "ONE" | "THREE" | "FIVE";
}

export interface AddSkillResponse {
	id: string | number;
	skillId?: string | number;
	skillName: string;
}

export interface UpdateSkillsData {
	technical: Skill[];
	soft: Skill[];
	department?: string;
}
