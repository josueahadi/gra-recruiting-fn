"use client";

import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import TableActions from "@/components/admin/common/table-actions";
import AddQuestionForm, {
	type QuestionFormValues,
} from "./questions/add-question-form";
import QuestionDetail from "./questions/question-detail";
import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import { Plus } from "lucide-react";
import React, { useState } from "react";

// Mock data - in a real app this would come from an API
const MOCK_QUESTIONS = [
	{
		id: "01",
		text: "What is the most important aspect of a well-structured resume?",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Problem Solving",
		choices: [
			{ text: "Clear formatting and organization", isCorrect: true },
			{ text: "Including all past jobs", isCorrect: false },
			{ text: "Using advanced vocabulary", isCorrect: false },
			{ text: "Adding personal hobbies", isCorrect: false },
		],
	},
	{
		id: "02",
		text: "What are the essential components of a professional email?",
		excerpt:
			"A well-structured resume is one of the most important tools for job seekers. It helps...",
		section: "Multiple Choice",
		type: "Computer Skills",
		choices: [
			{ text: "Clear subject line", isCorrect: true },
			{ text: "Formal greeting", isCorrect: false },
			{ text: "Concise message", isCorrect: false },
			{ text: "Professional signature", isCorrect: false },
		],
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

	// Question detail modal state
	const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
	const [isQuestionDetailOpen, setIsQuestionDetailOpen] = useState(false);

	// Add question modal state
	const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

	// Delete confirmation dialog state
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

	// Handle viewing question details
	const handleViewQuestion = (id: string) => {
		const question = MOCK_QUESTIONS.find((q) => q.id === id);
		if (question) {
			setSelectedQuestion(question);
			setIsQuestionDetailOpen(true);
		}
	};

	// Handle edit question
	const handleEditQuestion = (id: string) => {
		console.log("Edit question", id);
		// In a real app, you would open the edit form with the question data
	};

	// Handle add question
	const handleAddQuestion = () => {
		setIsAddQuestionOpen(true);
	};

	// Handle submit new question
	const handleSubmitQuestion = (values: QuestionFormValues) => {
		console.log("Submitted question:", values);
		// In a real app, you would call an API to save the question
		setIsAddQuestionOpen(false);
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
		setIsDeleteDialogOpen(false);
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
							onClick: () => handleViewQuestion(row.original.id),
							tooltip: "View Details",
						},
						{
							icon: "edit",
							onClick: () => handleEditQuestion(row.original.id),
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
					onClear={handleClearFilters}
					clearDisabled={!searchValue && statusFilter === "all"}
				/>

				{/* Questions Table */}
				<DataTable
					columns={columns}
					data={filteredQuestions}
					searchColumn="excerpt"
					showSearch={false}
				/>
			</ContentCard>

			{/* Add Question Form Modal */}
			<AddQuestionForm
				isOpen={isAddQuestionOpen}
				onClose={() => setIsAddQuestionOpen(false)}
				onSubmit={handleSubmitQuestion}
			/>

			{/* Question Detail Modal */}
			{selectedQuestion && (
				<QuestionDetail
					isOpen={isQuestionDetailOpen}
					onClose={() => setIsQuestionDetailOpen(false)}
					question={selectedQuestion}
					onEdit={handleEditQuestion}
					onDelete={handleDeleteQuestion}
				/>
			)}

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
