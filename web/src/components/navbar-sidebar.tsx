"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

type SidebarProps = {
  isLoggedIn: boolean;
};

export default function Sidebar({ isLoggedIn }: SidebarProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Menu
          className="text-cream w-10 h-18"
          role="button"
          aria-label="mobile menu"
          onClick={() => setVisible(true)}
        />
      </div>

      {visible &&
        createPortal(
          <div
            className="fixed inset-0 z-90 bg-black/40 lg:hidden transition-opacity duration-300"
            role="button"
            aria-label="closing mobile menu"
            onClick={() => setVisible(false)}
          >
            {/* sidebar for smaller screens */}
            <div
              className={`fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-kala z-100 transform transition-transform duration-500 ease-in-out ${visible ? "translate-x-0" : "translate-x-full"}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col text-cream">
                {/* icon for the back button */}
                <div
                  className="flex items-center gap-1 p-3 cursor-pointer"
                  role="button"
                  aria-label="close mobile menu"
                  onClick={() => setVisible(false)}
                >
                  <X className="icons text-cream" />
                  <p className="text-cream">Back</p>
                </div>

                <div className="px-4 pt-2">
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      className="block py-3 text-xl logo"
                      onClick={() => setVisible(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="block py-3 text-xl logo"
                      onClick={() => setVisible(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
