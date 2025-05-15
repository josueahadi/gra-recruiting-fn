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
// import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { formatUserName } from "@/lib/utils/auth-utils";
import { toast } from "react-hot-toast";

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

export const UserAvatar: React.FC<UserAvatarProps> = ({
	userType,
	userName = "",
	avatarSrc = "/images/avatar.jpg",
	menuItems,
	onLogout,
}) => {
	const { signOut, displayName, user, refreshProfile } = useAuth();

	// We prioritize data from the auth store, then fall back to props
	const actualUserName =
		displayName ||
		(user ? formatUserName(user.firstName, user.lastName) : userName);

	// Try to load user profile if not already loaded or if it's temporary
	useEffect(() => {
		if (!user || user.isTemporary) {
			refreshProfile().catch(() => {
				// Silent failure - the UI will use fallback values
			});
		}
	}, [user, refreshProfile]);

	const getInitials = useCallback((): string => {
		if (!actualUserName) {
			return userType === "admin" ? "AD" : "JD";
		}

		// Show loading indicator if user data is temporary
		if (user?.isTemporary) {
			return "...";
		}

		return actualUserName
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}, [actualUserName, userType, user]);

	const handleLogout = () => {
		try {
			if (onLogout) {
				onLogout();
			} else {
				console.log("[UserAvatar] Logging out using auth hook...");
				signOut();
			}
		} catch (error) {
			console.error("[UserAvatar] Error during logout:", error);
			toast.error("There was a problem signing out. Please try again.");
		}
	};

	const defaultMenuItems = [
		{
			icon: <User className="mr-2 h-4 w-4" />,
			label: "Account",
			href: userType === "admin" ? "/admin/settings" : "/applicant/settings",
		},
		{
			icon: <LogOut className="mr-2 h-4 w-4" />,
			label: "Sign Out",
			onClick: handleLogout,
		},
	];

	const itemsToRender = menuItems || defaultMenuItems;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="p-0 h-auto">
					<Avatar className="h-10 w-10 border-2 border-primary-light cursor-pointer">
						<AvatarImage src={avatarSrc} alt={actualUserName || "User"} />
						<AvatarFallback>{getInitials()}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				{actualUserName && (
					<>
						<div className="px-2 py-1.5 text-sm font-medium text-gray-700">
							{actualUserName}
							{user?.email && (
								<div className="text-xs text-gray-500 mt-1 truncate">
									{user.email}
								</div>
							)}
						</div>
						<DropdownMenuSeparator />
					</>
				)}

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
