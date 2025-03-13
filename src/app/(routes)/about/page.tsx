import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import JoinUs from "@/components/about/join-us";
import MissionVision from "@/components/about/mission-vision";
import WhyGRA from "@/components/about/why-gra";
import CallToAction from "@/components/about/CTA";
import FAQ from "@/components/about/faq";

export default function AboutPage() {
	return (
		<>
			<Header />
			<main className="mt-10 lg:mt-14">
				<JoinUs />
				<MissionVision />
				<WhyGRA />
				<CallToAction />
				<FAQ />
			</main>
			<Footer />
		</>
	);
}
