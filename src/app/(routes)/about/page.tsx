import CallToAction from "@/components/about/CTA";
import FAQ from "@/components/about/FAQ";
import JoinUs from "@/components/about/join-us";
import MissionVision from "@/components/about/mission-vision";
import WhyGRA from "@/components/about/why-gra";
import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";

export default function AboutPage() {
	return (
		<>
			<Header />
			<main className="">
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
