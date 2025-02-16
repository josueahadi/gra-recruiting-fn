import ErrorBoundary from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
// import AdminHeader from "./admin-header";
// import ApplicantHeader from "./admin-header";

interface DashboardLayoutProps {
	userType: "admin" | "applicant";
	children: React.ReactNode;
}

// const DashboardLayout = ({ userType, children }: DashboardLayoutProps) => {
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	return (
		<ErrorBoundary>
			<div className="min-h-screen bg-gray-200/85">
				{/* {userType === "admin" ? <AdminHeader /> : <ApplicantHeader />} */}
				{/* <div className="container mx-auto px-4 py-8">{children}</div> */}
				{children}
			</div>
			<Toaster />
		</ErrorBoundary>
	);
};

export default DashboardLayout;
