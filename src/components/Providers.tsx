"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						retry: 1,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 5000,
					style: {
						borderRadius: "10px",
						padding: "16px",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
						fontSize: "14px",
					},
					success: {
						iconTheme: {
							primary: "#10B981",
							secondary: "white",
						},
						style: {
							backgroundColor: "#ECFDF5",
							color: "#065F46",
							border: "1px solid #10B981",
						},
					},
					error: {
						iconTheme: {
							primary: "#EF4444",
							secondary: "white",
						},
						style: {
							backgroundColor: "#FEF2F2",
							color: "#991B1B",
							border: "1px solid #EF4444",
						},
					},
				}}
			/>
		</QueryClientProvider>
	);
}
