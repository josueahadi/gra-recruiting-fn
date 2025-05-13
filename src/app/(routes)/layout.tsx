import ErrorBoundary from "@/components/error-boundary";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ErrorBoundary>
			{children}
		</ErrorBoundary>
	);
};

export default DashboardLayout;
