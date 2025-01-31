import Image from "next/image";
import Link from "next/link";
import JobOpportunitiesSection from "./opportunities";

const HeroSection = () => {
	return (
		<>
			<section className="relative max-md:flex-col-reverse max-xl:flex mx-auto 2xl:max-w-screen-2xl container px-5 pt-0 md:pt-10 xl:pt-0 mb-10 md:mb-10  xl:mb-auto">
				<div className="inset-0 xl:absolute flex items-center w-full sm:max-w-sm md:max-w-md xl:max-w-3xl">
					<div className="sm:pl-5 md:pl-10 xl:pl-28">
						<h1 className="text-[#3F3F3F] uppercase font-extrabold text-4xl md:text-4xl xl:text-6xl">
							UNLOCK YOUR POTENTIAL WITH THE RIGHT OPPORTUNITY
						</h1>
						<p className="mt-2 font-normal text-xl text-[#161614] capitalize">
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
				<div className="relative w-full xl:w-[80%] ml-auto md:-ml-40 xl:ml-auto mb-4 md:mb-0">
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
