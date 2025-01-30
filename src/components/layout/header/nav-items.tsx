import Link from "next/link";
import { AuthButtons } from "./auth-buttons";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/solutions", label: "Solutions" },
	{ href: "/contact", label: "Contact Us" },
];

export const NavItems = ({ className = "", isMobile = false }) => (
	<nav className={className}>
		{navLinks.map((link) => (
			<Link
				key={link.href}
				href={link.href}
				className="text-black text-base font-medium hover:text-gray-900 transition-colors duration-300"
			>
				{link.label}
			</Link>
		))}
		{isMobile && (
			<>
				<div className="h-px bg-gray-200 my-4" />
				<AuthButtons className="flex-col" buttonClassName="w-full" />
			</>
		)}
	</nav>
);
