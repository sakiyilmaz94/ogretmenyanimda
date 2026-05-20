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

        <section className="bg-ivory py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Dersler</p>
            <h1 className="font-serif text-5xl text-navy-900 mb-4">Hangi Derste Destek Arıyorsunuz?</h1>
            <p className="text-slate-500 text-lg">Seviye ve ders seçerek o alanda uzman öğretmenlere ulaşın.</p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {Object.entries(dersler).map(([key, kategori]) => (
              <div key={key}>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">{kategori.icon}</span>
                  <div>
                    <h2 className="font-serif text-3xl text-navy-900">{kategori.label}</h2>
                    <p className="text-slate-500 text-sm">{kategori.sinif}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {kategori.dersler.map((ders) => (
                    <Link
                      key={ders.slug}
                      href={`/egitmenlerimiz?seviye=${key}&ders=${ders.slug}`}
                      className="flex flex-col items-center gap-3 bg-slate-50 hover:bg-navy-900 border border-slate-100 hover:border-navy-900 rounded-2xl p-5 text-center transition-all duration-300 group cursor-pointer"
                    >
                      <span className="text-3xl">{ders.icon}</span>
                      <span className="text-sm font-semibold text-navy-800 group-hover:text-white transition-colors">
                        {ders.ad}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${kategori.color} group-hover:bg-gold-500 group-hover:text-white group-hover:border-gold-500 transition-colors`}>
                        {kategori.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-navy-900 py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-serif text-3xl text-white mb-3">Tüm Öğretmenleri Gör</h2>
            <p className="text-navy-200 mb-6">Filtreler ile ders ve sınıf seviyesine göre öğretmenleri bulun.</p>
            <Link
              href="/egitmenlerimiz"
              className="inline-block bg-gold-500 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-gold-600 transition-colors"
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
