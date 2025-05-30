"use client";

import { Brand } from "@/components/ui/brand";
import { AuthButtons } from "./auth-buttons";
import { MobileMenu } from "./mobile-menu";
import { NavItems } from "./nav-items";
import UserAvatar from "@/components/common/user-avatar";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
	const { isAuthenticated, user } = useAuth();
	const userType = user?.role?.toUpperCase().includes("ADMIN")
		? "admin"
		: "applicant";

	return (
		<header className="max-w-screen-2xl mx-auto px-3 lg:px-20 w-full py-4">
			<div className="bg-white shadow-md rounded-50 w-full">
				<div className="flex h-12 md:h-[76px] items-center justify-between px-5 md:px-20 w-full">
					<Brand />
					<NavItems className="hidden lg:flex items-center gap-8" />
					<div className="flex items-center gap-4">
						<div className="hidden lg:block">
							{isAuthenticated ? (
								<UserAvatar userType={userType} />
							) : (
								<AuthButtons />
							)}
						</div>
						<MobileMenu />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
