import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	// DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// src/components/layout/admin/header/NotificationBell.tsx
import { Bell } from "lucide-react";

export const Notifications = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="relative" type="button">
					<Bell className="h-5 w-5" />
					<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
						1
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex items-center justify-between p-4">
					<h2 className="font-semibold">Notifications</h2>
					<Button variant="ghost" size="sm">
						Mark all as read
					</Button>
				</div>
				{/* Notification items here */}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
