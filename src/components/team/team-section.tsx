import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TeamSection = () => {
	return (
		<section className="w-full max-w-screen-2xl mx-auto px-5 md:px-20 py-16">
			<div className="relative overflow-hidden rounded-3xl w-full bg-gradient-to-r from-[#2B9AC9] to-[#154C63]">
				<div className="relative z-10 flex flex-col md:flex-row p-6 md:p-9 gap-6 md:gap-16">
					<div className="md:w-1/2 w-full aspect-[522/348] relative">
						<div className="overflow-hidden rounded-lg w-full h-full relative">
							<Image
								src="/images/team-photo.png"
								alt="Grow Rwanda Team"
								fill
								className="object-cover"
								sizes="100vw"
							/>
						</div>
					</div>

					<div className="md:w-1/2 w-full flex flex-col justify-center items-center md:items-start text-white space-y-8">
						<h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-center md:text-left">
							JOIN OUR TEAM OF INNOVATORS AND GAME-CHANGERS
						</h2>

						<p className="text-sm md:text-base text-center md:text-left">
							At Grow Rwanda, We Pride Ourselves On Offering A Dynamic Work
							Environment Where Passion Meets Expertise. We Bring Together
							Passionate Professionals Who Are Driven To Make An Impact. Our
							Team Thrives On Creativity And Collaboration, Delivering Solutions
							That Fuel Rwanda&apos;s Success.
						</p>

						<div className="">
							<Link
								href="/careers"
								className="inline-flex items-center gap-2 bg-white text-primary-base rounded-full px-6 py-3 hover:bg-gray-100 transition-colors text-sm md:text-2xl font-medium"
							>
								Learn More
								<ExternalLink />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TeamSection;
