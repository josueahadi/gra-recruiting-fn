"use client";

import AdminDashboard from "@/components/admin/admin-dashboard";
import AppLayout from "@/components/layout/app-layout-updated";
import React from "react";

export default function AdminDashboardPage() {
	return (
		<AppLayout userType="admin" userName="Admin User">
			<AdminDashboard />
		</AppLayout>
	);
}
