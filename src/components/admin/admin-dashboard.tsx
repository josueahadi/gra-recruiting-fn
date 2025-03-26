"use client";

import DataTable from "@/components/common/data-table";
import SearchBar from "@/components/common/search-bar";
import DateRangePicker from "@/components/common/date-range-picker";
import FilterDropdown, {
	type FilterOption,
} from "@/components/common/filter-dropdown";
import StatCard from "@/components/common/stat-card";
import StatusBadge from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Trash2 } from "lucide-react";
import React, { useState } from "react";

// Mock data for demonstration
const MOCK_APPLICANTS = [
	{
		id: "1",
		name: "Johnny Doe",
		email: "johndoe12@yahoo.com",
		status: "success",
		department: "Design",
		date: "12/06/2025",
	},
	{
		id: "2",
		name: "Jack Black",
		email: "johndoe12@outlook.com",
		status: "success",
		department: "Development",
		date: "12/06/2025",
	},
	{
		id: "3",
		name: "James Brown",
		email: "johndoe12@hotmail.com",
		status: "success",
		department: "Design",
		date: "12/06/2025",
	},
	{
		id: "4",
		name: "Jack Dixon",
		email: "johndoe12@outlook.com",
		status: "fail",
		department: "Accounting",
		date: "12/06/2025",
	},
	{
		id: "5",
		name: "Jonny Deer",
		email: "johndoe12@hotmail.com",
		status: "waiting",
		department: "Marketing",
		date: "12/06/2025",
	},
];

const AdminDashboard = () => {
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);

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

	// Filter options
	const statusOptions: FilterOption[] = [
		{ value: "all", label: "Status - All" },
		{ value: "success", label: "Success" },
		{ value: "fail", label: "Fail" },
		{ value: "waiting", label: "Waiting" },
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
			cell: ({ row }: any) => (
				<StatusBadge status={row.original.status as any} />
			),
		},
		{
			accessorKey: "department",
			header: "Department",
		},
		{
			accessorKey: "date",
			header: "Applied Date",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }: any) => (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="text-blue-500 hover:text-blue-700"
					>
						<Eye className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-red-500 hover:text-red-700"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-amber-500 hover:text-amber-700"
					>
						<FileEdit className="h-4 w-4" />
					</Button>
				</div>
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

		// Filter by date range
		let matchesDateRange = true;
		if (fromDate || toDate) {
			const applicantDate = new Date(applicant.date);
			if (fromDate && applicantDate < fromDate) matchesDateRange = false;
			if (toDate) {
				const nextDay = new Date(toDate);
				nextDay.setDate(nextDay.getDate() + 1);
				if (applicantDate >= nextDay) matchesDateRange = false;
			}
		}

		return matchesSearch && matchesStatus && matchesDateRange;
	});

	return (
		<div className="space-y-8">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatCard
					title="Applicants Applied"
					value="201"
					icon={
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Applicants Applied</title>
							<path
								d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					}
				/>
				<StatCard
					title="Exams Completed"
					value="124"
					icon={
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Exams Completed</title>
							<path
								d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M14 2V8H20"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M16 13H8"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M16 17H8"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M10 9H9H8"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					}
				/>
				<StatCard
					title="Questions Added"
					value="43"
					icon={
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Questions Added</title>
							<path
								d="M8.22766 9C8.77678 7.83481 10.2584 7 12.0001 7C14.2092 7 16.0001 8.34315 16.0001 10C16.0001 11.3994 14.7224 12.5751 12.9943 12.9066C12.4519 13.0106 12.0001 13.4477 12.0001 14"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<circle cx="12" cy="17" r="1" fill="currentColor" />
							<circle
								cx="12"
								cy="12"
								r="9"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					}
				/>
			</div>

			{/* Recent Applicants */}
			<div className="bg-white rounded-lg p-6">
				<h2 className="text-xl font-medium text-blue-500 mb-6">
					Recent Applicants
				</h2>

				{/* Filter Controls */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="w-full md:w-1/3">
						<SearchBar
							onSearch={handleSearch}
							placeholder="Search name or email..."
							initialValue={searchValue}
						/>
					</div>

					<div className="w-full md:w-1/5">
						<FilterDropdown
							options={statusOptions}
							value={statusFilter}
							onChange={handleStatusChange}
						/>
					</div>

					<div className="w-full md:w-1/5">
						<DateRangePicker
							fromDate={fromDate}
							toDate={toDate}
							onFromDateChange={setFromDate}
							onToDateChange={setToDate}
							fromPlaceholder="From Date"
							toPlaceholder="To Date"
						/>
					</div>

					<div className="flex items-end">
						<Button
							variant="outline"
							onClick={handleClearFilters}
							className="h-10"
							disabled={
								!searchValue && statusFilter === "all" && !fromDate && !toDate
							}
						>
							Clear
						</Button>
					</div>
				</div>

				{/* Applicants Table */}
				<DataTable
					columns={columns}
					data={filteredApplicants}
					searchColumn="name"
					showSearch={false}
				/>
			</div>
		</div>
	);
};

export default AdminDashboard;
