"use client";

import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import TableActions from "@/components/admin/common/table-actions";
import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import StatusBadge, { type StatusType } from "@/components/common/status-badge";
import StatsSection, { type StatCardProps } from "./common/stats-section";
import { Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApplicants } from "@/hooks/use-applicants";
import type { ColumnDef } from "@tanstack/react-table";

type TimeFrame =
	| "Today"
	| "Yesterday"
	| "ThisWeek"
	| "LastWeek"
	| "ThisMonth"
	| "LastMonth"
	| "ThisYear"
	| "LastYear"
	| "none";

interface Applicant {
	userId: number;
	name: string;
	email: string;
	phoneNumber: string;
	status: string | null;
	department: string | null;
	appliedAt: string;
	examStatus: string | null;
}

const ApplicantsManagement = () => {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [scoreStatus, setScoreStatus] = useState<
		"PENDING" | "PASSED" | "FAILED" | "all"
	>("all");
	const [applicantStatus, setApplicantStatus] = useState<
		"ACTIVE" | "ARCHIVED" | "all"
	>("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);
	const [presetTimeFrame, setPresetTimeFrame] = useState<TimeFrame>("none");
	const [sortingOptions, setSortingOptions] = useState<"ASC" | "DESC">("DESC");

	const [showAll, setShowAll] = useState(false);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [applicantToDelete, setApplicantToDelete] = useState<string | null>(
		null,
	);

	const { applicants, stats, deleteApplicant } = useApplicants({
		page: showAll ? undefined : page,
		take: showAll ? undefined : pageSize,
		searchTerm: searchValue,
		scoreStatus: scoreStatus === "all" ? undefined : scoreStatus,
		applicantStatus: applicantStatus === "all" ? undefined : applicantStatus,
		fromDate: fromDate ? fromDate.toISOString().slice(0, 10) : undefined,
		toDate: toDate ? toDate.toISOString().slice(0, 10) : undefined,
		presetTimeFrame: presetTimeFrame !== "none" ? presetTimeFrame : undefined,
		sortingOptions,
	});

	const handleSearch = (value: string) => {
		setSearchInput(value);
		setSearchValue(value);
	};

	const handleScoreStatusChange = (value: string) => {
		setScoreStatus(value as "PENDING" | "PASSED" | "FAILED" | "all");
	};

	const handleApplicantStatusChange = (value: string) => {
		setApplicantStatus(value as "ACTIVE" | "ARCHIVED" | "all");
	};

	const handleClearFilters = () => {
		setSearchInput("");
		setSearchValue("");
		setScoreStatus("all");
		setApplicantStatus("all");
		setFromDate(undefined);
		setToDate(undefined);
		setPresetTimeFrame("none");
		setSortingOptions("DESC");
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

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setPage(1);
	};

	const statsData: StatCardProps[] = [
		{
			title: "Total Applicants",
			value: stats.total.toString(),
			icon: <Users className="w-8 h-8" />,
		},
		{
			title: "Passed",
			value: stats.success.toString(),
			icon: <CheckCircle className="w-8 h-8" />,
		},
		{
			title: "Failed",
			value: stats.failed.toString(),
			icon: <XCircle className="w-8 h-8" />,
		},
		{
			title: "Pending",
			value: stats.waiting.toString(),
			icon: <Clock className="w-8 h-8" />,
		},
	];

	const filterConfigs: FilterConfig[] = [
		{
			type: "search",
			props: {
				onSearch: handleSearch,
				placeholder: "Search applicants...",
				initialValue: searchInput,
			},
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "all", label: "Score Status - All" },
					{ value: "PENDING", label: "Pending" },
					{ value: "PASSED", label: "Passed" },
					{ value: "FAILED", label: "Failed" },
				],
				value: scoreStatus,
				onChange: handleScoreStatusChange,
			},
			width: "w-full md:w-1/5",
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "all", label: "Status - All" },
					{ value: "ACTIVE", label: "Active" },
					{ value: "ARCHIVED", label: "Archived" },
				],
				value: applicantStatus,
				onChange: handleApplicantStatusChange,
			},
			width: "w-full md:w-1/5",
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
			width: "w-full md:w-1/4",
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "none", label: "Timeframe - All" },
					{ value: "Today", label: "Today" },
					{ value: "Yesterday", label: "Yesterday" },
					{ value: "ThisWeek", label: "This Week" },
					{ value: "LastWeek", label: "Last Week" },
					{ value: "ThisMonth", label: "This Month" },
					{ value: "LastMonth", label: "Last Month" },
					{ value: "ThisYear", label: "This Year" },
					{ value: "LastYear", label: "Last Year" },
				],
				value: presetTimeFrame,
				onChange: (value: string) => setPresetTimeFrame(value as TimeFrame),
			},
			width: "w-full md:w-1/5",
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "DESC", label: "Newest to Oldest (DESC)" },
					{ value: "ASC", label: "Oldest to Newest (ASC)" },
				],
				value: sortingOptions,
				onChange: setSortingOptions,
			},
			width: "w-full md:w-1/5",
		},
		{
			type: "button",
			props: {
				label: showAll ? "Show Paginated" : "Show All",
				onClick: () => setShowAll((prev) => !prev),
				className: "ml-2",
			},
		},
	];

	const getStatusType = (status: string | null): StatusType => {
		if (!status) return "pending";
		const lowerStatus = status.toLowerCase();
		if (lowerStatus === "passed") return "success";
		if (lowerStatus === "failed") return "fail";
		if (lowerStatus === "active") return "waiting";
		if (lowerStatus === "archived") return "default";
		return "pending";
	};

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

	return (
		<div className="space-y-6">
			<StatsSection stats={statsData} />

			<ContentCard title="Applicants">
				<FilterBar
					filters={filterConfigs}
					onClear={handleClearFilters}
					clearDisabled={
						!searchInput &&
						scoreStatus === "all" &&
						applicantStatus === "all" &&
						!fromDate &&
						!toDate &&
						presetTimeFrame === "none"
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
