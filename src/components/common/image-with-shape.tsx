"use client";

import { BackgroundShape } from "@/components/ui/background-shape";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ImageWithShapeProps {
	imageSrc: string;
	imageAlt: string;
	className?: string;
	imageClassName?: string;
	variant?: "square" | "circle";
	fill?: string;
	stroke?: string;
	priority?: boolean;
}

const ImageWithShape = ({
	imageSrc,
	imageAlt,
	className,
	imageClassName,
	variant = "square",
	fill = "#2B9AC9",
	stroke = "#2B9AC9",
	priority = false,
}: ImageWithShapeProps) => {
	// Use client-side rendering to avoid hydration mismatch
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Base container class that will be consistent
	const containerClass = cn(
		"relative w-full aspect-[4/5] flex items-end",
		className,
	);

	// If not mounted yet, render a placeholder with the same dimensions
	if (!isMounted) {
		return <div className={containerClass} />;
	}

	return (
		<div className={containerClass}>
			{variant === "square" ? (
				<>
					<BackgroundShape
						variant="filled"
						className="absolute bottom-0 left-0 right-0 w-full"
						fill={fill}
						fillOpacity={0.99}
						width="100%"
						height="100%"
					/>
					<BackgroundShape
						variant="outlined"
						className="absolute bottom-0 left-0 right-0 w-full translate-x-3 translate-y-2"
						stroke={stroke}
						strokeWidth={1}
						width="100%"
						height="100%"
					/>
				</>
			) : (
				// Circle variant
				<div className="absolute -z-10 w-[92%] h-[95%] rounded-full bg-primary-base left-[4%] top-[2%]" />
			)}

			<div
				className={cn(
					"relative z-10 flex items-end justify-center w-full h-full",
					variant === "circle" ? "rounded-br-[100px] overflow-hidden" : "",
				)}
			>
				<Image
					src={imageSrc}
					alt={imageAlt}
					fill
					className={cn("object-cover object-bottom", imageClassName)}
					sizes="(max-width: 768px) 100vw, 50vw"
					priority={priority}
				/>
			</div>
		</div>
	);
};

export default ImageWithShape;
