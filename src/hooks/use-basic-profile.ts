import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { BasicProfileResponse } from "@/types/profile";

export function useBasicProfile(id?: string) {
	return useQuery({
		queryKey: ["user-profile", id],
		queryFn: async () => {
			try {
				const { data } = await api.get("/api/v1/users/view-profile");
				return data as BasicProfileResponse;
			} catch (error) {
				console.error("Error fetching user profile:", error);
				throw new Error("Failed to load profile data");
			}
		},
		enabled: !id, // Only fetch for current user if no id is provided
	});
}
