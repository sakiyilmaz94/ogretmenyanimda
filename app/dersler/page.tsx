import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata = { title: "Dersler — Öğretmen Yanımda" };

const dersler = {
  ilkokul: {
    label: "İlkokul",
    sinif: "1–4. Sınıf",
    color: "bg-blue-50 border-blue-100 text-blue-700",
    accent: "bg-blue-600",
    icon: "📚",
    dersler: [
      { ad: "İlk Okuma Yazma", slug: "ilk-okuma-yazma", icon: "✏️" },
      { ad: "Türkçe", slug: "turkce", icon: "📖" },
      { ad: "Matematik", slug: "matematik", icon: "🔢" },
      { ad: "Hayat Bilgisi", slug: "hayat-bilgisi", icon: "🌱" },
      { ad: "Fen Bilimleri", slug: "fen-bilimleri", icon: "🔬" },
      { ad: "Sosyal Bilgiler", slug: "sosyal-bilgiler", icon: "🗺️" },
    ],
  },
  ortaokul: {
    label: "Ortaokul",
    sinif: "5–8. Sınıf",
    color: "bg-purple-50 border-purple-100 text-purple-700",
    accent: "bg-purple-600",
    icon: "🎓",
    dersler: [
      { ad: "Türkçe", slug: "turkce", icon: "📖" },
      { ad: "Matematik", slug: "matematik", icon: "🔢" },
      { ad: "Fen Bilimleri", slug: "fen-bilimleri", icon: "🔬" },
      { ad: "Sosyal Bilgiler", slug: "sosyal-bilgiler", icon: "🗺️" },
      { ad: "İnkılap Tarihi", slug: "inkilap-tarihi", icon: "📜" },
    ],
  },
};

export default function DerslerPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        <section className="relative overflow-hidden bg-[url('/hero.png')] bg-cover bg-center py-24 text-center">
          <div className="absolute inset-0 bg-on-background/55" />
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Dersler</p>
            <h1 className="font-display text-headline-xl text-on-primary mb-4">Hangi Derste Destek Arıyorsunuz?</h1>
            <p className="text-on-primary/80 text-body-lg">Seviye ve ders seçerek o alanda uzman öğretmenlere ulaşın.</p>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {Object.entries(dersler).map(([key, kategori]) => (
              <div key={key}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary-fixed rounded-xl p-3 w-14 h-14 flex items-center justify-center shrink-0">
                    <span className="text-2xl">{kategori.icon}</span>
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
                      <span className="text-3xl">{ders.icon}</span>
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
