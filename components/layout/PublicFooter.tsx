import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";

const footerLinks = {
  platform: [
    { href: "/hizmetler",      label: "Hizmetler" },
    { href: "/egitmenlerimiz", label: "Öğretmenlerimiz" },
    { href: "/fiyatlandirma",  label: "Fiyatlandırma" },
    { href: "/hakkimizda",     label: "Hakkımızda" },
  ],
  destek: [
    { href: "/sss",               label: "SSS" },
    { href: "/iletisim",          label: "İletişim" },
    { href: "/egitmen-basvurusu", label: "Öğretmen Başvurusu" },
  ],
  yasal: [
    { href: "/gizlilik-politikasi",       label: "Gizlilik Politikası" },
    { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
    { href: "/iptal-ve-iade-kosullar",    label: "İptal ve İade" },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-surface-container-low text-on-surface-variant border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <LogoMark className="w-9 h-9 shrink-0" />
              <span className="font-display text-primary text-lg font-semibold tracking-tight">
                Öğretmen<span className="text-on-background font-bold">Yanımda</span>
              </span>
            </Link>
            <p className="text-sm text-inverse-on-surface/70 leading-relaxed mb-6">
              İlkokul ve ortaokul öğrencileri için uzman öğretmenlerle bireysel ve grup dersleri platformu.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-surface-container rounded-full flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-colors duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display text-label-md text-inverse-on-surface uppercase tracking-wider mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h4 className="font-display text-label-md text-inverse-on-surface uppercase tracking-wider mb-5">
              Destek
            </h4>
            <ul className="space-y-3">
              {footerLinks.destek.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h4 className="font-display text-label-md text-inverse-on-surface uppercase tracking-wider mb-5">
              Yasal
            </h4>
            <ul className="space-y-3">
              {footerLinks.yasal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-outline/20 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-inverse-on-surface/55">
            © {new Date().getFullYear()} Öğretmen Yanımda. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-inverse-on-surface/55">
            Türkiye&apos;nin güvenilir özel ders platformu
          </p>
        </div>
      </div>
    </footer>
  );
}
