"use client";

import AuthForm from "@/components/auth/auth-form";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
	const searchParams = useSearchParams();
	const mode = (searchParams.get("mode") as "login" | "signup") || "login";

	return (
		<div className="min-h-screen flex">
			<div className="hidden lg:block lg:fixed lg:w-1/2 h-screen">
				<Image
					width={500}
					height={500}
					src={mode === "login" ? "/images/placeholder.svg" : "/images/placeholder.svg"}
					alt="Grow Rwanda"
					className="w-full h-full object-cover"
					priority
					sizes="50vw"
				/>
			</div>

			<div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 bg-white">
				<AuthForm mode={mode} />
			</div>
		</div>
	);
}
