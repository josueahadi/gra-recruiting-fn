"use client";

import LearnMoreCTA from "@/components/common/learn-more-cta";
import FeatureHighlight from "@/components/common/feature-highlight";
import { Check } from "lucide-react";

const WhyGRA = () => {
	const bulletPoints = [
		"Work With Top U.S. Companies And Grow Your Career",
		"Earn Competitive Pay With Great Opportunities",
		"Enjoy A Simple, Transparent Hiring Process",
	];

	return (
		<FeatureHighlight
			title="Why Grow Rwanda? Your Gateway To Global Opportunities!"
			description="Unlock Global Career Opportunities With Grow Rwanda. Work With Leading U.S. Companies, Earn Competitive Pay, And Take Your Skills To The Next Level—All Through A Simple And Transparent Process."
			imageSrc="/images/why-gra.png"
			imageAlt="Professional Team"
			imageOnRight={true}
			textColor="text-black"
			contentClassName="md:pl-32"
		>
			<ul className="space-y-4">
				{bulletPoints.map((point) => (
					<li key={point} className="flex items-start gap-3">
						<div className="flex-shrink-0 mt-1">
							<div className="bg-primary-base rounded-full w-5 h-5 flex items-center justify-center">
								{/* <div className="bg-white rounded-full w-2.5 h-2.5" /> */}
								<Check className="w-3 h-3 text-white" />
							</div>
						</div>
						<span className="text-sm md:text-base">{point}</span>
					</li>
				))}
			</ul>

			<div className="pt-2">
				<LearnMoreCTA
					className="bg-primary-base hover:bg-primary-base text-white"
					href="/careers"
				/>
			</div>
		</FeatureHighlight>
	);
};

export default WhyGRA;
