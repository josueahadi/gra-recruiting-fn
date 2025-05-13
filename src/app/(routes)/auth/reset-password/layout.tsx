import type { ReactNode } from "react";
import { Suspense } from "react";
import { Brand } from "@/components/ui/brand";

export default function ResetPasswordLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-white">
			<div className="p-4">
				<Brand />
			</div>
			<div className="flex-1 flex items-center justify-center p-8">
				<Suspense fallback={null}>{children}</Suspense>
			</div>
		</div>
	);
}
