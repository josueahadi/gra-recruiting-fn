import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* Replace with your logo */}
            <Image
              src="/logo.png"
              alt="GRA Logo"
              width={120}
              height={40}
              priority
            />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#positions" className="text-gray-600 hover:text-gray-900">
              Positions
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8">
            Join Our Team at Grow Rwanda Advisors
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Help shape the future of Rwanda's business landscape through
            strategic consulting and advisory services.
          </p>
        </section>
      </main>
    </div>
  );
}
