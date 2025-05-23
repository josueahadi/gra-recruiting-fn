import ContactSection from "@/components/contact/contact-section";
import DepartmentsSection from "@/components/departments/departments-section";
import HeroSection from "@/components/hero/hero-section";
import Footer from "@/components/layout/public/footer/footer";
import Header from "@/components/layout/public/header/header";
import { OpeningsSection } from "@/components/openings/openings-section";
import TeamSection from "@/components/team/team-section";

export default function LandingPage() {
	return (
		<>
			<Header />
			<main className="">
				<HeroSection />
				<TeamSection />
				<OpeningsSection />
				<DepartmentsSection />
				<ContactSection />
			</main>
			<Footer />
		</>
	);
}
