import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/assets/growrwanda-logo-horizontal-orientation_black.png"
        alt="Grow Rwanda Advisors Logo"
        width={220}
        height={60}
        priority
      />
    </Link>
  );
};
