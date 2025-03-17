import ErrorBoundary from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ErrorBoundary>
			{children}
			<Toaster />
		</ErrorBoundary>
	);
};

export default DashboardLayout;
