// src/components/layout/admin/header/NotificationBell.tsx
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	// DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Notifications = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					<div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
						3
					</div>
				</Button>
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
