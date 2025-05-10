import { useCallback, useState } from "react";
import { api } from "@/services/api";
import { showToast } from "@/services/toast";
import type { ProfileInfo, AddressInfo, ApplicantData } from "@/types/profile";

export function usePersonalInfo(
	profileData: ApplicantData | null,
	setProfileData: (data: ApplicantData | null) => void,
	queryClient: any,
) {
	const [isLoading, setIsLoading] = useState(false);

	const updatePersonalInfo = useCallback(
		async (info: ProfileInfo) => {
			if (!profileData) return false;
			setIsLoading(true);

			try {
				// Update UI immediately (optimistic update)
				setProfileData({
					...profileData,
					personalInfo: info,
					name: `${info.firstName} ${info.lastName}`,
				});

				// Make API call
				await api.patch("/api/v1/users/update-user-profile", {
					firstName: info.firstName,
					lastName: info.lastName,
					phoneNumber: info.phone,
				});

				queryClient.invalidateQueries({ queryKey: ["user-profile"] });

				showToast({
					title: "Personal information updated",
					variant: "success",
				});
				return true;
			} catch (err) {
				console.error("Error updating personal info:", err);
				// Revert to original data
				setProfileData(profileData);
				showToast({
					title: "Failed to update personal information",
					variant: "error",
				});
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	const updateAddress = useCallback(
		async (info: AddressInfo) => {
			if (!profileData) return false;
			setIsLoading(true);

			try {
				// Update UI immediately (optimistic update)
				setProfileData({
					...profileData,
					addressInfo: info,
				});

				// Make API call
				await api.patch("/api/v1/users/update-user-profile", {
					country: info.country,
					city: info.city,
					postalCode: info.postalCode,
					street: info.address,
				});

				queryClient.invalidateQueries({ queryKey: ["user-profile"] });

				showToast({
					title: "Address information updated",
					variant: "success",
				});
				return true;
			} catch (err) {
				console.error("Error updating address:", err);
				// Revert to original data
				setProfileData(profileData);
				showToast({
					title: "Failed to update address information",
					variant: "error",
				});
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[profileData, setProfileData, queryClient],
	);

	return {
		updatePersonalInfo,
		updateAddress,
		isLoading,
	};
}
