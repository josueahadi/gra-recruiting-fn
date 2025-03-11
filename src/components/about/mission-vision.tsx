"use client";

import FeatureHighlight from "@/components/common/feature-highlight";
import InfoCard from "@/components/common/info-card";

const MissionVision = () => {
	return (
		<FeatureHighlight
			title="Driving Growth Through Opportunity"
			description="Join A Network Of Top-Tier Talent Connecting With U.S. Businesses. Gain International Experience, Competitive Pay, And Career Growth Opportunities."
			imageSrc="/images/mission-vision.png"
			imageAlt="Grow Rwanda Team"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
				<InfoCard
					title="Mission"
					description="To Empower Rwandan Professionals By Connecting Them With Global Job Opportunities While Providing U.S. Businesses With Top-Tier Competitive Rates."
				/>

				<InfoCard
					title="Vision"
					description="To Become The Leading Platform For Outsourcing Professional Talent In Rwanda"
				/>
			</div>
		</FeatureHighlight>
	);
};

export default MissionVision;
