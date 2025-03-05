"use client";

import { Brand } from "@/components/ui/brand";
import { AuthButtons } from "./auth-buttons";
import { MobileMenu } from "./mobile-menu";
import { NavItems } from "./nav-items";

const Header = () => {
	return (
		<header className="max-w-screen-2xl mx-auto px-3 lg:px-20 top-4 md:top-10 sticky transition-all z-50 w-full">
			<div className=" bg-white shadow-md rounded-50 w-full">
				<div className="flex h-12 md:h-[76px] items-center justify-between px-5 md:px-20 w-full">
					<Brand />
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
