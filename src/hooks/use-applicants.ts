// import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Types
export interface Applicant {
	id: string;
	name: string;
	email: string;
	phone?: string;
	status: "success" | "fail" | "waiting";
	department: string;
	dateApplied: string;
	lastUpdated?: string;
}

export interface PaginatedApplicants {
	data: Applicant[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

// Mock data for demonstration
const MOCK_APPLICANTS: Applicant[] = [
	{
		id: "1",
		name: "Johnny Doe",
		email: "johndoe12@yahoo.com",
		phone: "+250 781 234 567",
		status: "success",
		department: "Design",
		dateApplied: "12/06/2025",
		lastUpdated: "15/06/2025",
	},
	{
		id: "2",
		name: "Jack Black",
		email: "johndoe12@outlook.com",
		phone: "+250 782 345 678",
		status: "success",
		department: "Development",
		dateApplied: "12/06/2025",
		lastUpdated: "14/06/2025",
	},
	{
		id: "3",
		name: "James Brown",
		email: "johndoe12@hotmail.com",
		phone: "+250 783 456 789",
		status: "success",
		department: "Design",
		dateApplied: "12/06/2025",
		lastUpdated: "13/06/2025",
	},
	{
		id: "4",
		name: "Jack Dixon",
		email: "johndoe12@outlook.com",
		phone: "+250 784 567 890",
		status: "fail",
		department: "Accounting",
		dateApplied: "12/06/2025",
		lastUpdated: "12/06/2025",
	},
	{
		id: "5",
		name: "Jonny Deer",
		email: "johndoe12@hotmail.com",
		phone: "+250 785 678 901",
		status: "waiting",
		department: "Marketing",
		dateApplied: "12/06/2025",
	},
	{
		id: "6",
		name: "Harry Diggle",
		email: "digs@gmail.com",
		phone: "+250 785 678 901",
		status: "success",
		department: "Marketing",
		dateApplied: "12/06/2025",
	},
	{
		id: "7",
		name: "Lara Croft",
		email: "l.croft@gmail.com",
		phone: "+250 785 678 901",
		status: "success",
		department: "Software Engineering",
		dateApplied: "01/04/2025",
	},
	{
		id: "8",
		name: "Dave Smith",
		email: "d.smith@gmail.com",
		phone: "+250 123 456 789",
		status: "success",
		department: "Software Engineering",
		dateApplied: "01/04/2025",
	},
	{
		id: "9",
		name: "Dave Smith",
		email: "d.smith@gmail.com",
		phone: "+250 123 456 789",
		status: "success",
		department: "Software Engineering",
		dateApplied: "01/04/2025",
	},
];

export interface ApplicantFilterParams {
	search?: string;
	status?: string;
	department?: string;
	fromDate?: Date;
	toDate?: Date;
	page?: number;
	limit?: number;
}

export function useApplicants(filterParams: ApplicantFilterParams = {}) {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	// Default to page 1 and 10 results per page
	const page = filterParams.page || 1;
	const limit = filterParams.limit || 10;

	// In a real application, we would fetch this data from the API
	const fetchApplicants = async () => {
		try {
			// Simulate API call
			// const response = await api.get(`/applicants?page=${page}&limit=${limit}`);
			// return response.data;

			// For now, return mock data with filtering
			const filteredApplicants = MOCK_APPLICANTS.filter((applicant) => {
				// Filter by search
				const matchesSearch =
					!filterParams.search ||
					applicant.name
						.toLowerCase()
						.includes(filterParams.search.toLowerCase()) ||
					applicant.email
						.toLowerCase()
						.includes(filterParams.search.toLowerCase());

				// Filter by status
				const matchesStatus =
					!filterParams.status ||
					filterParams.status === "all" ||
					applicant.status === filterParams.status;

				// Filter by department
				const matchesDepartment =
					!filterParams.department ||
					filterParams.department === "all" ||
					applicant.department === filterParams.department;

				// Filter by date range
				let matchesDateRange = true;
				if (filterParams.fromDate || filterParams.toDate) {
					const applicantDate = new Date(applicant.dateApplied);
					if (filterParams.fromDate && applicantDate < filterParams.fromDate)
						matchesDateRange = false;
					if (filterParams.toDate) {
						const nextDay = new Date(filterParams.toDate);
						nextDay.setDate(nextDay.getDate() + 1);
						if (applicantDate >= nextDay) matchesDateRange = false;
					}
				}

				return (
					matchesSearch &&
					matchesStatus &&
					matchesDepartment &&
					matchesDateRange
				);
			});

			// Create paginated response
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedApplicants = filteredApplicants.slice(
				startIndex,
				endIndex,
			);

			return {
				data: paginatedApplicants,
				meta: {
					total: filteredApplicants.length,
					page,
					limit,
					totalPages: Math.ceil(filteredApplicants.length / limit),
				},
			};
		} catch (error) {
			console.error("Error fetching applicants:", error);
			throw error;
		}
	};

	// Get summary statistics
	const getApplicantStats = () => {
		const total = MOCK_APPLICANTS.length;
		const success = MOCK_APPLICANTS.filter(
			(a) => a.status === "success",
		).length;
		const failed = MOCK_APPLICANTS.filter((a) => a.status === "fail").length;
		const waiting = MOCK_APPLICANTS.filter(
			(a) => a.status === "waiting",
		).length;

		// Count by department
		const departmentCounts = MOCK_APPLICANTS.reduce(
			(acc, curr) => {
				acc[curr.department] = (acc[curr.department] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return {
			total,
			success,
			failed,
			waiting,
			departments: departmentCounts,
		};
	};

	// Fetch a single applicant by ID
	const fetchApplicantById = async (id: string) => {
		// In a real app, this would be an API call
		// const response = await api.get(`/applicants/${id}`);
		// return response.data;

		// For now, find the applicant in the mock data
		const applicant = MOCK_APPLICANTS.find((a) => a.id === id);
		if (!applicant) throw new Error(`Applicant with ID ${id} not found`);
		return applicant;
	};

	// Delete an applicant
	const deleteApplicant = useMutation({
		mutationFn: async (id: string) => {
			// In a real app, this would be an API call
			// await api.delete(`/applicants/${id}`);
			// return id;

			// For mock data, simulate a successful deletion after a delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Remove the applicant from our mock data (for demonstration purposes only)
			const index = MOCK_APPLICANTS.findIndex((a) => a.id === id);
			if (index !== -1) {
				MOCK_APPLICANTS.splice(index, 1);
			}

			return id;
		},
		onSuccess: (id) => {
			queryClient.invalidateQueries({ queryKey: ["applicants"] });
			toast({
				title: "Success",
				description: `Applicant with id: ${id}, has been deleted successfully.`,
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: `Failed to delete applicant: ${error}. Please try again!`,
				variant: "destructive",
			});
		},
	});

	// Create a new applicant
	const createApplicant = useMutation({
		mutationFn: async (newApplicant: Partial<Applicant>) => {
			// In a real app, this would be an API call
			// const response = await api.post("/applicants", newApplicant);
			// return response.data;

			// For mock data, simulate a successful creation after a delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Ensure we have all required fields with defaults if not provided
			const createdApplicant: Applicant = {
				id: `${MOCK_APPLICANTS.length + 1}`,
				name: newApplicant.name || "New Applicant",
				email: newApplicant.email || "new@example.com",
				phone: newApplicant.phone,
				status: newApplicant.status || "waiting",
				department: newApplicant.department || "Design",
				dateApplied: new Date().toLocaleDateString(),
				...newApplicant,
			};

			// In a real app, the backend would handle this
			MOCK_APPLICANTS.push(createdApplicant);

			return createdApplicant;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applicants"] });
			toast({
				title: "Success",
				description: `Applicant ${data.name} has been created successfully.`,
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: `Failed to create applicant: ${error} Please try again.`,
				variant: "destructive",
			});
		},
	});

	// Update an existing applicant
	const updateApplicant = useMutation({
		mutationFn: async ({
			id,
			data,
		}: { id: string; data: Partial<Applicant> }) => {
			// In a real app, this would be an API call
			// const response = await api.put(`/applicants/${id}`, data);
			// return response.data;

			// For mock data, simulate a successful update after a delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			const applicantIndex = MOCK_APPLICANTS.findIndex((a) => a.id === id);
			if (applicantIndex === -1)
				throw new Error(`Applicant with ID ${id} not found`);

			// Update the applicant in the mock data
			const updatedApplicant: Applicant = {
				...MOCK_APPLICANTS[applicantIndex],
				...data,
				lastUpdated: new Date().toLocaleDateString(),
			};

			// Replace the old applicant with the updated one
			MOCK_APPLICANTS[applicantIndex] = updatedApplicant;

			return updatedApplicant;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applicants"] });
			toast({
				title: "Success",
				description: `Applicant ${data.name} has been updated successfully.`,
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: `Failed to update applicant: ${error}. Please try again!`,
				variant: "destructive",
			});
		},
	});

	// Export the queries and mutations
	return {
		applicants: useQuery({
			queryKey: ["applicants", page, limit, filterParams],
			queryFn: fetchApplicants,
		}),
		stats: getApplicantStats(),
		getApplicantById: (id: string) => fetchApplicantById(id),
		deleteApplicant,
		createApplicant,
		updateApplicant,
	};
}
