/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContentCard from "@/components/admin/common/content-card";
import StatsSection, {
	type StatCardProps,
} from "@/components/admin/common/stats-section";
import TableActions from "@/components/admin/common/table-actions";
import DataTable from "@/components/common/data-table";
import StatusBadge from "@/components/common/status-badge";
import { CircleHelp, FileText, Users } from "lucide-react";
import { useState } from "react";
import FilterBar, { type FilterConfig } from "./common/filter-bar";
import { useRouter } from "next/navigation";
import { useApplicants } from "@/hooks/use-applicants";
import { useQuestions } from "@/hooks/use-questions";
import { useResults } from "@/hooks/use-results";

const AdminDashboard = () => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);

	const { applicants, stats: applicantStats } = useApplicants({
		search: searchValue,
		status: statusFilter,
		fromDate,
		toDate,
		limit: 5,
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
					{ value: "success", label: "Success" },
					{ value: "fail", label: "Fail" },
					{ value: "waiting", label: "Waiting" },
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
						data={applicants.data?.data || []}
						searchColumn="name"
						showSearch={false}
					/>
				)}
			</ContentCard>
		</div>
	);
};

export default AdminDashboard;
