import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/services/toast";
import type { ApplicantData, UseProfileOptions } from "@/types/profile";
import { useBasicProfile } from "./use-basic-profile";
import { useDetailedProfile } from "./use-detailed-profile";
import { useProfileCompletion } from "./use-profile-completion";

export function useProfileCore(options: UseProfileOptions) {
	const { id, userType } = options;
	const queryClient = useQueryClient();
	const canEdit = userType === "applicant" || !id;

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [profileData, setProfileData] = useState<ApplicantData | null>(null);

	// Fetch basic profile data (personal info, etc.)
	const {
		data: basicProfileData,
		isLoading: isBasicProfileLoading,
		error: basicProfileError,
	} = useBasicProfile(id);

	// Fetch detailed profile data (skills, education, etc.)
	const {
		data: detailedProfileData,
		isLoading: isDetailedProfileLoading,
		error: detailedProfileError,
	} = useDetailedProfile(basicProfileData);

	// Calculate profile completion percentage
	const { getProfileCompletion } = useProfileCompletion(profileData);

	// Transform and combine profile data
	useEffect(() => {
		const fetchAndTransformData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				if (basicProfileData && detailedProfileData) {
					// Transform data here...
					// This would be the transformed ApplicantData object
					const transformedData = {
						// ...transformation logic
					} as ApplicantData;

					setProfileData(transformedData);
				} else if (id) {
					// Handle specific user viewing logic...
				}
			} catch (err) {
				console.error("Error transforming profile data:", err);
				setError("Failed to load profile data");

				// Set fallback data if basic profile is available
				if (basicProfileData) {
					// Create minimal fallback data
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchAndTransformData();
	}, [basicProfileData, detailedProfileData, id]);

	return {
		profileData,
		setProfileData,
		isLoading: isLoading || isBasicProfileLoading || isDetailedProfileLoading,
		error: error || basicProfileError || detailedProfileError,
		canEdit,
		queryClient,
		getProfileCompletion,
	};
}
