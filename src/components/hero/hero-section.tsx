import ErrorBoundary from "@/components/error-boundary";
import Image from "next/image";
import PrimaryActionButton from "../primary-action-button";
import JobOpportunitiesSection from "./opportunities";

const HeroSection = () => {
	return (
		<ErrorBoundary>
			<section className="relative flex flex-col-reverse md:flex-row mx-auto 2xl:max-w-screen-2xl container px-5 pt-0 md:pt-10 xl:pt-0 mb-0 md:mb-10 xl:mb-auto">
				<div className="absolute top-0 left-0 w-full h-full">
					<Image
						src="/ellipses/ellipse-1.svg"
						alt="Ellipse 1"
						layout="fill"
						objectFit="cover"
						className="opacity-100"
					/>
					<Image
						src="/ellipses/ellipse-2.svg"
						alt="Ellipse 2"
						layout="fill"
						objectFit="cover"
						className="opacity-100"
					/>
				</div>
				<div className="inset-0 xl:absolute flex items-center max-w-sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl order-2 md:order-1 mt-10 md:mt-0">
					<div className="sm:pl-5 md:pl-10 lg:pl-28 xl:pl-40">
						<h1 className="text-[#3F3F3F] uppercase font-black text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
							UNLOCK YOUR POTENTIAL WITH THE RIGHT OPPORTUNITY
						</h1>
						<p className="mt-2 font-normal text-xl text-[#161614] ">
							By joining our team
						</p>
						<PrimaryActionButton
							showRegisterModal
							className="mt-5 inline-flex items-center text-xs lg:text-sm uppercase"
						>
							APPLY NOW
						</PrimaryActionButton>
					</div>
				</div>
				<div className="relative w-full xl:w-[80%] -mt-16 sm:-mt-30 md:-mt-0 ml-0 md:-ml-80 lg:-ml-96 xl:ml-auto mb-4 md:mb-0 order-1 md:order-2">
					<Image
						src="/images/hero-img.svg"
						alt="GrowRwanda - Hero"
						height={400}
						width={570}
						className="w-full h-full"
					/>
				</div>
			</section>
			<JobOpportunitiesSection />
		</ErrorBoundary>
	);
};

export default HeroSection;
