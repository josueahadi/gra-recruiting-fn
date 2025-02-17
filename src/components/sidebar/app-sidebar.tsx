"use client";

import {
	Settings2,
	LayoutDashboard,
	UsersRound,
	ShieldQuestion,
	CircleEllipsis,
} from "lucide-react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import Brand from "@/components/sidebar/brand";

// This is sample data.
const data = {
	user: {
		name: "John Doe",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "#",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Applicants",
			url: "#",
			icon: UsersRound,
		},
		{
			title: "Questions",
			url: "#",
			icon: ShieldQuestion,
		},
		{
			title: "Pending List",
			url: "#",
			icon: CircleEllipsis,
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="h-16">
				<Brand />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
