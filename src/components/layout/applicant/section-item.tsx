import { cn } from "@/lib/utils";
import type React from "react";
import SectionTitle from "./section-title";

interface SectionItemProps {
	title: string;
	children: React.ReactNode;
	showEditButton?: boolean;
	onEdit?: () => void;
	className?: string;
	contentClassName?: string;
	titleClassName?: string;
	titleContent?: React.ReactNode;
}

/**
 * A sub-section component for consistent styling within a section
 */
export const SectionItem: React.FC<SectionItemProps> = ({
	title,
	children,
	showEditButton = false,
	onEdit,
	className,
	titleClassName,
	contentClassName,
	titleContent,
}) => {
	return (
		<div className={cn("mb-10", className)}>
			<SectionTitle
				title={title}
				showEditButton={showEditButton}
				onEdit={onEdit}
				icon={titleContent}
				className={titleClassName}
			/>

			<div className={cn("", contentClassName)}>{children}</div>
		</div>
	);
};

export default SectionItem;
