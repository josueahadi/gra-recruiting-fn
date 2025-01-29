import { Logo } from "./Logo";
import { NavItems } from "./NavItems";
import { AuthButtons } from "./AuthButtons";
import { MobileMenu } from "./MobileMenu";

const Header = () => {
  return (
    <header className="top-0 w-full sticky transition-all bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="mx-auto px-5 md:px-10 py-3 md:py-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <NavItems className="hidden lg:flex items-center gap-8" />
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <AuthButtons />
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
