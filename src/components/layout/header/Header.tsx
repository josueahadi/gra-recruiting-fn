"use client";

import { useEffect, useRef, useState } from "react";
import { AuthButtons } from "./auth-buttons";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavItems } from "./nav-items";

const Header = () => {
	const headerRef = useRef<HTMLElement>(null);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				headerRef.current?.classList.add("shadow-2xl");
				setIsScrolled(true);
			} else {
				headerRef.current?.classList.remove("shadow-2xl");
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			ref={headerRef}
			className="top-0 w-full sticky transition-all bg-white backdrop-blur-sm border-b z-50"
		>
			<div
				className={`2xl:max-w-screen-2xl mx-auto px-4 md:px-10 transition-all duration-200 ${
					isScrolled ? "py-1" : "py-3"
				}`}
			>
				<div className="flex h-16 items-center justify-between">
					<Logo />
					<NavItems className="hidden lg:flex items-center gap-8" />
					<div className="flex items-center gap-4">
						<div className="hidden lg:block">
							<AuthButtons />
						</div>
						<MobileMenu />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
