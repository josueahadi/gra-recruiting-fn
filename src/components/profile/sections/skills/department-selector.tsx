import type React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DepartmentSelectorProps {
	selectedDepartment: string | null;
	onChange: (value: string) => void;
	departments?: string[];
	className?: string;
}

const DEFAULT_DEPARTMENTS = [
	"Software Development",
	"Frontend Development",
	"Backend Development",
	"UI/UX Design",
	"Data Analysis",
	"Machine Learning",
	"Project Management",
	"Quality Assurance",
];

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
	selectedDepartment,
	onChange,
	departments = DEFAULT_DEPARTMENTS,
	className,
}) => {
	return (
		<div className={className}>
			<h3 className="text-lg font-medium mb-4">Choose A Department</h3>

			<Select value={selectedDepartment || ""} onValueChange={onChange}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Choose A Department" />
				</SelectTrigger>
				<SelectContent>
					{departments.map((dept) => (
						<SelectItem key={dept} value={dept}>
							{dept}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default DepartmentSelector;
