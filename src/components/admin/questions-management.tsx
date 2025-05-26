"use client";

import { useRouter } from "next/navigation";
import ContentCard from "@/components/admin/common/content-card";
import FilterBar, {
	type FilterConfig,
} from "@/components/admin/common/filter-bar";
import QuestionDetail from "./questions/question-detail";
import ConfirmationDialog from "@/components/common/confirm-dialog";
import DataTable from "@/components/common/data-table";
import StatsSection, { type StatCardProps } from "./common/stats-section";
import {
	Plus,
	CircleHelp,
	FileText,
	Server,
	Eye,
	Edit,
	Trash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuestions } from "@/hooks/use-questions";
import type { Question, QuestionSection } from "@/types/questions";
import { Button } from "@/components/ui/button";

// Define the shape that QuestionDetail expects
interface DetailQuestion {
	id: string;
	text: string;
	description: string;
	excerpt: string;
	section: string;
	type: string;
	difficulty: string;
	active: boolean;
	imageUrl?: string;
	options?: DetailChoice[];
}

interface DetailChoice {
	id: string;
	optionText: string;
	optionImageUrl?: string;
}

// Adapter function to convert from your Question type to what QuestionDetail expects
const adaptQuestionForDetail = (question: Question) => {
	const baseQuestion = {
		id: question.id.toString(),
		text: question.text,
		description: question.description,
		excerpt: question.excerpt || question.text,
		section: question.section,
		type: question.type,
		difficulty: question.difficulty,
		active: question.active,
		imageUrl: question.imageUrl || undefined,
	};

	if (question.choices && question.choices.length > 0) {
		return {
			...baseQuestion,
			options: question.choices.map((choice) => ({
				id: choice.id,
				optionText: choice.text,
				optionImageUrl: choice.imageUrl || undefined,
			})),
		};
	}

	return baseQuestion;
};

const QuestionsManagement = () => {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [typeFilter, setTypeFilter] = useState<QuestionSection | "all">("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);
	const [presetTimeFrame, setPresetTimeFrame] = useState<string>("none");
	const [sortingOptions, setSortingOptions] = useState<string>("DESC");

	const [selectedQuestion, setSelectedQuestion] =
		useState<DetailQuestion | null>(null);
	const [isQuestionDetailOpen, setIsQuestionDetailOpen] = useState(false);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

	const { questions, metadata, deleteQuestion, questionSections } =
		useQuestions({
			search: searchValue,
			type: typeFilter,
			page,
			take: pageSize,
			fromDate: fromDate ? fromDate.toISOString().slice(0, 10) : undefined,
			toDate: toDate ? toDate.toISOString().slice(0, 10) : undefined,
			presetTimeFrame: presetTimeFrame !== "none" ? presetTimeFrame : undefined,
			sortingOptions,
		});

	// Debounce search input
	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchValue(searchInput);
		}, 300);
		return () => clearTimeout(handler);
	}, [searchInput]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		setPage(1);
	}, [
		searchValue,
		typeFilter,
		fromDate,
		toDate,
		presetTimeFrame,
		sortingOptions,
	]);

	const handleSearch = (value: string) => {
		setSearchInput(value);
	};

	const handleTypeChange = (value: string) => {
		setTypeFilter(value as QuestionSection | "all");
	};

	const handleClearFilters = () => {
		setSearchInput("");
		setTypeFilter("all");
		setFromDate(undefined);
		setToDate(undefined);
		setPresetTimeFrame("none");
		setSortingOptions("DESC");
	};

	const handleViewQuestion = (id: string) => {
		const question = questions.data?.data.find(
			(q: Question) => q.id.toString() === id,
		);
		if (question) {
			setSelectedQuestion(adaptQuestionForDetail(question));
			setIsQuestionDetailOpen(true);
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

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setPage(1); // Reset to first page when page size changes
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
				initialValue: searchInput,
			},
		},
		{
			type: "dropdown",
			props: {
				options: [
					{ value: "all", label: "Type - All" },
					...questionSections.map((section) => ({
						value: section,
						label: section.replace(/_/g, " "),
					})),
				],
				value: typeFilter,
				onChange: handleTypeChange,
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
				onChange: setPresetTimeFrame,
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
			id: "actions",
			header: "Actions",
			cell: ({ row }: { row: { original: Question } }) => (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleViewQuestion(row.original.id.toString())}
					>
						<Eye className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleEditQuestion(row.original.id.toString())}
					>
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleDeleteQuestion(row.original.id.toString())}
					>
						<Trash className="h-4 w-4" />
					</Button>
				</div>
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
					clearDisabled={!searchInput && typeFilter === "all"}
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
						page={page}
						pageSize={pageSize}
						totalPages={questions.data?.meta?.pageCount || 1}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
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
