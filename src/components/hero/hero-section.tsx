"use client";

import ImageWithShape from "@/components/common/image-with-shape";
import PrimaryCTAButton from "@/components/common/primary-cta-button";
import ErrorBoundary from "@/components/error-boundary";
import { useAuth } from "@/hooks/use-auth";

const HeroSection = () => {
	const { handleAuth } = useAuth();
	return (
		<ErrorBoundary>
			<section className=" mx-auto 2xl:max-w-screen-2xl px-5 md:px-20 md:py-8">
				<div className="px-5 md:px-24 flex flex-col lg:flex-row gap-8 lg:gap-0">
					<div className="flex items-center lg:max-w-2xl xl:max-w-4xl lg:w-[62%] order-2 lg:order-1">
						<div className="space-y-3 lg:space-y-6 w-full lg:max-w-2xl xl:max-w-4xl">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] capitalize font-semibold text-black text-center lg:text-left">
								Empower Your Career with Limitless Opportunities
							</h1>
							<p className="font-normal text-black capitalize text-sm  sm:text-base text-center lg:text-left">
								Join our team and unlock your potential with dynamic roles in{" "}
								<br className="hidden lg:block" />
								accounting, development, design, and marketing.
							</p>
							<div className="flex justify-center lg:justify-start mt-1">
								<PrimaryCTAButton
									onClick={() => handleAuth("signup")}
									className="inline-flex items-center text-xs lg:text-sm uppercase"
								>
									APPLY NOW
								</PrimaryCTAButton>
							</div>
						</div>
					</div>
					<div className="lg:w-[38%] order-1 lg:order-2 flex justify-items-end items-end">
						<ImageWithShape
							imageSrc="/images/vecteezy_photo-of-smart-african-woman-with-black-business-suit-at-big_28125952 1.png"
							imageAlt="GrowRwanda - Hero"
							variant="square"
							priority={true}
						/>
					</div>
				</div>
			</section>
		</ErrorBoundary>
	);
};

export default HeroSection;
