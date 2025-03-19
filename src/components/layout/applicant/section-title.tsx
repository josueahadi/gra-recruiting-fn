import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import type React from "react";

interface SectionTitleProps {
	title: string;
	showEditButton?: boolean;
	onEdit?: () => void;
	icon?: React.ReactNode;
	className?: string;
}

const SectionTitle = ({
	title,
	showEditButton = false,
	onEdit,
	icon,
	className,
}: SectionTitleProps) => {
	return (
		<div className={cn("flex items-center justify-between mb-6", className)}>
			<div className="flex items-center">
				{icon && <span className="mr-2">{icon}</span>}
				<h2 className="text-xl text-blue-400 font-medium">{title}</h2>
			</div>

			{showEditButton && (
				<button
					type="button"
					onClick={onEdit}
					className="text-green-500 hover:text-green-600 focus:outline-none"
					aria-label={`Edit ${title}`}
				>
					<Pencil className="h-5 w-5" />
				</button>
			)}
		</div>
	);
};

export default SectionTitle;
