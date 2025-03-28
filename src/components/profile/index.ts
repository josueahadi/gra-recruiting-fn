// Export all profile components for easier imports
export * from "./core/components";
export { default as PersonalInfoSection } from "./sections/personal-info";
export { default as AddressSection } from "./sections/address";
export { default as SkillsSection } from "./sections/skills";
export { default as WorkEducationSection } from "./sections/work-education";
export { default as DocumentsSection } from "./sections/documents";
export { default as UnifiedProfileView } from "./container/unified-profile-view";

// Re-export types for convenience
export type {
	PersonalInfo,
	AddressInfo,
} from "./core/components";

export type {
	Skill,
	LanguageProficiency,
} from "./sections/skills";

export type {
	Education,
	WorkExperience,
} from "./sections/work-education";

export type {
	Document,
	PortfolioLinks,
} from "./sections/documents";

export type { ApplicantData } from "./container/unified-profile-view";
