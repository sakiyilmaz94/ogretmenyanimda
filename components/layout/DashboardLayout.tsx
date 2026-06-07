"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/dashboard/NotificationBell";
import NavIcon, { type NavIconName } from "@/components/layout/NavIcon";

interface NavItem {
  href: string;
  label: string;
  icon: NavIconName;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo alanı */}
      <div className="px-6 py-6 border-b border-outline-variant">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="font-display text-inverse-on-surface font-bold text-base leading-none">
              Öğretmen<span className="font-bold">Yanımda</span>
            </p>
            <p className="text-xs text-inverse-on-surface/60 mt-0.5">{title}</p>
          </div>
        </Link>
      </div>

      {/* Nav linkleri */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/") && item.href.split("/").length > 2);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-label-md transition-colors",
                active
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-primary-fixed hover:text-on-background"
              )}
            >
              <NavIcon name={item.icon} className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Alt kullanıcı alanı */}
      <div className="px-4 py-4 border-t border-outline-variant">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="min-w-0">
            <p className="text-inverse-on-surface font-medium text-label-md truncate">{session?.user?.name}</p>
            <p className="text-inverse-on-surface/50 text-xs truncate">{session?.user?.email}</p>
          </div>
          <NotificationBell />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-label-md text-inverse-on-surface/70 hover:bg-error/20 hover:text-error transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-inverse-surface border-r border-outline-variant flex-col fixed h-full hidden lg:flex z-30">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "w-64 bg-inverse-surface border-r border-outline-variant flex-col fixed h-full z-50 transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
            className="p-2 rounded-full text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="font-display font-bold text-on-background text-headline-md">{title}</p>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
