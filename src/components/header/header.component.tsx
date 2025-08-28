"use client";
import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AboutModal from "../modal/about-modal.component";
import ContactModal from "../modal/contact-modal.component";
import HelpModal from "../modal/help-modal.component";
import { MotionCard, MotionHoverText } from "../utils/motion-wrapper";

type User = {
  role?: string;
  studentId?: string;
  email?: string;
  [k: string]: any;
};

export default function Header(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  // Close overlays on navigation change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setShowAbout(false);
    setShowHelp(false);
    setShowContact(false);
  }, [pathname]);

  // Click outside handler for dropdown & mobile menu
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownOpen &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileOpen &&
        mobileRef.current &&
        !mobileRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
        setShowAbout(false);
        setShowHelp(false);
        setShowContact(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdownOpen, mobileOpen]);

  // Example: load user from localStorage safely
  useEffect(() => {
    try {
      const raw = localStorage.getItem("saas-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("saas-user");
    } catch {}
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  }, [router]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background text-foreground shadow-sm"
        style={{
          fontFamily:
            'var(--font-geist-sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial)',
        }}>
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 pl-2 sm:pl-4 md:pl-6 lg:pl-8">
            <Link
              href="/"
              className="flex items-center gap-2 no-underline"
              style={{ WebkitTapHighlightColor: "transparent" }}>
              {/* <Image
                src="/logo1.jpg"
                alt="School Logo 1"
                width={40}
                height={40}
                className="rounded-md object-contain"
                priority={false}
              /> */}
              <Image
                src="/logo2.png"
                alt="School Logo 2"
                width={40}
                height={40}
                className="rounded-md object-contain"
                priority={false}
              />

              <span
                className="flex-1 text-center md:text-left font-semibold truncate"
                style={{ fontSize: "clamp(14px, 2.5vw, 20px)" }}>
                Student Academic Assessment System
              </span>
            </Link>
          </div>

          {/* Center: Spacer (flex-grow pushes nav to right) */}
          {/* <div className="flex-grow hidden md:block" /> */}

          {/* Right: Navigation + Actions */}
          <div className="flex items-center gap-6">
            <nav
              className="hidden md:flex items-center space-x-6"
              role="navigation"
              aria-label="Primary navigation">
              <MotionHoverText>
                <button
                  onClick={() => setShowAbout(true)}
                  className="text-md font-medium hover:text-gray-900 transition cursor-pointer">
                  About
                </button>
              </MotionHoverText>
              <MotionHoverText>
                <button
                  onClick={() => setShowHelp(true)}
                  className="text-md font-medium hover:text-gray-900 transition cursor-pointer">
                  Help
                </button>
              </MotionHoverText>
              <MotionHoverText>
                <button
                  onClick={() => setShowContact(true)}
                  className="text-md font-medium hover:text-gray-900 transition cursor-pointer">
                  Contact
                </button>
              </MotionHoverText>
              <MotionHoverText>
                <Link
                  href="/login"
                  className="text-md font-medium hover:text-gray-900 transition">
                  Login
                </Link>
              </MotionHoverText>
            </nav>

            {/* Mobile toggle and dropdown */}
            <div className="flex items-center gap-3 mr-1.5">
              {user && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="px-2 py-1 rounded-md hover:bg-muted/5">
                    {user.email ? user.email.split("@")[0] : "Account"}
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-md shadow-md overflow-hidden z-50 transform -translate-x-4 md:translate-x-0">
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-muted/5"
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push("/account-settings");
                          }}>
                          Account Settings
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-muted/5"
                          onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              )}

              <div ref={mobileRef} className="md:hidden">
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted/10"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    {mobileOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-2">
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/5"
                onClick={() => {
                  setShowAbout(true);
                  setMobileOpen(false);
                }}>
                About
              </button>

              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/5"
                onClick={() => {
                  setShowHelp(true);
                  setMobileOpen(false);
                }}>
                Help
              </button>

              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/5"
                onClick={() => {
                  setShowContact(true);
                  setMobileOpen(false);
                }}>
                Contact
              </button>

              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-block">
                  <span className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/5 text-base md:text-lg">
                    Login
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
