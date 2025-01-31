import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButtons } from "./auth-buttons";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/solutions", label: "Solutions" },
	{ href: "/contact", label: "Contact Us" },
];

export const NavItems = ({ className = "", isMobile = false }) => {
	const pathname = usePathname();

	return (
		<nav className={className}>
			{navLinks.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={`text-base font-medium transition-colors duration-300 ${
						pathname === link.href
							? "text-primary-base"
							: "text-black hover:text-gray-900"
					}`}
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
};
