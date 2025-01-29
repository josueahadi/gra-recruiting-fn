import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  className?: string;
  buttonClassName?: string;
}

export const AuthButtons = ({
  className,
  buttonClassName,
}: AuthButtonsProps) => (
  <div className={cn("flex items-center gap-4 text-base", className)}>
    <Link href="/login" className={cn("w-full", buttonClassName)}>
      <Button
        variant="ghost"
        className={cn(
          "px-6 py-3 bg-blue-500 rounded-3xl text-white transition-colors duration-300 hover:bg-blue-600 hover:text-white font-bold",
          buttonClassName
        )}
      >
        Login
      </Button>
    </Link>
    <Link href="/apply" className={cn("w-full", buttonClassName)}>
      <Button
        className={cn(
          "px-6 py-3 rounded-3xl bg-green-500 text-white transition-colors duration-300 hover:bg-green-600 hover:text-white uppercase font-bold",
          buttonClassName
        )}
      >
        Apply Now
      </Button>
    </Link>
  </div>
);
