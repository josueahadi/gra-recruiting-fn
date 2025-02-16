import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error-boundary";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ErrorBoundary>
			{children}
			<Toaster />
		</ErrorBoundary>
	);
};

export default DashboardLayout;
