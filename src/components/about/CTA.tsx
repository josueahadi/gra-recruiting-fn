import { ArrowUpRight } from "lucide-react";
import PrimaryActionButton from "@/components/common/primary-cta-button";

const CallToAction = () => {
	return (
		<section className="w-full max-w-screen-2xl mx-auto px-5 md:px-20 py-8 md:py-16">
			<div className="rounded-32 bg-gradient-to-r from-primary-base to-primary-dark px-5 py-16 md:px-28 md:py-20 text-white">
				<div className=" mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="space-y-4 max-w-2xl text-center md:text-left">
						<h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold capitalize">
							Start Your Journey Today!
						</h2>
						<p className="text-xs md:text-base">
							Take The Next Step In Your Career With Grow Rwanda. Join A Network
							Of Skilled Professionals Connecting With Top U.S. Companies. Earn
							Competitively, Gain Global Experience, And Grow Faster Than Ever.
						</p>
					</div>

					<PrimaryActionButton
						href="/auth?mode=signup"
						className="bg-white text-primary-base hover:bg-opacity-90 hover:text-primary-dark min-w-40 justify-center gap-2"
					>
						Apply Now
						<ArrowUpRight className="w-5 h-5" />
					</PrimaryActionButton>
				</div>
			</div>
		</section>
	);
};

export default CallToAction;
