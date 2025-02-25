import Image from "next/image";
import Link from "next/link";

export const Brand = () => {
	return (
		<Link href="/">
			<Image
				src="/brand/growrwanda-logo-horizontal-orientation_black.svg"
				alt="Grow Rwanda Advisors Logo"
				width={296}
				height={48}
				priority
			/>
		</Link>
	);
};
