"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dersler",        label: "Dersler" },
  { href: "/egitmenlerimiz", label: "Öğretmenlerimiz" },
  { href: "/fiyatlandirma",  label: "Fiyatlandırma" },
  { href: "/hakkimizda",     label: "Hakkımızda" },
  { href: "/iletisim",       label: "İletişim" },
];

function dashboardUrl(role: string | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "EDUCATOR") return "/educator";
  if (role === "PARENT") return "/parent";
  return "/";
}

export default function PublicNavbar({ role }: { role?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 mx-4">
      <div className="max-w-container-max mx-auto">
        <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-navbar px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <span className="font-display text-on-background text-lg font-semibold tracking-tight">
              Öğretmen<span className="text-primary font-bold">Yanımda</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-full text-label-md transition-colors duration-200 ${
                  pathname === l.href
                    ? "text-primary font-bold border-b-2 border-primary bg-primary-fixed/30"
                    : "text-on-surface-variant hover:text-primary hover:bg-primary-fixed/20"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {role ? (
              <Link
                href={dashboardUrl(role)}
                className="bg-primary text-on-primary px-6 py-2 rounded-full text-label-md font-bold squishy-btn transition-colors duration-200"
              >
                Panelim →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200 px-4 py-2 rounded-full hover:bg-primary-fixed/20"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-on-primary px-6 py-2 rounded-full text-label-md font-bold squishy-btn"
                >
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Menüyü aç/kapat"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 bg-surface-container-low rounded-2xl p-4 shadow-navbar space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-label-md transition-colors duration-200 ${
                  pathname === l.href
                    ? "bg-primary-fixed text-on-primary-fixed font-bold"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-outline-variant/30 flex flex-col gap-2">
              {role ? (
                <Link
                  href={dashboardUrl(role)}
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-3 rounded-full text-label-md font-bold bg-primary text-on-primary squishy-btn"
                >
                  Panelim →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block text-center px-4 py-3 rounded-full text-label-md font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="block text-center px-4 py-3 rounded-full text-label-md font-bold bg-primary text-on-primary squishy-btn"
                  >
                    Ücretsiz Başla
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
