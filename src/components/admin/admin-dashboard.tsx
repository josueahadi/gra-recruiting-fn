/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContentCard from "@/components/admin/common/content-card";
import StatsSection, {
	type StatCardProps,
} from "@/components/admin/common/stats-section";
import TableActions from "@/components/admin/common/table-actions";
import DataTable from "@/components/common/data-table";
import StatusBadge, { type StatusType } from "@/components/common/status-badge";
import { CircleHelp, FileText, Users } from "lucide-react";
import { useState } from "react";
import FilterBar, { type FilterConfig } from "./common/filter-bar";
import { useRouter } from "next/navigation";
import { useApplicants, type Applicant } from "@/hooks/use-applicants";
import { useQuestions } from "@/hooks/use-questions";
import { useResults } from "@/hooks/use-results";
import type { ColumnDef } from "@tanstack/react-table";

const AdminDashboard = () => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const { applicants, stats: applicantStats } = useApplicants({
		searchTerm: searchValue,
		scoreStatus:
			statusFilter === "all"
				? undefined
				: (statusFilter as "PENDING" | "PASSED" | "FAILED"),
		fromDate: fromDate?.toISOString().split("T")[0],
		toDate: toDate?.toISOString().split("T")[0],
		page,
		take: pageSize,
	});

	const { stats: resultsStats } = useResults();
	const { metadata: questionsMetadata } = useQuestions();

	const handleSearch = (value: string) => {
		setSearchValue(value);
	};

	const handleStatusChange = (value: string) => {
		setStatusFilter(value);
	};

	const handleClearFilters = () => {
		setSearchValue("");
		setStatusFilter("all");
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
		router.push(`/admin/applicants?delete=${id}`);
	};

	const getStatusType = (status: string | null): StatusType => {
		if (!status) return "pending";
		const lowerStatus = status.toLowerCase();
		if (lowerStatus === "passed") return "success";
		if (lowerStatus === "failed") return "fail";
		if (lowerStatus === "active") return "waiting";
		if (lowerStatus === "archived") return "default";
		return "pending";
	};

	const statsData: StatCardProps[] = [
		{
			title: "Applicants Applied",
			value: applicantStats.total.toString(),
			icon: <Users className="w-8 h-8" />,
		},
		{
			title: "Exams Completed",
			value: resultsStats.total.toString(),
			icon: <FileText className="w-8 h-8" />,
		},
		{
			title: "Questions Added",
			value: questionsMetadata.total.toString(),
			icon: <CircleHelp className="w-8 h-8" />,
		},
	];

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
					{ value: "PASSED", label: "Passed" },
					{ value: "FAILED", label: "Failed" },
					{ value: "PENDING", label: "Pending" },
				],
				value: statusFilter,
				onChange: handleStatusChange,
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
	const columns: ColumnDef<Applicant>[] = [
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
			header: "Email Status",
			cell: ({ row }) => (
				<StatusBadge status={getStatusType(row.original.status)} />
			),
		},
		{
			accessorKey: "examStatus",
			header: "Exam Status",
			cell: ({ row }) => (
				<StatusBadge status={getStatusType(row.original.examStatus)} />
			),
		},
		{
			accessorKey: "department",
			header: "Department",
		},
		{
			accessorKey: "appliedAt",
			header: "Applied Date",
			cell: ({ row }) => {
				const date = new Date(row.original.appliedAt);
				return date.toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
				});
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<TableActions
					actions={[
						{
							icon: "view",
							onClick: () =>
								handleViewApplicant(row.original.userId.toString()),
							tooltip: "View Details",
						},
						{
							icon: "edit",
							onClick: () =>
								handleEditApplicant(row.original.userId.toString()),
							tooltip: "Edit",
						},
						{
							icon: "delete",
							onClick: () =>
								handleDeleteApplicant(row.original.userId.toString()),
							tooltip: "Delete",
						},
					]}
				/>
			),
		},
	];

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setPage(1); // Reset to first page when page size changes
	};

	return (
		<div className="space-y-8">
			<StatsSection stats={statsData} />

			<ContentCard title="Recent Applicants">
				<FilterBar
					filters={filterConfigs}
					onClear={handleClearFilters}
					clearDisabled={
						!searchValue && statusFilter === "all" && !fromDate && !toDate
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
						data={applicants.data?.Applicants || []}
						page={page}
						pageSize={pageSize}
						totalItems={applicants.data?.stats.totalApplicants || 0}
						totalPages={applicants.data?.pageCount || 1}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
					/>
				)}
			</ContentCard>
		</div>
	);
};

export default AdminDashboard;
