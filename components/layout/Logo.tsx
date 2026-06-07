// Öğretmen Yanımda — marka logosu (özel SVG, her boyutta net).
// Konsept: konum pini ("yanımda" = yanı başında) + içinde açık kitap (eğitim)
// + altında nane yeşili destek çizgisi. Aydınlık tema, indigo ana renk.

export function LogoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Öğretmen Yanımda logosu"
    >
      {/* Konum pini (teardrop) — indigo gövde */}
      <path
        d="M24 3.5C14.34 3.5 6.5 11.16 6.5 20.6c0 8.86 10.4 18.62 15.06 22.55a3.78 3.78 0 0 0 4.88 0C31.1 39.22 41.5 29.46 41.5 20.6 41.5 11.16 33.66 3.5 24 3.5Z"
        fill="#4648D4"
      />
      {/* Açık kitap — beyaz, pinin başında */}
      <path
        d="M23 13.6c-2.5-1.5-6.2-1.95-9-1.3a1.15 1.15 0 0 0-.9 1.12v9.86a0.95 0.95 0 0 0 1.18.92c2.3-.52 5.45-.2 7.72 1.1Z"
        fill="#F8F9FF"
      />
      <path
        d="M25 13.6c2.5-1.5 6.2-1.95 9-1.3a1.15 1.15 0 0 1 .9 1.12v9.86a0.95 0.95 0 0 1-1.18.92c-2.3-.52-5.45-.2-7.72 1.1Z"
        fill="#F8F9FF"
      />
      {/* Nane yeşili destek/şelf çizgisi (altta) */}
      <rect x="15.5" y="27.2" width="17" height="2.6" rx="1.3" fill="#6CF8BB" />
    </svg>
  );
}

export default LogoMark;
