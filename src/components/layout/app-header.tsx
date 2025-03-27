"use client";

import { Notifications } from "@/components/common/notifications";
import UserAvatar, {
	type UserAvatarProps,
} from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export interface AppHeaderProps {
	title: string;
	userType: "applicant" | "admin";
	userName?: string;
	avatarSrc?: string;
	onMenuToggle?: () => void;
	showMobileMenu?: boolean;
	showNotifications?: boolean;
	avatarProps?: Omit<UserAvatarProps, "userType">;
	className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
	title,
	userType,
	userName,
	avatarSrc,
	onMenuToggle,
	showMobileMenu = true,
	showNotifications = true,
	avatarProps,
	className,
}) => {
	return (
		<header className={cn("pt-5 px-4 md:px-12", className)}>
			<div className="mx-auto flex justify-between items-center">
				<div className="flex items-center">
					{showMobileMenu && (
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-700 md:hidden mr-2"
							onClick={onMenuToggle}
							aria-label="Toggle menu"
						>
							<Menu className="h-6 w-6" />
						</Button>
					)}
					<h1 className="text-2xl font-semibold text-primary-shades-800">
						{title}
					</h1>
				</div>

				<div className="flex items-center gap-4">
					{showNotifications && <Notifications />}

					<UserAvatar
						userType={userType}
						userName={userName}
						avatarSrc={avatarSrc}
						{...avatarProps}
					/>
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
