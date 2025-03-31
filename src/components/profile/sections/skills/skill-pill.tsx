import type React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SkillPillProps {
	skill: string;
	onRemove?: () => void;
	isEditing?: boolean;
	className?: string;
}

const SkillPill: React.FC<SkillPillProps> = ({
	skill,
	onRemove,
	isEditing = false,
	className,
}) => {
	return (
		<div
			className={cn(
				"bg-slate-500 text-white px-4 py-2 rounded-full inline-flex items-center",
				isEditing ? "pr-3" : "",
				className,
			)}
		>
			<span>{skill}</span>
			{isEditing && onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="ml-2 text-white hover:text-red-100 focus:outline-none"
					aria-label={`Remove ${skill}`}
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
};

export default SkillPill;
