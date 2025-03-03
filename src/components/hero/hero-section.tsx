import ErrorBoundary from "@/components/error-boundary";
import Image from "next/image";
import PrimaryActionButton from "@/components/primary-action-button";
import { BackgroundShape } from "@/components/ui/background-shape";

const HeroSection = () => {
	return (
		<ErrorBoundary>
			<section className=" mx-auto 2xl:max-w-screen-2xl px-5 md:px-20 md:py-8">
				<div className="px-5 md:px-24 flex flex-col lg:flex-row gap-10 lg:gap-0">
					<div className="flex items-center lg:max-w-2xl xl:max-w-4xl lg:w-[62%] order-2 lg:order-1">
						<div className="space-y-6 w-full lg:max-w-2xl xl:max-w-4xl">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] capitalize font-semibold text-black">
								Empower Your Career with Limitless Opportunities
							</h1>
							<p className="font-normal text-black capitalize text-base">
								Join our team and unlock your potential with dynamic roles in{" "}
								<br className="hidden lg:block" />
								accounting, development, design, and marketing.
							</p>
							<PrimaryActionButton
								authMode="signup"
								className="inline-flex items-center text-xs lg:text-sm uppercase"
							>
								APPLY NOW
							</PrimaryActionButton>
						</div>
					</div>
					<div className="lg:w-[38%] order-1 lg:order-2 flex justify-items-end items-end">
						<div className="relative w-full aspect-[4/5] flex items-end">
							{/* Background Shapes */}
							<BackgroundShape
								variant="filled"
								className="absolute bottom-0 left-0 right-0 w-full"
								fill="#2B9AC9"
								fillOpacity={0.99}
								width="100%"
								height="100%"
							/>
							<BackgroundShape
								variant="outlined"
								className="absolute bottom-0 left-0 right-0 w-full translate-x-2 translate-y-2"
								stroke="#2B9AC9"
								strokeWidth={1}
								width="100%"
								height="100%"
							/>

							{/* Image */}
							<div className="relative z-10 flex items-end justify-center w-full h-full">
								<Image
									src="/images/vecteezy_photo-of-smart-african-woman-with-black-business-suit-at-big_28125952 1.png"
									alt="GrowRwanda - Hero"
									fill
									className="object-cover object-bottom"
									sizes="(max-width: 768px) 100vw, 33vw"
									priority
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* <JobOpportunitiesSection /> */}
		</ErrorBoundary>
	);
};

export default HeroSection;
