"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Notifications } from "@/components/common/notifications";
import { Separator } from "@/components/ui/separator";
// import { ProfileDropdown } from "@/components/layout/admin/header/profile";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AdminHeader = () => {
	return (
		<header className="sticky top-0 z-50 border-b bg-white shadow-sm px-4">
			<div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-4 w-full justify-between">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">Home</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Dashboard</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>

					<div className="flex items-center space-x-4">
						<Notifications />
						{/* <ProfileDropdown /> */}
					</div>
				</div>
			</div>
		</header>
	);
};

export default AdminHeader;
