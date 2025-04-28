import type React from "react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SkillPillProps {
	skill: string;
	onRemove?: () => void;
	isEditing?: boolean;
	className?: string;
	disabled?: boolean;
}

const SkillPill: React.FC<SkillPillProps> = memo(
	({ skill, onRemove, isEditing = false, className, disabled = false }) => {
		if (!skill || typeof skill !== "string") {
			return null;
		}

		return (
			<div
				className={cn(
					"bg-slate-500 text-white px-4 py-2 rounded-full inline-flex items-center",
					isEditing ? "pr-3" : "",
					disabled && "opacity-60",
					className,
				)}
			>
				<span>{skill}</span>
				{isEditing && onRemove && !disabled && (
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onRemove();
						}}
						className="ml-2 text-white hover:text-red-100 focus:outline-none transition-colors"
						aria-label={`Remove ${skill}`}
						disabled={disabled}
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
		);
	},
);

SkillPill.displayName = "SkillPill";

export default SkillPill;
