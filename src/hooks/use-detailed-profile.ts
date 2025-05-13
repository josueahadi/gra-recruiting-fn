import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type {
	DetailedProfileResponse,
	BasicProfileResponse,
} from "@/types/profile";

export function useDetailedProfile(
	basicProfileData: BasicProfileResponse | undefined,
) {
	return useQuery({
		queryKey: ["application-profile", basicProfileData?.id],
		queryFn: async () => {
			try {
				const { data } = await api.get(
					"/api/v1/applicants/get-application-profile",
				);
				return data as DetailedProfileResponse;
			} catch (error) {
				console.error("Error fetching application profile:", error);
				throw new Error("Failed to load detailed profile data");
			}
		},
		enabled: !!basicProfileData,
	});
}
