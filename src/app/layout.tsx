import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { BackgroundGradient } from "@/components/layout/background-gradient";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";
import { AuthCheck } from "@/components/auth/auth-check";

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
					<AuthCheck>{children}</AuthCheck>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
