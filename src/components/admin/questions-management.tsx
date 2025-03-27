"use client";

import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import ContentCard from "@/components/admin/common/content-card";
import TableActions from "@/components/admin/common/table-actions";
import { Plus } from "lucide-react";
import React, { useState } from "react";

// Mock data - in a real app this would come from an API
const MOCK_QUESTIONS = [
	{
		id: "01",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Problem Solving",
	},
	{
		id: "02",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Computer Skills",
	},
	{
		id: "03",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Computer Skills",
	},
	{
		id: "04",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Math",
	},
	{
		id: "05",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Essay",
	},
	{
		id: "06",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Math",
	},
	{
		id: "07",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Problem Solving",
	},
	{
		id: "08",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Problem Solving",
	},
];

const QuestionsManagement = () => {
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

	// Handle search
	const handleSearch = (value: string) => {
		setSearchValue(value);
	};

	// Handle filter change
	const handleStatusChange = (value: string) => {
		setStatusFilter(value);
	};

	// Handle clear filters
	const handleClearFilters = () => {
		setSearchValue("");
		setStatusFilter("all");
	};

	// Handle add question
	const handleAddQuestion = () => {
		console.log("Add question");
		// Navigate to add question page or open modal
	};

	// Handle delete question
	const handleDeleteQuestion = (id: string) => {
		setQuestionToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	// Confirm delete question
	const confirmDeleteQuestion = () => {
		console.log(`Deleting question: ${questionToDelete}`);
		// In a real app, you would call an API to delete the question
		setQuestionToDelete(null);
	};

	// Filter configurations
	const filterConfigs: FilterConfig[] = [
		{
			type: "search",
			props: {
				onSearch: handleSearch,
				placeholder: "Search questions...",
				initialValue: searchValue,
			},
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "all", label: "Type - All" },
					{ value: "multiple-choice", label: "Multiple Choice" },
					{ value: "essay", label: "Essay" },
					{ value: "problem-solving", label: "Problem Solving" },
				],
				value: statusFilter,
				onChange: handleStatusChange,
			},
			width: "w-full md:w-1/5",
		},
		{
			type: "button",
			props: {
				variant: "outline",
				onClick: handleClearFilters,
				label: "Clear",
				disabled: !searchValue && statusFilter === "all",
			},
			align: "right",
		},
	];

	// Table columns
	const columns = [
		{
			accessorKey: "id",
			header: "Id",
		},
		{
			accessorKey: "excerpt",
			header: "Excerpt",
		},
		{
			accessorKey: "section",
			header: "Section",
		},
		{
			accessorKey: "type",
			header: "Type",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }: any) => (
				<TableActions
					actions={[
						{
							icon: "view",
							onClick: () => console.log("View question", row.original.id),
							tooltip: "View Details",
						},
						{
							icon: "edit",
							onClick: () => console.log("Edit question", row.original.id),
							tooltip: "Edit",
						},
						{
							icon: "delete",
							onClick: () => handleDeleteQuestion(row.original.id),
							tooltip: "Delete",
						},
					]}
				/>
			),
		},
	];

	// Filter questions based on search and filters
	const filteredQuestions = MOCK_QUESTIONS.filter((question) => {
		// Filter by search
		const matchesSearch =
			searchValue === "" ||
			question.excerpt.toLowerCase().includes(searchValue.toLowerCase()) ||
			question.type.toLowerCase().includes(searchValue.toLowerCase());

		// Filter by status/type
		const matchesStatus =
			statusFilter === "all" ||
			question.type.toLowerCase().replace(" ", "-") === statusFilter;

		return matchesSearch && matchesStatus;
	});

	return (
		<div className="space-y-6">
			{/* <SectionHeader
				title="Questions"
				description="Manage assessment questions"
				actionLabel="Add Question"
				onAction={handleAddQuestion}
				icon={<Plus className="h-5 w-5" />}
			/> */}

			<ContentCard title="Questions">
				{/* Filter Controls */}
				<FilterBar
					filters={filterConfigs}
					hasAddButton={true}
					addButtonProps={{
						label: "Add Question",
						onClick: handleAddQuestion,
						icon: <Plus className="h-4 w-4 mr-2" />,
					}}
				/>

				{/* Questions Table */}
				<DataTable
					columns={columns}
					data={filteredQuestions}
					searchColumn="excerpt"
					showSearch={false}
				/>
			</ContentCard>

			{/* Delete Confirmation Dialog */}
			<ConfirmationDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={confirmDeleteQuestion}
				title="Delete Question"
				message="Are you sure you want to delete this question? This action cannot be undone."
				confirmLabel="Delete"
				cancelLabel="Cancel"
				type="delete"
			/>
		</div>
	);
};

export default QuestionsManagement;
