"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User } from "lucide-react";

export const ProfileDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center">
				<Avatar className="border border-gray-600">
					<AvatarImage src="/avatar.png" />
					<AvatarFallback>AD</AvatarFallback>
				</Avatar>
				{/* <ChevronDown className="h-4 w-4" /> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>
					<User className="mr-2 h-4 w-4" />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{/* <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem> */}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
