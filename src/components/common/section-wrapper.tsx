"use client";

import React from "react";

interface SectionWrapperProps {
	title: string;
	subtitle: Array<string>;
	children: React.ReactNode;
	className?: string;
}

const SectionWrapper = ({
	title,
	subtitle,
	children,
	className = "",
}: SectionWrapperProps) => {
	return (
		<section
			className={`w-full mx-auto max-w-screen-2xl px-5 md:px-20 pb-16 ${className}`}
		>
			<div className="text-center space-y-4">
				<h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide">
					{title}
				</h2>
				<p className="text-sm md:text-base font-medium mx-auto mb-4">
					{subtitle.map((item, index) => (
						<React.Fragment key={item}>
							{item}
							{index < subtitle.length - 1 && <br />}
						</React.Fragment>
					))}
				</p>
			</div>
			<div className="mt-10">{children}</div>
		</section>
	);
};

export default SectionWrapper;
