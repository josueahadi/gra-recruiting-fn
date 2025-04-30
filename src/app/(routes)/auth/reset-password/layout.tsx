import Image from "next/image";
import type { ReactNode } from "react";

export default function ResetPasswordLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen flex">
			<div className="hidden lg:block lg:fixed lg:w-1/2 h-screen">
				<Image
					width={500}
					height={500}
					src="/images/placeholder.svg"
					alt="Grow Rwanda"
					className="w-full h-full object-cover"
					priority
					sizes="50vw"
				/>
			</div>

			<div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 bg-white">
				{children}
			</div>
		</div>
	);
}
