"use client";

import { Brand } from "@/components/ui/brand";
import { AuthButtons } from "./auth-buttons";
import { MobileMenu } from "./mobile-menu";
import { NavItems } from "./nav-items";

const Header = () => {
	return (
		<header className="max-w-[1400px] top-4 md:top-10 mx-4 md:mx-20 sticky transition-all z-50 bg-white shadow-md rounded-50">
			<div className="flex h-14 md:h-[76px] items-center justify-between px-5 md:px-20">
				<Brand />
				<NavItems className="hidden lg:flex items-center gap-8" />
				<div className="flex items-center gap-4">
					<div className="hidden lg:block">
						<AuthButtons />
					</div>
					<MobileMenu />
				</div>
			</div>
		</header>
	);
};

export default Header;
