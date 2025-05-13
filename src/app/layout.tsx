import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { BackgroundGradient } from "@/components/layout/background-gradient";
import Providers from "@/components/providers";
import { AuthCheck } from "@/components/auth/auth-check";
import { ToastProvider } from "@/services/toast";
import { Suspense } from "react";

const raleway = Raleway({
	subsets: ["latin"],
	variable: "--font-raleway",
});

export const metadata: Metadata = {
	title: "Grow Rwanda Advisors Recruiting",
	description: "Unlock Your Potential With The Right Opportunity",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${raleway.variable} font-sans antialiased`}>
				<BackgroundGradient />
				<Providers>
					<ToastProvider>
						<Suspense fallback={null}>
							<AuthCheck>{children}</AuthCheck>
						</Suspense>
					</ToastProvider>
				</Providers>
			</body>
		</html>
	);
}
