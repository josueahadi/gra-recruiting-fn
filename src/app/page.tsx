// import ContactSection from "@/components/contact/contact-section";
import HeroSection from "@/components/hero/hero-section";
// import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";

export default function LandingPage() {
	return (
		<>
			<Header />
			<main className="mt-10 lg:mt-16">
				<HeroSection />
				{/* <ContactSection /> */}
			</main>
			{/* <Footer /> */}
		</>
	);
}
