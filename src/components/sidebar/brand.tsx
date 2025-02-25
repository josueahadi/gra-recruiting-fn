"use client";

import * as React from "react";
import Image from "next/image";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const Brand = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-1 items-center"
				>
					<div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
						<Image
							src="/brand/logo.svg"
							alt="Grow Rwanda Advisors Logo"
							width={66}
							height={64}
							priority
						/>
					</div>
					<div className="flex-1 text-left align-bottom leading-tight text-lg">
						<span className="truncate font-bold uppercase text-black">
							Grow{" "}
						</span>
						<span className="truncate font-medium uppercase">Rwanda</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export default Brand;
