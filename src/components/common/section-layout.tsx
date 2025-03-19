import type React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionItem from "@/components/common/section-item";

interface SectionLayoutProps {
	title: string;
	children: ReactNode;
	topSection?: ReactNode;
	className?: string;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
	title,
	children,
	topSection,
	className,
}) => {
	return (
		<div className={cn("space-y-6", className)}>
			<div className="flex flex-col items-start md:flex-row md:justify-between md:items-center gap-4">
				<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
			</div>

			{topSection && <div className="mb-6">{topSection}</div>}

			<div className="space-y-4">{children}</div>
		</div>
	);
};

// Export both components for ease of use
export { SectionItem };
export default SectionLayout;
