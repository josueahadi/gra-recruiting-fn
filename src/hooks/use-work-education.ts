import { useCallback, useState } from "react";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import { convertUIDateToApiDate } from "@/lib/utils/date-utils";
import type { Education, WorkExperience, ApplicantData } from "@/types/profile";
import type { QueryClient } from "@tanstack/react-query";

export function useWorkEducation(
	profileData: ApplicantData | null,
	setProfileData: (data: ApplicantData | null) => void,
	queryClient: QueryClient,
) {
	const [workEducationLoading, setWorkEducationLoading] = useState(false);

	const EDUCATION_LEVEL_MAP: Record<string, string> = {
		"High School": "HIGH_SCHOOL",
		"Associate Degree": "ASSOCIATE",
		"Bachelor's Degree": "BACHELOR",
		"Master's Degree": "MASTER",
		Doctorate: "DOCTORATE",
		Other: "OTHER",
	};

	const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
		"Full-time": "FULL_TIME",
		"Part-time": "PART_TIME",
		Contract: "CONTRACT",
		Internship: "INTERNSHIP",
		Freelance: "FREELANCE",
	};

	const updateWorkEducation = useCallback(
		async (data: { education: Education[]; experience: WorkExperience[] }) => {
			if (!profileData) return false;
			setWorkEducationLoading(true);

			try {
				setProfileData({
					...profileData,
					education: data.education,
					experience: data.experience,
				});

				const existingEducation = profileData.education || [];

				for (const edu of data.education) {
					const existingEntry = existingEducation.find((e) => e.id === edu.id);

					if (!existingEntry) {
						await api.post("/api/v1/applicants/add-education", {
							institutionName: edu.institutionName,
							educationLevel:
								EDUCATION_LEVEL_MAP[edu.educationLevel] || "BACHELOR",
							program: edu.program,
							dateJoined: convertUIDateToApiDate(edu.dateJoined || ""),
							dateGraduated: convertUIDateToApiDate(edu.dateGraduated || ""),
						});
					} else {
						if (edu.id) {
							const originalId = edu.id.includes("-edit-")
								? edu.id.split("-edit-")[0]
								: edu.id;

							const educationId = Number.isNaN(Number(originalId))
								? originalId
								: Number(originalId);

							await api.patch(
								`/api/v1/applicants/update-education/${educationId}`,
								{
									institutionName: edu.institutionName,
									educationLevel:
										EDUCATION_LEVEL_MAP[edu.educationLevel] || "BACHELOR",
									program: edu.program,
									dateJoined: convertUIDateToApiDate(edu.dateJoined || ""),
									dateGraduated: convertUIDateToApiDate(
										edu.dateGraduated || "",
									),
								},
							);
						}
					}
				}

				const existingExperience = profileData.experience || [];

				for (const exp of data.experience) {
					const durationParts = exp.duration.split("-").map((p) => p.trim());
					const startDate = durationParts[0];
					const endDateWithParentheses = durationParts[1];
					const endDate =
						endDateWithParentheses.split("(")[0].trim() === "Present"
							? undefined
							: endDateWithParentheses.split("(")[0].trim();

					const existingEntry = existingExperience.find((e) => e.id === exp.id);

					if (!existingEntry) {
						await api.post("/api/v1/applicants/add-experience", {
							companyName: exp.company,
							jobTitle: exp.role,
							employmentType:
								EMPLOYMENT_TYPE_MAP[exp.responsibilities] || "FULL_TIME",
							country: exp.country || "Rwanda",
							startDate: convertUIDateToApiDate(startDate),
							endDate: endDate ? convertUIDateToApiDate(endDate) : undefined,
						});
					} else {
						const originalId = exp.id.includes("-edit-")
							? exp.id.split("-edit-")[0]
							: exp.id;

						await api.patch(
							`/api/v1/applicants/update-experience/${originalId}`,
							{
								companyName: exp.company,
								jobTitle: exp.role,
								employmentType:
									EMPLOYMENT_TYPE_MAP[exp.responsibilities] || "FULL_TIME",
								country: exp.country || "Rwanda",
								startDate: convertUIDateToApiDate(startDate),
								endDate: endDate ? convertUIDateToApiDate(endDate) : undefined,
							},
						);
					}
				}

				queryClient.invalidateQueries({ queryKey: ["application-profile"] });

				showToast({
					title: "Work and education information updated",
					variant: "success",
				});
				return true;
			} catch (err) {
				console.error("Error updating work/education:", err);
				setProfileData(profileData);
				showToast({
					title: "Failed to update work and education information",
					variant: "error",
				});
				return false;
			} finally {
				setWorkEducationLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	return {
		updateWorkEducation,
		workEducationLoading,
	};
}
