"use client";

import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import FilterDropdown, {
	type FilterOption,
} from "@/components/common/filter-dropdown";
import SearchBar from "@/components/common/search-bar";
import SectionHeader from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
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

	// Filter options
	const statusOptions: FilterOption[] = [
		{ value: "all", label: "Status - All" },
		{ value: "multiple-choice", label: "Multiple Choice" },
		{ value: "essay", label: "Essay" },
		{ value: "problem-solving", label: "Problem Solving" },
	];

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
						className="text-amber-500 hover:text-amber-700"
					>
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-red-500 hover:text-red-700"
						onClick={() => handleDeleteQuestion(row.original.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
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
			<SectionHeader
				title="Questions"
				description="Manage assessment questions"
				actionLabel="Add Question"
				onAction={handleAddQuestion}
				icon={<Plus className="h-5 w-5" />}
			/>

			<div className="bg-white rounded-lg p-6">
				<h2 className="text-xl font-medium text-blue-500 mb-6">Questions</h2>

				{/* Filter Controls */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="w-full md:w-1/3">
						<SearchBar
							onSearch={handleSearch}
							placeholder="Search questions..."
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

					<div className="flex items-end ml-auto">
						<Button
							variant="outline"
							onClick={handleClearFilters}
							className="h-10"
							disabled={!searchValue && statusFilter === "all"}
						>
							Clear
						</Button>
					</div>

					<div className="flex items-end">
						<Button
							className="h-10 bg-blue-500 hover:bg-blue-600"
							onClick={handleAddQuestion}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Question
						</Button>
					</div>
				</div>

				{/* Questions Table */}
				<DataTable
					columns={columns}
					data={filteredQuestions}
					searchColumn="excerpt"
					showSearch={false}
				/>
			</div>

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
