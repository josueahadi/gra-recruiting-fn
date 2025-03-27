/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import TableActions from "@/components/admin/common/table-actions";
import DataTable from "@/components/common/data-table";
import StatusBadge from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ResultDetail from "./results/result-detail";
import ResultGrading from "./results/result-grading";
import StatsSection, { type StatCardProps } from "./common/stats-section";
import { BarChart, CheckCircle, Clock } from "lucide-react";

// Mock data for demonstration
const MOCK_RESULTS = [
	{
		id: "1",
		applicantName: "John Doe",
		email: "johndoe12@yahoo.com",
		status: "waiting",
		score: null,
		submittedAt: "10/06/2025",
	},
	{
		id: "2",
		applicantName: "Jonathon Smith",
		email: "johndoe12@hotmail.com",
		status: "success",
		score: 86,
		submittedAt: "08/06/2025",
	},
	{
		id: "3",
		applicantName: "Jane Roe",
		email: "johndoe12@yahoo.com",
		status: "success",
		score: 86,
		submittedAt: "07/06/2025",
	},
	{
		id: "4",
		applicantName: "Jack Black",
		email: "johndoe12@gmail.com",
		status: "success",
		score: 86,
		submittedAt: "06/06/2025",
	},
	{
		id: "5",
		applicantName: "Mr. John Doe",
		email: "johndoe12@hotmail.com",
		status: "fail",
		score: 55,
		submittedAt: "05/06/2025",
	},
	{
		id: "6",
		applicantName: "Jack Doe",
		email: "johndoe12@yahoo.com",
		status: "fail",
		score: 48,
		submittedAt: "04/06/2025",
	},
	{
		id: "7",
		applicantName: "Jonathan Doe",
		email: "johndoe12@gmail.com",
		status: "success",
		score: 86,
		submittedAt: "03/06/2025",
	},
	{
		id: "8",
		applicantName: "Jake Doe",
		email: "johndoe12@hotmail.com",
		status: "waiting",
		score: null,
		submittedAt: "02/06/2025",
	},
];

const ResultsManagement = () => {
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [selectedResult, setSelectedResult] = useState<any | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isGradingOpen, setIsGradingOpen] = useState(false);

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
		const result = MOCK_RESULTS.find((r) => r.id === id);
		if (result) {
			setSelectedResult(result);
			setIsDetailOpen(true);
		}
	};

	const handleGradeResult = (id: string) => {
		const result = MOCK_RESULTS.find((r) => r.id === id);
		if (result) {
			setSelectedResult(result);
			setIsGradingOpen(true);
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleSubmitGrade = (results: any) => {
		console.log("Submitting grade", results);
		// In a real app, you would call an API to submit the grade
		setIsGradingOpen(false);
	};

	// Stats configuration for the stats section
	const statsData: StatCardProps[] = [
		{
			title: "Total Submissions",
			value: "124",
			icon: <BarChart className="w-8 h-8" />,
		},
		{
			title: "Passed",
			value: "86",
			icon: <CheckCircle className="w-8 h-8" />,
		},
		{
			title: "Awaiting Grading",
			value: "12",
			icon: <Clock className="w-8 h-8" />,
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

	// Table columns
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
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			cell: ({ row }: any) => (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				<StatusBadge status={row.original.status as any} />
			),
		},
		{
			accessorKey: "score",
			header: "Score",
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			cell: ({ row }: any) => (
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
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			cell: ({ row }: any) => (
				<div className="flex items-center space-x-2">
					<TableActions
						actions={[
							{
								icon: "view",
								onClick: () => handleViewResult(row.original.id),
								tooltip: "View Details",
							},
						]}
					/>
					{row.original.status === "waiting" && (
						<Button
							size="sm"
							onClick={() => handleGradeResult(row.original.id)}
							className="ml-2"
						>
							Mark
						</Button>
					)}
				</div>
			),
		},
	];

	// Filter results based on search and filters
	const filteredResults = MOCK_RESULTS.filter((result) => {
		// Filter by search
		const matchesSearch =
			searchValue === "" ||
			result.applicantName.toLowerCase().includes(searchValue.toLowerCase()) ||
			result.email.toLowerCase().includes(searchValue.toLowerCase());

		// Filter by status
		const matchesStatus =
			statusFilter === "all" || result.status === statusFilter;

		// Filter by date range
		let matchesDateRange = true;
		if (fromDate || toDate) {
			const resultDate = new Date(result.submittedAt);
			if (fromDate && resultDate < fromDate) matchesDateRange = false;
			if (toDate) {
				const nextDay = new Date(toDate);
				nextDay.setDate(nextDay.getDate() + 1);
				if (resultDate >= nextDay) matchesDateRange = false;
			}
		}

		return matchesSearch && matchesStatus && matchesDateRange;
	});

	return (
		<div className="space-y-8">
			{/* Stats Cards */}
			<StatsSection stats={statsData} />

			<ContentCard title="Exam Results">
				{/* Filter Controls */}
				<FilterBar
					filters={filterConfigs}
					onClear={handleClearFilters}
					clearDisabled={
						!searchValue && statusFilter === "all" && !fromDate && !toDate
					}
				/>

				{/* Results Table */}
				<DataTable
					columns={columns}
					data={filteredResults}
					searchColumn="applicantName"
					showSearch={false}
				/>
			</ContentCard>

			{/* Result Detail Dialog */}
			{selectedResult && (
				<ResultDetail
					isOpen={isDetailOpen}
					onClose={() => setIsDetailOpen(false)}
					result={selectedResult}
				/>
			)}

			{/* Result Grading Dialog */}
			{selectedResult && (
				<ResultGrading
					isOpen={isGradingOpen}
					onClose={() => setIsGradingOpen(false)}
					onSubmit={handleSubmitGrade}
					applicant={selectedResult}
				/>
			)}
		</div>
	);
};

export default ResultsManagement;
