import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/Header";
import ContactSection from "@/components/contact/contact-section";
import HeroSection from "@/components/hero/hero-section";

export default function LandingPage() {
	return (
		<>
			<Header />
			<main className="bg-gray-50">
				<HeroSection />
				<ContactSection />
			</main>
			<Footer />
		</>
	);
}
