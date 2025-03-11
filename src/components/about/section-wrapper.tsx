"use client";

import React from "react";
import Image from "next/image";

interface SectionWrapperProps {
	title: string;
	paragraph: string;
	imageSrc: string;
	imageAlt: string;
	className?: string;
}

const SectionWrapper = ({
	title,
	paragraph,
	imageSrc,
	imageAlt,
	className = "",
}: SectionWrapperProps) => {
	return (
		<section
			className={`w-full max-w-screen-2xl mx-auto px-5 md:px-20 py-16 ${className}`}
		>
			<div className="relative overflow-hidden rounded-3xl w-full bg-gradient-to-r from-[#2B9AC9] to-[#154C63]">
				<div className="relative z-10 flex flex-col md:flex-row p-6 md:p-9 gap-6 md:gap-16">
					<div className="md:w-1/2 w-full flex flex-col justify-center items-center md:items-start text-white space-y-8">
						<h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-center md:text-left">
							{title}
						</h2>
						<p className="text-sm md:text-base text-center md:text-left">
							{paragraph}
						</p>
					</div>
					<div className="md:w-1/2 w-full aspect-[522/348] relative">
						<div className="overflow-hidden rounded-lg w-full h-full relative">
							<Image
								src={imageSrc}
								alt={imageAlt}
								fill
								className="object-cover"
								sizes="100vw"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SectionWrapper;
