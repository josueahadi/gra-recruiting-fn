"use client";

import React from "react";
import AppLayout from "@/components/layout/app-layout";
import QuestionsManagement from "@/components/admin/questions-management";

export default function QuestionsPage() {
	return (
		<AppLayout userType="admin">
			<QuestionsManagement />
		</AppLayout>
	);
}
