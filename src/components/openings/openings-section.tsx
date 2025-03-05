// import { useAuth } from "@/hooks/use-auth";
import { JobCarousel } from "./job-carousel";

export const OpeningsSection = () => {
	// const { handleAuth } = useAuth();
	return (
		<section className="w-full max-w-screen-2xl mx-auto px-5 md:px-20 py-16">
			<div className="flex flex-col justify-center items-center space-y-4">
				<h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-center md:text-left text-black">
					Current Openings
				</h2>
				<p className="text-sm md:text-xl text-center capitalize">
					Your Next Chapter Starts Here
					<br />
					Be Part of Our Story Shape the Future With Us
				</p>
				<JobCarousel />
			</div>
		</section>
	);
};
