"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-16">
			<div className="mx-auto flex max-w-2xl flex-col items-center text-center">
				<div className="relative mb-8 h-40 w-40 md:h-56 md:w-56">
					<Image
						src="/brand/logo.svg"
						alt="Grow Rwanda Logo"
						fill
						className="object-contain"
					/>
				</div>

				<h1 className="text-5xl font-bold text-gray-900 md:text-6xl">404</h1>
				<h2 className="mt-4 text-2xl font-bold tracking-tight text-primary-base md:text-3xl">
					Page not found
				</h2>

				<p className="mt-6 text-base leading-7 text-gray-600 md:text-lg">
					Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
					moved.
				</p>

				<div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					<Button
						onClick={() => router.back()}
						variant="outline"
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Go Back
					</Button>

					<Button asChild>
						<Link href="/">Return Home</Link>
					</Button>
				</div>
			</div>

			<div className="mt-16 max-w-xs text-center text-gray-500">
				<p className="text-sm">
					Need assistance? Contact us at{" "}
					<a
						href="mailto:contact.info@growrwanda.com"
						className="font-medium text-primary-base hover:underline"
					>
						contact.info@growrwanda.com
					</a>
				</p>
			</div>
		</div>
	);
}
