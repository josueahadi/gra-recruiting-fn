import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import JoinUs from "@/components/about/join-us";
import MissionVision from "@/components/about/mission-vision";
import WhyGRA from "@/components/about/why-gra";

export default function AboutPage() {
	return (
		<>
			<Header />
			<main className="mt-10 lg:mt-14">
				<JoinUs />
				<MissionVision />
				<WhyGRA />
			</main>
			<Footer />
		</>
	);
}
