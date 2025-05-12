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
			if (profileData.addressInfo.postalCode) completed++;
			if (profileData.addressInfo.address) completed++;
		}

		// Skills
		if (profileData.skills) {
			total += 1;
			if (profileData.skills.length > 0) completed++;
		}

		// Languages
		if (profileData.languages) {
			total += 1;
			if (profileData.languages.length > 0) completed++;
		}

		// Education
		if (profileData.education) {
			total += 1;
			if (profileData.education.length > 0) completed++;
		}

		// Work experience
		if (profileData.experience) {
			total += 1;
			if (profileData.experience.length > 0) completed++;
		}

		// Documents and portfolio
		if (profileData.documents) {
			total += 2;
			if (profileData.documents.resume) completed++;
			if (
				profileData.portfolioLinks &&
				(profileData.portfolioLinks.github ||
					profileData.portfolioLinks.portfolio ||
					profileData.portfolioLinks.behance)
			) {
				completed++;
			}
		}

		return Math.round((completed / total) * 100);
	}, [profileData]);

	return {
		getProfileCompletion,
	};
}
