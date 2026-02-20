import { Suspense } from "react";
import Logo from "./logo";
import NavbarAuth from "./navbar-auth";
import Sidebar from "./navbar-sidebar";

export default function Navbar() {
  return (
    <nav>
      <header className="backdrop-blur-sm sticky top-0 z-50 p-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Suspense
              fallback={
                <div className="flex items-center gap-4">
                  <nav className="hidden lg:flex items-center gap-4" />
                  <Sidebar isLoggedIn={false} />
                </div>
              }
            >
              <NavbarAuth />
            </Suspense>
          </div>
        </div>
      </header>
    </nav>
  );
}
