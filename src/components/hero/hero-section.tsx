import Image from "next/image";
import Link from "next/link";
import JobOpportunitiesSection from "./opportunities";

const HeroSection = () => {
	return (
		<>
			<section className="relative flex flex-col-reverse md:flex-row mx-auto 2xl:max-w-screen-2xl container px-5 pt-0 md:pt-10 xl:pt-0 mb-0 md:mb-10 xl:mb-auto">
				<div className="absolute top-0 left-0 w-full h-full">
					<Image
						src="/ellipses/ellipse-1.svg"
						alt="Ellipse 1"
						layout="fill"
						objectFit="cover"
						className="opacity-80"
					/>
					<Image
						src="/ellipses/ellipse-2.svg"
						alt="Ellipse 2"
						layout="fill"
						objectFit="cover"
						className="opacity-80"
					/>
				</div>
				<div className="inset-0 xl:absolute flex items-center max-w-sm:max-w-sm md:max-w-xl xl:max-w-3xl order-2 md:order-1 mt-10 md:mt-0">
					<div className="sm:pl-5 md:pl-10 xl:pl-32">
						<h1 className="text-[#3F3F3F] uppercase font-black text-3xl sm:text-3xl md:text-5xl xl:text-6xl">
							UNLOCK YOUR POTENTIAL WITH THE RIGHT OPPORTUNITY
						</h1>
						<p className="mt-2 font-normal text-xl text-[#161614] ">
							By joining our team
						</p>
						<Link
							href="/apply"
							className="mt-5 inline-flex items-center text-xs lg:text-sm px-6 py-3 rounded-3xl bg-secondary-base text-white transition-colors duration-300 hover:bg-secondary-light hover:text-white uppercase font-bold"
						>
							APPLY NOW
						</Link>
					</div>
				</div>
				<div className="relative w-full xl:w-[80%] -mt-20 sm:-mt-30 md:-mt-0 ml-0 md:-ml-80 xl:ml-auto mb-4 md:mb-0 order-1 md:order-2">
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
		</>
	);
};

export default HeroSection;
