"use client";

import React from "react";
import AppLayout from "@/components/layout/app-layout";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default function AdminDashboardPage() {
	return (
		<AppLayout userType="admin">
			<AdminDashboard />
		</AppLayout>
	);
}
