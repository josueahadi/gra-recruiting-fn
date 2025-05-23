"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";

interface FeatureHighlightProps {
	title: string;
	description?: string;
	imageSrc: string;
	imageAlt: string;
	imageOnRight?: boolean;
	children?: React.ReactNode;
	bgColor?: string;
	textColor?: string;
	className?: string;
	imageClassName?: string;
	contentClassName?: string;
}

const FeatureHighlight = ({
	title,
	description,
	imageSrc,
	imageAlt,
	imageOnRight = false,
	children,
	bgColor,
	textColor = "text-black",
	className,
	imageClassName,
	contentClassName,
}: FeatureHighlightProps) => {
	return (
		<section
			className={cn(
				"w-full max-w-screen-2xl mx-auto px-5 md:px-20 py-8 md:py-10",
				className,
			)}
		>
			<div
				className={cn(
					"relative overflow-visible rounded-32 w-full",
					bgColor,
					textColor,
				)}
			>
				<div
					className={cn(
						"relative z-10 flex flex-col gap-6 md:gap-12",
						imageOnRight ? "md:flex-row gap-6 md:gap-0" : "md:flex-row-reverse",
					)}
				>
					<div
						className={cn(
							"lg:w-[58%] w-full flex flex-col justify-center items-center md:items-start space-y-6 py-0 md:py-10 order-2 md:order-1",
							contentClassName,
						)}
					>
						<h2 className="text-2xl md:text-5xl font-semibold capitalize tracking-wide max-w-xl text-center md:text-left">
							{title}
						</h2>

						{description && (
							<p
								className={cn(
									`text-sm md:text-base !mb-6 ${imageOnRight ? "!mb-0" : ""} text-black max-w-lg text-center md:text-left`,
								)}
							>
								{description}
							</p>
						)}

						{children}
					</div>

					<div
						className={cn(
							"lg:w-[42%] w-full relative order-1 md:order-2",
							imageClassName,
						)}
					>
						<div className="relative h-full w-full aspect-square md:aspect-auto">
							<Image
								src={imageSrc}
								alt={imageAlt}
								fill
								className={cn(
									"object-cover",
									imageOnRight ? "rounded-32 " : "rounded-32 ",
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FeatureHighlight;
