import ContactSection from "@/components/contact/contact-section";
import HeroSection from "@/components/hero/hero-section";
import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/Header";

export default function LandingPage() {
	return (
		<>
			<Header />
			<main className="">
				<HeroSection />
				<ContactSection />
			</main>
			<Footer />
		</>
	);
}
