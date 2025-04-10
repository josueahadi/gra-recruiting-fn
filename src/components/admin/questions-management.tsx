"use client";

import { useRouter } from "next/navigation";
import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import TableActions from "@/components/admin/common/table-actions";
import QuestionDetail from "./questions/question-detail";
import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import StatsSection, { type StatCardProps } from "./common/stats-section";
import { Plus, CircleHelp, FileText, Server } from "lucide-react";
import { useState } from "react";
import { useQuestions } from "@/hooks/use-questions";
import type {
	Question,
	MultipleChoiceQuestion,
	Choice as SourceChoice,
} from "@/types";

// Define the shape that QuestionDetail expects
interface DetailQuestion {
	id: string;
	text: string;
	type: string;
	section: string;
	choices?: DetailChoice[];
	excerpt?: string;
	difficulty?: string;
	active?: boolean;
	createdAt?: string;
	updatedAt?: string;
	imageUrl?: string;
	maxScore?: number;
}

interface DetailChoice {
	id: string;
	text: string;
	isCorrect: boolean;
	imageUrl?: string;
}

// Adapter function to convert from your Question type to what QuestionDetail expects
const adaptQuestionForDetail = (question: Question): DetailQuestion => {
	const baseQuestion: DetailQuestion = {
		id: question.id,
		text: question.text,
		type: question.type,
		section: question.section,
		excerpt: question.excerpt,
		difficulty: question.difficulty,
		active: question.active,
		createdAt: question.createdAt,
		updatedAt: question.updatedAt,
		imageUrl: question.imageUrl,
	};

	// Check if it's a multiple choice question
	if (question.section === "Multiple Choice") {
		const mcQuestion = question as MultipleChoiceQuestion;
		if (mcQuestion.choices && Array.isArray(mcQuestion.choices)) {
			baseQuestion.choices = mcQuestion.choices.map(
				(choice: SourceChoice): DetailChoice => ({
					id: choice.id,
					text: choice.text || "", // Ensure text is never undefined
					isCorrect: choice.isCorrect,
					imageUrl: choice.imageUrl,
				}),
			);
		}
	} else if (question.section === "Essay") {
		// For essay questions, you might need to add the maxScore property
		baseQuestion.maxScore = (question as any).maxScore;
	}

	return baseQuestion;
};

const QuestionsManagement = () => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");

	const [selectedQuestion, setSelectedQuestion] =
		useState<DetailQuestion | null>(null);
	const [isQuestionDetailOpen, setIsQuestionDetailOpen] = useState(false);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

	const { questions, metadata, deleteQuestion } = useQuestions({
		search: searchValue,
		type: typeFilter,
	});

	const handleSearch = (value: string) => {
		setSearchValue(value);
	};

	const handleTypeChange = (value: string) => {
		setTypeFilter(value);
	};

	const handleClearFilters = () => {
		setSearchValue("");
		setTypeFilter("all");
	};

	const handleViewQuestion = (id: string) => {
		if (questions.data) {
			const question = questions.data.data.find((q) => q.id === id);
			if (question) {
				setSelectedQuestion(adaptQuestionForDetail(question));
				setIsQuestionDetailOpen(true);
			}
		}
	};

	const handleEditQuestion = (id: string) => {
		console.log("Edit question", id);
		// router.push(`/admin/questions/edit/${id}`);
	};

	const handleAddQuestion = () => {
		router.push("/admin/questions/add");
	};

	const handleDeleteQuestion = (id: string) => {
		setQuestionToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteQuestion = () => {
		if (questionToDelete) {
			deleteQuestion.mutate(questionToDelete, {
				onSuccess: () => {
					setIsDeleteDialogOpen(false);
					setQuestionToDelete(null);
				},
			});
		}
	};

	const statsData: StatCardProps[] = [
		{
			title: "Total Questions",
			value: metadata.total.toString(),
			icon: <CircleHelp className="w-8 h-8" />,
		},
		{
			title: "Multiple Choice",
			value: metadata.multipleChoice.toString(),
			icon: <FileText className="w-8 h-8" />,
		},
		{
			title: "Essay",
			value: metadata.essay.toString(),
			icon: <Server className="w-8 h-8" />,
		},
	];

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
					...metadata.types.map((type) => ({
						value: type.toLowerCase().replace(" ", "-"),
						label: type,
					})),
				],
				value: typeFilter,
				onChange: handleTypeChange,
			},
			width: "w-full md:w-1/5",
		},
	];

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
			cell: ({ row }: { row: { original: Question } }) => (
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

	return (
		<div className="space-y-6">
			<StatsSection stats={statsData} />

			<ContentCard title="Questions">
				<FilterBar
					filters={filterConfigs}
					hasAddButton={true}
					addButtonProps={{
						label: "Add Question",
						onClick: handleAddQuestion,
						icon: <Plus className="h-4 w-4 mr-2" />,
					}}
					onClear={handleClearFilters}
					clearDisabled={!searchValue && typeFilter === "all"}
				/>

				{questions.isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
					</div>
				) : questions.error ? (
					<div className="py-8 text-center text-red-500">
						Error loading questions. Please try again.
					</div>
				) : (
					<DataTable
						columns={columns}
						data={questions.data?.data || []}
						searchColumn="excerpt"
						showSearch={false}
					/>
				)}
			</ContentCard>

			{selectedQuestion && (
				<QuestionDetail
					isOpen={isQuestionDetailOpen}
					onClose={() => setIsQuestionDetailOpen(false)}
					question={selectedQuestion}
					onEdit={handleEditQuestion}
					onDelete={handleDeleteQuestion}
				/>
			)}

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
