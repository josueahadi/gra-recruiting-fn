import DashboardLayout from "@/components/layout/dashboard/dashboard-layout";
import AdminHeader from "@/components/layout/dashboard/admin-header";

export default function AdminDashboardPage() {
	return (
		<DashboardLayout userType="admin">
			<AdminHeader />
			<main className="flex items-center justify-center mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold">Admin Dashboard</h1>
				{/* Add your dashboard content here */}
			</main>
		</DashboardLayout>
	);
}
