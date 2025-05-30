import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profile";
import type {
	ApplicantData,
	AdminSkill,
	AdminLang,
	AdminEdu,
	AdminExp,
} from "@/types/profile";

export function useAdminApplicantProfile(userId?: string) {
	return useQuery<ApplicantData | null, Error>({
		queryKey: ["admin-applicant-profile", userId],
		queryFn: async () => {
			if (!userId) return null;
			const data = await profileService.getAdminApplicantProfile(userId);
			if (!data) return null;
			const userProfile = data.userProfile;
			return {
				id: String(userProfile.id),
				name: `${userProfile.firstName} ${userProfile.lastName}`,
				personalInfo: {
					firstName: userProfile.firstName || "",
					lastName: userProfile.lastName || "",
					email: userProfile.email || "",
					phone: userProfile.phoneNumber || "",
				},
				addressInfo: {
					country: userProfile.country || "",
					city: userProfile.city || "",
					postalCode: userProfile.postalCode || "",
					address: userProfile.street || "",
				},
				department: userProfile.careerName || undefined,
				skills: Array.isArray(data.skillsAndExperienceRatings)
					? data.skillsAndExperienceRatings.map((skill: AdminSkill) => ({
							id: skill.id,
							name: skill.skillName,
							experienceRating: skill.experienceRating,
						}))
					: [],
				languages: Array.isArray(data.languagesProficiency)
					? data.languagesProficiency.map((lang: AdminLang) => ({
							id: lang.id,
							languageId: lang.id,
							language: lang.languageName,
							level: 5, // Map proficiencyLevel to a number if needed
							proficiencyLevel: lang.proficiencyLevel,
						}))
					: [],
				education: Array.isArray(data.educations)
					? data.educations.map((edu: AdminEdu) => ({
							id: String(edu.id),
							institutionName: edu.institutionName,
							educationLevel: edu.educationLevel,
							program: edu.program,
							dateJoined: edu.dateJoined,
							dateGraduated: edu.dateGraduated,
						}))
					: [],
				experience: Array.isArray(data.experiences)
					? data.experiences.map((exp: AdminExp) => ({
							id: String(exp.id),
							companyName: exp.companyName,
							jobTitle: exp.jobTitle,
							employmentType: exp.employmentType,
							country: exp.country || "",
							startDate: exp.startDate,
							endDate: exp.endDate,
						}))
					: [],
				documents: {
					resume: data.documents?.resumeUrl
						? { name: "Resume", url: data.documents.resumeUrl }
						: null,
					samples: [],
				},
				portfolioLinks: {
					portfolio: data.documents?.portfolioUrl || "",
					github: data.documents?.githubProfileUrl || "",
					behance: data.documents?.behanceProfileUrl || "",
					linkedin: data.documents?.linkedinProfileUrl || "",
				},
				avatarSrc: undefined, // Not provided by admin endpoint
			};
		},
		enabled: !!userId,
	});
}
