"use client";

import AuthForm from "@/components/auth/auth-form";
import { Brand } from "@/components/ui/brand";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
	const searchParams = useSearchParams();
	const mode = (searchParams.get("mode") as "login" | "signup") || "login";

	return (
		<div className="min-h-screen flex flex-col">
			<div className="p-4">
				<Brand />
			</div>
			<div className="flex-1 flex items-center justify-center p-8 ">
				<AuthForm mode={mode} />
			</div>
		</div>
	);
}
