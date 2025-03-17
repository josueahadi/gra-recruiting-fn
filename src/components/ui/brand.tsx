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
				className="w-32 h-10 md:w-[193px] md:h-[35px]"
			/>
		</Link>
	);
};
