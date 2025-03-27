"use client";

import DataTable from "@/components/common/data-table";
import type { FilterOption } from "@/components/common/filter-dropdown";
import StatusBadge from "@/components/common/status-badge";
import { CircleHelp, FileText, Users } from "lucide-react";
import React, { useState } from "react";
import ContentCard from "@/components/admin/common/content-card";
import FilterBar, { type FilterConfig } from "./common/filter-bar";
import StatsSection, {
	type StatCardProps,
} from "@/components/admin/common/stats-section";
import TableActions from "@/components/admin/common/table-actions";

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

	// Stats configuration for the stats section
	const statsData: StatCardProps[] = [
		{
			title: "Applicants Applied",
			value: "201",
			icon: <Users className="w-8 h-8" />,
		},
		{
			title: "Exams Completed",
			value: "124",
			icon: <FileText className="w-8 h-8" />,
		},
		{
			title: "Questions Added",
			value: "43",
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
				<TableActions
					actions={[
						{
							icon: "view",
							onClick: () => console.log("View applicant", row.original.id),
							tooltip: "View Details",
						},
						{
							icon: "delete",
							onClick: () => console.log("Delete applicant", row.original.id),
							tooltip: "Delete",
						},
						{
							icon: "edit",
							onClick: () => console.log("Edit applicant", row.original.id),
							tooltip: "Edit",
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
			<StatsSection stats={statsData} />
			{/* Recent Applicants */}
			<ContentCard title="Recent Applicants">
				{/* Filter Controls */}
				<FilterBar
					filters={filterConfigs}
					onClear={handleClearFilters}
					clearDisabled={
						!searchValue && statusFilter === "all" && !fromDate && !toDate
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
		</div>
	);
};

export default AdminDashboard;
