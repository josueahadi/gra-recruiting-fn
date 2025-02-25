"use client";

import Image from "next/image";
import Link from "next/link";

export const Brand = () => {
	return (
		<Link href="/">
			<Image
				src="/brand/growrwanda-logo-horizontal-orientation_black.svg"
				alt="Grow Rwanda Advisors Logo"
				width={193}
				height={35}
				priority
			/>
		</Link>
	);
};
