import { useQuery } from "@tanstack/react-query";
import { careerService } from "@/services/career";
import type { CareerResponse } from "@/types/profile";

export function useCareers() {
	const query = useQuery({
		queryKey: ["careers"],
		queryFn: async () => {
			try {
				const data = await careerService.listCareers();
				const activeCareersList = data.careers.filter(
					(career) => career.status === "ACTIVE",
				);
				return activeCareersList;
			} catch (error) {
				console.error("Error fetching careers:", error);
				return [] as CareerResponse[];
			}
		},
	});

	return query;
}
