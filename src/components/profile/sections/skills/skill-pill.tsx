import type React from "react";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { X, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { showToast } from "@/services/toast";

interface SkillPillProps {
	id?: string | number;
	skill: string;
	experienceRating?: string;
	onRemove?: () => void;
	onEdit?: (id: string | number, name: string, rating: string) => void;
	isEditing?: boolean;
	className?: string;
	disabled?: boolean;
}

const getRatingNumber = (rating?: string) => {
	switch (rating) {
		case "ONE":
			return 1;
		case "TWO":
			return 2;
		case "THREE":
			return 3;
		case "FOUR":
			return 4;
		case "FIVE":
			return 5;
		default:
			return rating;
	}
};

const SkillPill: React.FC<SkillPillProps> = memo(
	({
		id,
		skill,
		experienceRating,
		onRemove,
		onEdit,
		isEditing = false,
		className,
		disabled = false,
	}) => {
		const [isPopoverOpen, setIsPopoverOpen] = useState(false);

		if (!skill || typeof skill !== "string") {
			return null;
		}

		const handleEdit = () => {
			setIsPopoverOpen(false);
			if (onEdit && id) {
				onEdit(id, skill, experienceRating || "FIVE");
			}
		};

		const handleDelete = () => {
			setIsPopoverOpen(false);
			if (onRemove) {
				onRemove();
				showToast({
					title: `Skill "${skill}" has been removed`,
					variant: "success",
				});
			}
		};

		return (
			<div
				className={cn(
					"bg-slate-500 text-white px-4 py-2 rounded-full inline-flex items-center gap-2",
					isEditing ? "pr-3" : "",
					disabled && "opacity-60",
					className,
				)}
			>
				<span>{skill}</span>
				{experienceRating && (
					<span className="ml-2 bg-slate-700 text-xs px-2 py-0.5 rounded-full">
						{getRatingNumber(experienceRating)}
					</span>
				)}
				{isEditing &&
					!disabled &&
					(onEdit && onRemove ? (
						<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
							<PopoverTrigger asChild>
								<button
									type="button"
									className="ml-2 text-white hover:text-blue-100 focus:outline-none transition-colors"
									aria-label={`Actions for ${skill}`}
									disabled={disabled}
								>
									<MoreVertical className="h-4 w-4" />
								</button>
							</PopoverTrigger>
							<PopoverContent align="center" className="w-32 p-1">
								<button
									type="button"
									className="flex items-center w-full px-2 py-2 text-sm hover:bg-blue-100 rounded transition-colors"
									onClick={handleEdit}
								>
									<Pencil className="h-4 w-4 mr-2 text-gray-600" /> Edit
								</button>
								<button
									type="button"
									className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
									onClick={handleDelete}
								>
									<Trash2 className="h-4 w-4 mr-2" /> Delete
								</button>
							</PopoverContent>
						</Popover>
					) : onRemove ? (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onRemove();
								showToast({
									title: `Skill "${skill}" has been removed`,
									variant: "success",
								});
							}}
							className="ml-2 text-white hover:text-red-100 focus:outline-none transition-colors"
							aria-label={`Remove ${skill}`}
							disabled={disabled}
						>
							<X className="h-4 w-4" />
						</button>
					) : null)}
			</div>
		);
	},
);

SkillPill.displayName = "SkillPill";

export default SkillPill;
