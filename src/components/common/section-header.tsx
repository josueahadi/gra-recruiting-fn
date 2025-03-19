import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SectionHeaderProps {
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
	icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	description,
	actionLabel,
	onAction,
	className,
	icon,
}) => {
	return (
		<div
			className={cn(
				"flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0",
				className,
			)}
		>
			<div className="flex items-center space-x-3">
				{icon && <div className="text-primary-base">{icon}</div>}
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
					{description && (
						<p className="text-sm text-muted-foreground mt-1">{description}</p>
					)}
				</div>
			</div>

			{actionLabel && onAction && (
				<Button
					onClick={onAction}
					className="bg-primary-base hover:bg-primary-dark"
				>
					<Plus className="h-4 w-4 mr-2" />
					{actionLabel}
				</Button>
			)}
		</div>
	);
};

export default SectionHeader;
