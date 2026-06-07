import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Dersler — Öğretmen Yanımda" };

const dersler = {
  ilkokul: {
    label: "İlkokul",
    sinif: "1–4. Sınıf",
    dersler: [
      { ad: "İlk Okuma Yazma", slug: "ilk-okuma-yazma" },
      { ad: "Türkçe", slug: "turkce" },
      { ad: "Matematik", slug: "matematik" },
      { ad: "Hayat Bilgisi", slug: "hayat-bilgisi" },
      { ad: "Fen Bilimleri", slug: "fen-bilimleri" },
      { ad: "Sosyal Bilgiler", slug: "sosyal-bilgiler" },
    ],
  },
  ortaokul: {
    label: "Ortaokul",
    sinif: "5–8. Sınıf",
    dersler: [
      { ad: "Türkçe", slug: "turkce" },
      { ad: "Matematik", slug: "matematik" },
      { ad: "Fen Bilimleri", slug: "fen-bilimleri" },
      { ad: "Sosyal Bilgiler", slug: "sosyal-bilgiler" },
      { ad: "İnkılap Tarihi", slug: "inkilap-tarihi" },
    ],
  },
};

// Ders ikonları — Heroicons (outline) tabanlı SVG'ler (emoji yerine)
const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  "ilk-okuma-yazma": <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />,
  turkce: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />,
  matematik: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Zm-3.75 9h.008v.008H8.25V11.25Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm3.75-4.5h.008v.008H12V11.25Zm0 2.25h.008v.008H12V13.5Zm0 2.25h.008v.008H12v-.008Zm3.75-4.5h.008v.008h-.008V11.25Zm0 2.25h.008v.008h-.008V13.5Z" />,
  "hayat-bilgisi": <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />,
  "fen-bilimleri": <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />,
  "sosyal-bilgiler": <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />,
  "inkilap-tarihi": <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />,
};

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  ilkokul: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />,
  ortaokul: <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />,
};

export default function DerslerPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        <section className="relative overflow-hidden bg-surface-container-low py-20">
          <div className="blob-bg bg-primary-fixed w-72 h-72 rounded-full -top-16 -right-16" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Dersler</p>
              <h1 className="font-display text-headline-xl text-on-background mb-4">Hangi Derste Destek Arıyorsunuz?</h1>
              <p className="text-on-surface-variant text-body-lg">Seviye ve ders seçerek o alanda uzman öğretmenlere ulaşın.</p>
            </div>
            <div className="relative w-full max-w-md mx-auto aspect-video">
              <Image
                src="/illustrations/dersler-hero.png"
                alt="Farklı derslerden seçim yapan öğrenci"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 480px"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {Object.entries(dersler).map(([key, kategori]) => (
              <div key={key}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary-fixed text-on-primary-fixed rounded-xl p-3 w-14 h-14 flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">{LEVEL_ICONS[key]}</svg>
                  </div>
                  <div>
                    <h2 className="font-display text-headline-md text-on-background">{kategori.label}</h2>
                    <p className="text-on-surface-variant text-body-md">{kategori.sinif}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {kategori.dersler.map((ders) => (
                    <Link
                      key={ders.slug}
                      href={`/egitmenlerimiz?seviye=${key}&ders=${ders.slug}`}
                      className="bg-surface-container-lowest rounded-md p-5 flex flex-col items-center gap-3 text-center soft-card group cursor-pointer hover:bg-primary transition-all duration-300"
                    >
                      <svg className="w-8 h-8 text-primary group-hover:text-on-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">{SUBJECT_ICONS[ders.slug]}</svg>
                      <span className="text-label-md text-on-background group-hover:text-on-primary transition-colors">
                        {ders.ad}
                      </span>
                      <span className="text-caption px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed group-hover:bg-on-primary/20 group-hover:text-on-primary transition-colors">
                        {kategori.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-inverse-surface py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-display text-headline-lg text-inverse-on-surface mb-3">Tüm Öğretmenleri Gör</h2>
            <p className="text-inverse-on-surface/70 text-body-lg mb-6">Filtreler ile ders ve sınıf seviyesine göre öğretmenleri bulun.</p>
            <Link
              href="/egitmenlerimiz"
              className="inline-block rounded-full squishy-btn bg-primary text-on-primary px-7 py-3.5 font-semibold"
            >
              Öğretmenleri İncele
            </Link>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
