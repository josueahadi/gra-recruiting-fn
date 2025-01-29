import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavItems } from "./NavItems";

export const MobileMenu = () => (
  <Sheet>
    <SheetTrigger className="lg:hidden">
      <Menu className="h-6 w-6" />
    </SheetTrigger>
    <SheetContent side="right">
      <NavItems className="flex flex-col space-y-4 mt-8" isMobile={true} />
    </SheetContent>
  </Sheet>
);
