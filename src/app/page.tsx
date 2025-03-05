// import ContactSection from "@/components/contact/contact-section";
import HeroSection from "@/components/hero/hero-section";
import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";
import TeamSection from "@/components/team/team-section";
import { OpeningsSection } from "@/components/openings/openings-section";
export default function LandingPage() {
	return (
		<>
			<Header />
			<main className="mt-8 lg:mt-16">
				<HeroSection />
				<TeamSection />
				<OpeningsSection />
			</main>
			<Footer />
		</>
	);
}
