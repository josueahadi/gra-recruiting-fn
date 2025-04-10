/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import TableActions, {
	type ActionIcon,
} from "@/components/admin/common/table-actions";
import DataTable from "@/components/common/data-table";
import StatusBadge from "@/components/common/status-badge";
import StatsSection, { type StatCardProps } from "./common/stats-section";
import { BarChart, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import ResultDetail from "./results/result-detail";
import { useResults, type TestResult } from "@/hooks/use-results";

const ResultsManagement = () => {
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);
	const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Use the results hook with filters
	const { results, stats, triggerAIGrading } = useResults({
		search: searchValue,
		status: statusFilter,
		fromDate,
		toDate,
	});

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

	const handleViewResult = (id: string) => {
		if (results.data) {
			const result = results.data.data.find((r) => r.id === id);
			if (result) {
				setSelectedResult(result);
				setIsDetailOpen(true);
			}
		}
	};

	const handleTriggerAIGrading = (id: string) => {
		triggerAIGrading.mutate(id);
	};

	const statsData: StatCardProps[] = [
		{
			title: "Total Submissions",
			value: stats.total.toString(),
			icon: <BarChart className="w-8 h-8" />,
		},
		{
			title: "Passed",
			value: stats.passed.toString(),
			icon: <CheckCircle className="w-8 h-8" />,
		},
		{
			title: "Awaiting Grading",
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
			accessorKey: "applicantName",
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
			accessorKey: "score",
			header: "Score",
			cell: ({ row }: { row: { original: { score: number | null } } }) => (
				<div className="text-center">
					{row.original.score !== null ? (
						<div className="px-3 py-1 rounded-full bg-gray-100 inline-block">
							{row.original.score}
						</div>
					) : (
						<span className="text-gray-400">-</span>
					)}
				</div>
			),
		},
		{
			accessorKey: "submittedAt",
			header: "Submitted",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }: { row: { original: TestResult } }) => (
				<TableActions
					actions={[
						{
							icon: "view",
							onClick: () => handleViewResult(row.original.id),
							tooltip: "View Details",
						},
						...(row.original.status === "waiting"
							? [
									{
										icon: "robot" as ActionIcon,
										onClick: () => handleTriggerAIGrading(row.original.id),
										tooltip: "Trigger AI Grading",
									},
								]
							: []),
					]}
				/>
			),
		},
	];

	return (
		<div className="space-y-8">
			<StatsSection stats={statsData} />

			<ContentCard title="Exam Results">
				<FilterBar
					filters={filterConfigs}
					onClear={handleClearFilters}
					clearDisabled={
						!searchValue && statusFilter === "all" && !fromDate && !toDate
					}
				/>

				{results.isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
					</div>
				) : results.error ? (
					<div className="py-8 text-center text-red-500">
						Error loading results. Please try again.
					</div>
				) : (
					<DataTable
						columns={columns}
						data={results.data?.data || []}
						searchColumn="applicantName"
						showSearch={false}
					/>
				)}
			</ContentCard>

			{selectedResult && (
				<ResultDetail
					isOpen={isDetailOpen}
					onClose={() => setIsDetailOpen(false)}
					result={selectedResult}
				/>
			)}
		</div>
	);
};

export default ResultsManagement;
