import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButtons } from "./auth-buttons";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about-us", label: "About Us" },
	{ href: "/job-portal", label: "Job Portal" },
];

export const NavItems = ({ className = "", isMobile = false }) => {
	const pathname = usePathname();

	return (
		<nav className={className}>
			{navLinks.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={`text-base font-medium transition-colors duration-200 ${
						pathname === link.href
							? "text-primary-600"
							: "text-gray-900 hover:text-primary-600"
					}`}
				>
					{link.label}
				</Link>
			))}
			{isMobile && (
				<>
					<div className="h-px bg-gray-200 my-4" />
					<AuthButtons className="flex-col" buttonClassName="!w-full" />
				</>
			)}
		</nav>
	);
};
