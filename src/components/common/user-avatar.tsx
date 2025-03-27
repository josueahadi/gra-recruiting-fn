// components/common/user-avatar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export interface UserAvatarProps {
	userType: "applicant" | "admin";
	userName?: string;
	avatarSrc?: string;
	menuItems?: Array<{
		icon: React.ReactNode;
		label: string;
		href?: string;
		onClick?: () => void;
	}>;
	onLogout?: () => void;
	className?: string;
}

/**
 * Reusable user avatar component with dropdown menu
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
	userType,
	userName = "",
	avatarSrc = "/images/avatar.jpg",
	menuItems,
	onLogout,
}) => {
	const router = useRouter();

	// Generate fallback initials for avatar
	const getInitials = (): string => {
		if (userType === "admin") return "AD";

		// If we have a username, use their initials
		if (userName) {
			return userName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.substring(0, 2);
		}

		return "JD"; // John Doe default
	};

	// Default logout handler
	const handleLogout = () => {
		if (onLogout) {
			onLogout();
		} else {
			console.log("Logging out...");
			// Default logout implementation
			// In a real app, this would call an API or auth service
			router.push("/login");
		}
	};

	// Default menu items if none are provided
	const defaultMenuItems = [
		{
			icon: <User className="mr-2 h-4 w-4" />,
			label: "Account",
			href: userType === "admin" ? "/admin/profile" : "/applicant",
		},
		{
			icon: <LogOut className="mr-2 h-4 w-4" />,
			label: "Logout",
			onClick: handleLogout,
		},
	];

	const itemsToRender = menuItems || defaultMenuItems;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="p-0 h-auto">
					<Avatar className="h-10 w-10 border-2 border-primary-light cursor-pointer">
						<AvatarImage src={avatarSrc} alt={userName || "User"} />
						<AvatarFallback>{getInitials()}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				{itemsToRender.map((item, index) => (
					<React.Fragment
						key={`menu-item-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
					>
						{index > 0 && <DropdownMenuSeparator />}
						<DropdownMenuItem
							asChild={!!item.href}
							onClick={item.onClick}
							className="cursor-pointer"
						>
							{item.href ? (
								<Link href={item.href}>
									{item.icon}
									<span>{item.label}</span>
								</Link>
							) : (
								<>
									{item.icon}
									<span>{item.label}</span>
								</>
							)}
						</DropdownMenuItem>
					</React.Fragment>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatar;
