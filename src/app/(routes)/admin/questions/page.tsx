"use client";

import QuestionsManagement from "@/components/admin/questions-management";
import AppLayout from "@/components/layout/app-layout-updated";
import React from "react";

export default function QuestionsPage() {
	return (
		<AppLayout userType="admin">
			<QuestionsManagement />
		</AppLayout>
	);
}
