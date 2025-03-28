"use client";

import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import TableActions from "@/components/admin/common/table-actions";
import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import StatusBadge, { type StatusType } from "@/components/common/status-badge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const MOCK_APPLICANTS = [
	{
		id: "1",
		name: "Johnny Doe",
		email: "johndoe12@yahoo.com",
		phone: "+250 781 234 567",
		status: "success" as StatusType,
		department: "Design",
		dateApplied: "12/06/2025",
	},
	{
		id: "2",
		name: "Jack Black",
		email: "johndoe12@outlook.com",
		phone: "+250 782 345 678",
		status: "success" as StatusType,
		department: "Development",
		dateApplied: "12/06/2025",
	},
	{
		id: "3",
		name: "James Brown",
		email: "johndoe12@hotmail.com",
		phone: "+250 783 456 789",
		status: "success" as StatusType,
		department: "Design",
		dateApplied: "12/06/2025",
	},
	{
		id: "4",
		name: "Jack Dixon",
		email: "johndoe12@outlook.com",
		phone: "+250 784 567 890",
		status: "fail" as StatusType,
		department: "Accounting",
		dateApplied: "12/06/2025",
	},
	{
		id: "5",
		name: "Jonny Deer",
		email: "johndoe12@hotmail.com",
		phone: "+250 785 678 901",
		status: "waiting" as StatusType,
		department: "Marketing",
		dateApplied: "12/06/2025",
	},
];

const ApplicantsManagement = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [departmentFilter, setDepartmentFilter] = useState("all");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [applicantToDelete, setApplicantToDelete] = useState<string | null>(
		null,
	);

	const handleSearch = (value: string) => {
		setSearchValue(value);
	};

	const handleStatusChange = (value: string) => {
		setStatusFilter(value);
	};

	const handleDepartmentChange = (value: string) => {
		setDepartmentFilter(value);
	};

	const handleClearFilters = () => {
		setSearchValue("");
		setStatusFilter("all");
		setDepartmentFilter("all");
		setFromDate(undefined);
		setToDate(undefined);
	};

	// View applicant by navigating to their profile page
	const handleViewApplicant = (id: string) => {
		router.push(`/admin/applicants/${id}`);
	};

	// Navigate to edit page (could be same as view page with edit state)
	const handleEditApplicant = (id: string) => {
		router.push(`/admin/applicants/${id}?edit=true`);
	};

	// Show delete confirmation
	const handleDeleteApplicant = (id: string) => {
		setApplicantToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	// Confirm deletion
	const confirmDeleteApplicant = () => {
		toast({
			title: "Applicant deleted",
			description: `Applicant ${applicantToDelete} has been deleted successfully.`,
		});

		setIsDeleteDialogOpen(false);
		setApplicantToDelete(null);
		// In a real app, you would call an API here
	};

	// Filter configurations
	const filterConfigs: FilterConfig[] = [
		{
			type: "search",
			props: {
				onSearch: handleSearch,
				placeholder: "Search name or email...",
				initialValue: searchValue,
			},
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "all", label: "Status - All" },
					{ value: "success", label: "Success" },
					{ value: "fail", label: "Failed" },
					{ value: "waiting", label: "Waiting" },
				],
				value: statusFilter,
				onChange: handleStatusChange,
			},
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "all", label: "Department - All" },
					{ value: "Design", label: "Design" },
					{ value: "Development", label: "Development" },
					{ value: "Marketing", label: "Marketing" },
					{ value: "Accounting", label: "Accounting" },
				],
				value: departmentFilter,
				onChange: handleDepartmentChange,
			},
		},
		{
			type: "dateRange",
			props: {
				fromDate,
				toDate,
				onFromDateChange: setFromDate,
				onToDateChange: setToDate,
				fromPlaceholder: "From Date",
				toPlaceholder: "To Date",
			},
		},
	];

	// Table columns
	const columns = [
		{
			accessorKey: "name",
			header: "Applicant Name",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }: { row: { original: { status: StatusType } } }) => (
				<StatusBadge status={row.original.status} />
			),
		},
		{
			accessorKey: "department",
			header: "Department",
		},
		{
			accessorKey: "dateApplied",
			header: "Applied Date",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }: { row: { original: { id: string } } }) => (
				<TableActions
					actions={[
						{
							icon: "view",
							onClick: () => handleViewApplicant(row.original.id),
							tooltip: "View Details",
						},
						{
							icon: "edit",
							onClick: () => handleEditApplicant(row.original.id),
							tooltip: "Edit",
						},
						{
							icon: "delete",
							onClick: () => handleDeleteApplicant(row.original.id),
							tooltip: "Delete",
						},
					]}
				/>
			),
		},
	];

	// Filter applicants based on search and filters
	const filteredApplicants = MOCK_APPLICANTS.filter((applicant) => {
		// Filter by search
		const matchesSearch =
			searchValue === "" ||
			applicant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			applicant.email.toLowerCase().includes(searchValue.toLowerCase());

		// Filter by status
		const matchesStatus =
			statusFilter === "all" || applicant.status === statusFilter;

		// Filter by department
		const matchesDepartment =
			departmentFilter === "all" || applicant.department === departmentFilter;

		// Filter by date range
		let matchesDateRange = true;
		if (fromDate || toDate) {
			const applicantDate = new Date(applicant.dateApplied);
			if (fromDate && applicantDate < fromDate) matchesDateRange = false;
			if (toDate) {
				const nextDay = new Date(toDate);
				nextDay.setDate(nextDay.getDate() + 1);
				if (applicantDate >= nextDay) matchesDateRange = false;
			}
		}

		return (
			matchesSearch && matchesStatus && matchesDepartment && matchesDateRange
		);
	});

	return (
		<div className="space-y-6">
			<ContentCard title="Applicants">
				{/* Filter Controls */}
				<FilterBar
					filters={filterConfigs}
					onClear={handleClearFilters}
					clearDisabled={
						!searchValue &&
						statusFilter === "all" &&
						departmentFilter === "all" &&
						!fromDate &&
						!toDate
					}
				/>

				{/* Applicants Table */}
				<DataTable
					columns={columns}
					data={filteredApplicants}
					searchColumn="name"
					showSearch={false}
				/>
			</ContentCard>

			{/* Delete Confirmation Dialog */}
			<ConfirmationDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={confirmDeleteApplicant}
				title="Delete Applicant"
				message="Are you sure you want to delete this applicant? This action cannot be undone."
				confirmLabel="Delete"
				cancelLabel="Cancel"
				type="delete"
			/>
		</div>
	);
};

export default ApplicantsManagement;
