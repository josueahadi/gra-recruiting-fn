"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Search,
	X,
} from "lucide-react";
import React, { useState } from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchColumn?: string;
	searchPlaceholder?: string;
	pageSizeOptions?: number[];
	defaultPageSize?: number;
	className?: string;
	showSearch?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchColumn,
	searchPlaceholder = "Search...",
	pageSizeOptions = [10, 20, 30, 50],
	defaultPageSize = 10,
	className,
	showSearch = true,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [searchValue, setSearchValue] = useState<string>("");

	// Ensure data and columns are properly initialized
	const tableData = React.useMemo(() => data || [], [data]);
	const tableColumns = React.useMemo(() => columns || [], [columns]);

	const table = useReactTable({
		data: tableData,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	// Set initial page size
	React.useEffect(() => {
		table.setPageSize(defaultPageSize);
	}, [defaultPageSize, table]);

	// Apply search filter when searchValue or searchColumn changes
	React.useEffect(() => {
		if (searchColumn && searchValue) {
			table.getColumn(searchColumn)?.setFilterValue(searchValue);
		} else if (searchColumn && searchValue === "") {
			table.getColumn(searchColumn)?.setFilterValue(undefined);
		}
	}, [searchValue, searchColumn, table]);

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	// Clear search
	const handleClearSearch = () => {
		setSearchValue("");
	};

	return (
		<div className={cn("space-y-4", className)}>
			{/* Search Input */}
			{showSearch && searchColumn && (
				<div className="flex items-center relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder={searchPlaceholder}
						value={searchValue}
						onChange={handleSearchChange}
						className="pl-10 max-w-sm"
					/>
					{searchValue && (
						<Button
							variant="ghost"
							size="sm"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
							onClick={handleClearSearch}
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Clear search</span>
						</Button>
					)}
				</div>
			)}

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : (
												// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
												<div
													className={cn("flex items-center gap-1", {
														"cursor-pointer select-none":
															header.column.getCanSort(),
													})}
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: <ChevronUp className="h-4 w-4" />,
														desc: <ChevronDown className="h-4 w-4" />,
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={tableColumns?.length || 1} // Use tableColumns which we know is an array
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>

				<div className="flex items-center space-x-6 lg:space-x-8">
					{/* Page size selector */}
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Rows per page</p>
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							className="h-8 w-16 rounded-md border border-input bg-transparent px-2 py-1 text-sm"
						>
							{pageSizeOptions.map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{pageSize}
								</option>
							))}
						</select>
					</div>

					{/* Page navigation */}
					<div className="flex w-[100px] items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>

					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Previous page</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRight className="h-4 w-4" />
							<span className="sr-only">Next page</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DataTable;
