"use client";

import SectionWrapper from "@/components/common/section-wrapper";
import JobCarousel from "@/components/openings/job-carousel";

export const OpeningsSection = () => {
	return (
		<SectionWrapper
			title="Current Openings"
			subtitle={[
				"Your Next Chapter Starts Here",
				"Be Part of Our Story - Shape the Future With Us",
			]}
			className=""
		>
			<JobCarousel />
		</SectionWrapper>
	);
};
