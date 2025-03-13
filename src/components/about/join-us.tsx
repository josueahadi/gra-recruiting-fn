"use client";

import React from "react";
import Image from "next/image";
// import Link from "next/link";
// import { ExternalLink } from "lucide-react";
import LearnMoreCTA from "@/components/common/learn-more-cta";

const JoinUs = () => {
	return (
		<section className="w-full max-w-screen-2xl mx-auto px-5 md:px-20 py-8 md:pb-16 md:pt-10">
			<div className="relative overflow-visible rounded-32 w-full bg-gradient-to-r from-primary-base to-primary-dark">
				<div className="relative z-10 flex flex-col md:flex-row gap-0">
					{/* Text Content */}
					<div className="lg:w-1/2 w-full flex flex-col justify-center items-center md:items-start text-white space-y-6 p-6 pb-0 md:p-9 md:pl-20">
						<h2 className="text-2xl md:text-5xl font-semibold capitalize tracking-wide text-center md:text-left">
							Empowering Rwandan Professionals for Global Success!
						</h2>
						<p className="text-xs md:text-base text-center md:text-left">
							Join a network of top-tier talent connecting with U.S. businesses.
							Gain international experience, competitive pay, and career growth
							opportunities.
						</p>
						{/* <Link
							href="/careers"
							className="inline-flex items-center gap-2 bg-white text-primary-base rounded-full px-6 py-3 hover:bg-gray-100 transition-colors text-sm md:text-base font-medium"
						>
							Learn More
							<ExternalLink />
						</Link> */}
						<LearnMoreCTA href="/careers" />
					</div>

					{/* Image */}
					<div className="lg:w-1/2 w-full aspect-[589/532] relative">
						<Image
							src="/images/join-us.png"
							alt="Grow Rwanda Team"
							fill
							className="object-cover absolute translate-y-5 sm:translate-y-9 md:translate-y-[42px]"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default JoinUs;
