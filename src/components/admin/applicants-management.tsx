/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import TableActions from "@/components/admin/common/table-actions";
import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import StatusBadge from "@/components/common/status-badge";
import StatsSection, { type StatCardProps } from "./common/stats-section";
import { Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApplicants, type Applicant } from "@/hooks/use-applicants";

const ApplicantsManagement = () => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [departmentFilter, setDepartmentFilter] = useState("all");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [applicantToDelete, setApplicantToDelete] = useState<string | null>(
		null,
	);

	const { applicants, stats, deleteApplicant } = useApplicants({
		search: searchValue,
		status: statusFilter,
		department: departmentFilter,
		fromDate,
		toDate,
	});

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

	const handleViewApplicant = (id: string) => {
		router.push(`/admin/applicants/${id}`);
	};

	const handleEditApplicant = (id: string) => {
		router.push(`/admin/applicants/${id}?edit=true`);
	};

	const handleDeleteApplicant = (id: string) => {
		setApplicantToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteApplicant = () => {
		if (applicantToDelete) {
			deleteApplicant.mutate(applicantToDelete, {
				onSuccess: () => {
					setIsDeleteDialogOpen(false);
					setApplicantToDelete(null);
				},
			});
		}
	};

	const statsData: StatCardProps[] = [
		{
			title: "Total Applicants",
			value: stats.total.toString(),
			icon: <Users className="w-8 h-8" />,
		},
		{
			title: "Successful",
			value: stats.success.toString(),
			icon: <CheckCircle className="w-8 h-8" />,
		},
		{
			title: "Failed",
			value: stats.failed.toString(),
			icon: <XCircle className="w-8 h-8" />,
		},
		{
			title: "Waiting",
			value: stats.waiting.toString(),
			icon: <Clock className="w-8 h-8" />,
		},
	];

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
			cell: ({ row }: { row: { original: { status: string } } }) => (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				<StatusBadge status={row.original.status as any} />
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
			cell: ({ row }: { row: { original: Applicant } }) => (
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

	return (
		<div className="space-y-6">
			<StatsSection stats={statsData} gridClassName="md:grid-cols-4" />

			<ContentCard title="Applicants">
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

				{applicants.isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
					</div>
				) : applicants.error ? (
					<div className="py-8 text-center text-red-500">
						Error loading applicants. Please try again.
					</div>
				) : (
					<DataTable
						columns={columns}
						data={applicants.data?.data || []}
						searchColumn="name"
						showSearch={false}
					/>
				)}
			</ContentCard>

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
