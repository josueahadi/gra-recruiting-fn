import type React from "react";
import { useCareers } from "@/hooks";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { CareerResponse } from "@/types/profile";

interface DepartmentSelectorProps {
	selectedDepartment: string | null;
	onChange: (career: CareerResponse) => void;
	className?: string;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
	selectedDepartment,
	onChange,
	className,
}) => {
	const { data: careers, isLoading, isError } = useCareers();

	return (
		<div className={className}>
			<h3 className="text-lg font-medium mb-4">Choose A Department</h3>

			{isLoading ? (
				<Skeleton className="w-full h-10" />
			) : isError || !careers || careers.length === 0 ? (
				<div className="text-red-500 p-2 text-sm">
					Unable to load departments. Please try again later.
				</div>
			) : (
				<Select
					value={selectedDepartment || ""}
					onValueChange={(departmentName) => {
						const selectedCareer = careers.find(
							(career) => career.name === departmentName,
						);
						if (selectedCareer) {
							onChange(selectedCareer);
						}
					}}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Choose A Department" />
					</SelectTrigger>
					<SelectContent>
						{careers.map((career: CareerResponse) => (
							<SelectItem key={career.id} value={career.name}>
								{career.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
};

export default DepartmentSelector;
