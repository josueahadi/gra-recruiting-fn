import { useCallback } from "react";
import type { ApplicantData } from "@/types/profile";

export function useProfileCompletion(profileData: ApplicantData | null) {
	const getProfileCompletion = useCallback(() => {
		if (!profileData) return 0;

		let completed = 0;
		let total = 0;

		// Personal information
		if (profileData.personalInfo) {
			total += 4; // 4 fields
			if (profileData.personalInfo.firstName) completed++;
			if (profileData.personalInfo.lastName) completed++;
			if (profileData.personalInfo.email) completed++;
			if (profileData.personalInfo.phone) completed++;
		}

		// Address information
		if (profileData.addressInfo) {
			total += 4; // 4 fields
			if (profileData.addressInfo.country) completed++;
			if (profileData.addressInfo.city) completed++;
			if (profileData.addressInfo.address) completed++;
			if (profileData.addressInfo.postalCode) completed++;
		}

		// Skills
		if (profileData.skills) {
			total += 1; // At least one skill
			if (profileData.skills.length > 0) completed++;
		}

		// Languages
		if (profileData.languages) {
			total += 1; // At least one language
			if (profileData.languages.length > 0) completed++;
		}

		// Education
		if (profileData.education) {
			total += 1; // At least one education entry
			if (profileData.education.length > 0) completed++;
		}

		// Experience
		if (profileData.experience) {
			total += 1; // At least one experience entry
			if (profileData.experience.length > 0) completed++;
		}

		// Documents - now only 1 point total for any document link
		total += 1; // Only 1 point for any document

		// Check if any document link is available
		const hasResume = !!profileData.documents?.resume;
		const hasLinkedIn = !!profileData.portfolioLinks?.linkedin;
		const hasGitHub = !!profileData.portfolioLinks?.github;
		const hasBehance = !!profileData.portfolioLinks?.behance;
		const hasPortfolio = !!profileData.portfolioLinks?.portfolio;

		if (hasResume || hasLinkedIn || hasGitHub || hasBehance || hasPortfolio) {
			completed++;
		}

		// Calculate percentage
		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
		return percentage;
	}, [profileData]);

	return { getProfileCompletion };
}
