import { useState, useEffect } from "react";
import type { ApplicantData, UseProfileOptions } from "@/types/profile";
import { useBasicProfile } from "./use-basic-profile";
import { useDetailedProfile } from "./use-detailed-profile";
import { useProfileCompletion } from "./use-profile-completion";
import { useAdminApplicantProfile } from "./use-admin-applicant-profile";

export function useProfileCore(options: UseProfileOptions) {
	const { id, userType } = options;
	const canEdit = userType === "applicant" || !id;

	const [profileData, setProfileData] = useState<ApplicantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		data: basicProfileData,
		isLoading: isBasicProfileLoading,
		error: basicProfileError,
	} = useBasicProfile(id);

	const {
		data: detailedProfileData,
		isLoading: isDetailedProfileLoading,
		error: detailedProfileError,
	} = useDetailedProfile(basicProfileData);

	const { getProfileCompletion } = useProfileCompletion(profileData);

	const isAdmin = userType === "admin" && !!id;
	const {
		data: adminProfileData,
		isLoading: isAdminProfileLoading,
		error: adminProfileError,
	} = useAdminApplicantProfile(isAdmin ? id : undefined);

	useEffect(() => {
		const fetchAndTransformData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				if (isAdmin && adminProfileData) {
					setProfileData(adminProfileData);
				} else if (basicProfileData && detailedProfileData) {
					const basicProfile = basicProfileData;
					const detailedProfile = detailedProfileData;

					const transformed: ApplicantData = {
						id: basicProfile.id.toString(),
						name: `${basicProfile.firstName} ${basicProfile.lastName}`,
						personalInfo: {
							firstName: basicProfile.firstName || "",
							lastName: basicProfile.lastName || "",
							email: basicProfile.email || "",
							phone: basicProfile.phoneNumber || "",
						},
						addressInfo: {
							country: basicProfile.country || "",
							city: basicProfile.city || "",
							postalCode: basicProfile.postalCode || "",
							address: basicProfile.street || "",
						},
						department: basicProfile.careerName || undefined,
						skills: Array.isArray(detailedProfile.skillsAndExperienceRatings)
							? detailedProfile.skillsAndExperienceRatings.map((skill) => ({
									id: skill.id,
									name: skill.skillName,
									experienceRating: skill.experienceRating,
								}))
							: [],
						languages: Array.isArray(detailedProfile.languagesProficiency)
							? detailedProfile.languagesProficiency.map((lang) => ({
									id: lang.id,
									languageId: lang.id,
									language: lang.languageName,
									level: mapLanguageLevelFromApi(lang.proficiencyLevel),
									proficiencyLevel: lang.proficiencyLevel,
								}))
							: [],
						education: Array.isArray(detailedProfile.educations)
							? detailedProfile.educations.map((edu) => ({
									id: String(edu.id),
									institutionName: edu.institutionName,
									educationLevel: edu.educationLevel,
									program: edu.program,
									dateJoined: edu.dateJoined,
									dateGraduated: edu.dateGraduated,
								}))
							: [],
						experience: Array.isArray(detailedProfile.experiences)
							? detailedProfile.experiences.map((exp) => {
									return {
										id: String(exp.id),
										companyName: exp.companyName,
										jobTitle: exp.jobTitle,
										employmentType: exp.employmentType,
										country: exp.country || "",
										startDate: exp.startDate,
										endDate: exp.endDate,
									};
								})
							: [],
						documents: {
							resume: detailedProfile.documents?.resumeUrl
								? {
										name: "Resume",
										url: detailedProfile.documents.resumeUrl,
									}
								: null,
							samples: [],
						},
						portfolioLinks: {
							portfolio: detailedProfile.documents?.portfolioUrl || "",
							github: detailedProfile.documents?.githubProfileUrl || "",
							behance: detailedProfile.documents?.behanceProfileUrl || "",
							linkedin: detailedProfile.documents?.linkedinProfileUrl || "",
						},
						avatarSrc: basicProfile.profilePictureUrl || undefined,
					};

					setProfileData(transformed);
				}
			} catch (err) {
				console.error("Error transforming profile data:", err);
				setError("Failed to load profile data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAndTransformData();
	}, [basicProfileData, detailedProfileData, id, isAdmin, adminProfileData]);

	useEffect(() => {
		if (!profileData) return;

		const completion = getProfileCompletion();
		localStorage.setItem("profileCompletion", String(completion));

		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.set("completion", String(completion));
			window.history.replaceState({}, "", url.toString());
		}
	}, [profileData, getProfileCompletion]);

	function mapLanguageLevelFromApi(level: string): number {
		const REVERSE_LANGUAGE_LEVEL_MAP: Record<string, number> = {
			BEGINNER: 1,
			INTERMEDIATE: 5,
			FLUENT: 7,
			NATIVE: 9,
		};
		return REVERSE_LANGUAGE_LEVEL_MAP[level] || 5;
	}

	return {
		profileData,
		setProfileData,
		isLoading:
			isLoading ||
			isBasicProfileLoading ||
			isDetailedProfileLoading ||
			isAdminProfileLoading,
		error:
			error || basicProfileError || detailedProfileError || adminProfileError,
		canEdit,
		getProfileCompletion,
	};
}
