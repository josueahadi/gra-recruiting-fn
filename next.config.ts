import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.growrwanda.com",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: false,
	},
};

export default nextConfig;
