"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface LearnMoreCTAProps {
	href: string;
	text?: string;
	className?: string;
}

const LearnMoreCTA = ({
	href,
	text = "Learn More",
	className,
}: LearnMoreCTAProps) => {
	return (
		<Link
			href={href}
			className={cn(
				"inline-flex items-center gap-2 bg-white text-primary-base rounded-full px-6 py-3 hover:bg-gray-100 transition-colors text-sm md:text-base font-medium",
				className,
			)}
		>
			{text}
			<ExternalLink className="size-4 md:size-5" />
		</Link>
	);
};

export default LearnMoreCTA;
