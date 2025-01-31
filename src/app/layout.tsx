import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/Header";
import { Toaster } from "@/components/ui/toaster";

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
				<Providers>
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
