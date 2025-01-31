import Image from "next/image";
import Link from "next/link";
import {
	FaEnvelope,
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaPhoneAlt,
	FaYoutube,
} from "react-icons/fa";

const navigationlinks = {
	main: [
		{ title: "Home", href: "/" },
		{ title: "About", href: "/about" },
		{ title: "Contact", href: "/contact" },
		{ title: "Portfolio", href: "/portfolio" },
		{ title: "Services", href: "/services" },
	],
	resources: [
		{ title: "Blog", href: "/blog" },
		{ title: "Privacy", href: "/privacy" },
		{ title: "Terms", href: "/terms" },
		{ title: "Career", href: "/career" },
	],
	social: [
		{ icon: FaLinkedin, href: "#", label: "LinkedIn" },
		{ icon: FaInstagram, href: "#", label: "Instagram" },
		{ icon: FaFacebook, href: "#", label: "Facebook" },
		{ icon: FaYoutube, href: "#", label: "YouTube" },
	],
};

const Footer = () => {
	return (
		<footer className="relative bg-[#205B76] text-gray-50">
			<div
				className="absolute inset-0 opacity-75"
				style={{
					backgroundImage: "url('/images/growrwanda-pattern-01.svg')",
					backgroundSize: "cover",
				}}
			/>
			<div className="container relative">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 py-10">
					{/* Logo Section */}
					<div className="md:col-span-2">
						<Image
							src="/icons/growrwanda-logo-horizontal-orientation_white.svg"
							alt="Grow Rwanda Logo"
							width={296}
							height={53}
							className="mb-6"
						/>

						<p className="hover:text-white text-sm mb-8 max-w-md">
							We are a business process outsourcing firm based
							<br /> in Kigali, Rwanda that helps US based companies
							<br /> achieve their goals through strategic outsourcing
						</p>

						<div className="flex gap-4">
							{navigationlinks.social.map(({ icon: Icon, href, label }) => (
								<Link
									key={label}
									href={href}
									className="hover:text-white transition-colors"
									aria-label={label}
								>
									<Icon size={24} />
								</Link>
							))}
						</div>
					</div>

					{/* Links Section */}
					<div className="">
						<h3 className="font-semibold text-lg mb-4">Links</h3>
						<span className="space-y-2">
							{navigationlinks.main.map((link) => (
								<Link
									key={link.title}
									href={link.href}
									className="block hover:text-white transition-colors text-sm"
								>
									{link.title}
								</Link>
							))}
						</span>
					</div>

					{/* Resources Section */}
					<div className="">
						<h3 className="font-semibold text-lg mb-4">Resources</h3>
						<span className="space-y-2">
							{navigationlinks.resources.map((link) => (
								<Link
									key={link.title}
									href={link.href}
									className="block hover:text-white transition-colors text-sm"
								>
									{link.title}
								</Link>
							))}
						</span>
					</div>

					{/* Contact Section */}
					<div>
						<h3 className="font-semibold text-lg mb-4">Contact Us</h3>
						<div className="space-y-2 text-sm">
							<p className="flex flex-row items-center gap-2">
								<FaPhoneAlt className="" size={16} />
								<span className="">+250788866643</span>
							</p>
							<p className="flex flex-row flex-wrap items-center gap-2">
								<FaEnvelope className="" size={16} />
								<span className="">contact.info@growrwanda.com</span>
							</p>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-50/85">
					<div className="pt-2 pb-6 text-center text-gray-50/85">
						Grow Rwanda Advisors Ltd.© 2024
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
