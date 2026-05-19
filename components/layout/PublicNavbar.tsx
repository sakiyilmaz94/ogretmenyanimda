"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/hizmetler",     label: "Hizmetler" },
  { href: "/egitmenlerimiz",label: "Eğitmenlerimiz" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/hakkimizda",    label: "Hakkımızda" },
  { href: "/iletisim",      label: "İletişim" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-navy-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <span className="font-serif text-navy-900 text-lg font-normal tracking-tight">
              Öğretmen<span className="text-gold-500 font-serif">Yanımda</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === l.href
                    ? "text-navy-900 font-semibold"
                    : "text-slate-600 hover:text-navy-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-navy-900 transition-colors duration-200"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-600 transition-colors duration-200 cursor-pointer"
            >
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
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
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pathname === l.href
                  ? "bg-navy-50 text-navy-900 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-white hover:bg-gold-600 transition-colors"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
