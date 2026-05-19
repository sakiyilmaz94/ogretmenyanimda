import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata = { title: "Hizmetler — Öğretmen Yanımda" };

const services = [
  {
    title: "Bireysel Dersler",
    subtitle: "45 dk · Birebir Eğitim",
    desc: "Öğrencinin güçlü ve zayıf yönleri analiz edilerek kişiselleştirilmiş müfredat hazırlanır. Eğitmen dikkatinin tamamı tek öğrenciye yönelir.",
    features: ["Kişiselleştirilmiş müfredat", "Esnek saat seçimi", "Haftalık ilerleme raporu", "Ödev takibi", "Ebeveyn bilgilendirme"],
    color: "bg-navy-900",
    accent: "text-gold-400",
  },
  {
    title: "Grup Dersleri",
    subtitle: "60 dk · Maks. 6 Öğrenci",
    desc: "Küçük gruplarla sosyal öğrenme ortamı. Akranlarla birlikte problem çözmek hem motivasyonu artırır hem de uygun fiyatlıdır.",
    features: ["Uygun fiyatlı seçenek", "Sosyal beceri gelişimi", "Rekabetçi öğrenme ortamı", "Grup ödevi ve projeler", "Haftalık grup raporu"],
    color: "bg-gold-500",
    accent: "text-white",
  },
  {
    title: "Öğrenci Koçluğu",
    subtitle: "45 dk · Motivasyon & Strateji",
    desc: "Akademik başarının temelinde doğru çalışma alışkanlıkları yatar. Koçluk seanslarıyla hedef belirleme, zaman yönetimi ve motivasyon desteklenir.",
    features: ["Hedef belirleme & takip", "Çalışma planı oluşturma", "Sınav strateji eğitimi", "Motivasyon seansları", "Ebeveyn & öğrenci görüşmesi"],
    color: "bg-sage-500",
    accent: "text-white",
  },
];

const subjects = [
  "Matematik", "Türkçe", "Fen Bilgisi", "Sosyal Bilgiler",
  "İngilizce", "Almanca", "Tarih", "Coğrafya",
  "Fizik", "Kimya", "Biyoloji", "Mantık",
];

export default function HizmetlerPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-ivory py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Hizmetlerimiz</p>
            <h1 className="font-serif text-5xl text-navy-900 mb-4">Kişiye Özel Eğitim</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Bireysel ve grup dersleriyle kişiye özel eğitim. Öğrencilerimizin başarısı için uzman öğretmenlerle çeşitli ders seçenekleri.
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {services.map((s, i) => (
              <div key={s.title} className={`rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <div className={`${s.color} p-10 flex flex-col justify-center`}>
                    <p className={`text-sm font-semibold ${s.accent} opacity-80 mb-2`}>{s.subtitle}</p>
                    <h2 className={`font-serif text-3xl text-white mb-3`}>{s.title}</h2>
                    <p className="text-white/80 text-base leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="bg-slate-50 p-10 flex flex-col justify-center">
                    <h3 className="font-semibold text-navy-900 mb-4">Neler Dahil?</h3>
                    <ul className="space-y-3">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                          <svg className="w-5 h-5 text-sage-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className="mt-8 inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors cursor-pointer w-fit">
                      Hemen Başla
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subjects */}
        <section className="bg-ivory py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl text-navy-900 mb-3">Verilen Dersler</h2>
            <p className="text-slate-600 mb-10">İlkokul ve ortaokul müfredatındaki tüm dersler için uzman eğitmenlerimiz hazır.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {subjects.map((s) => (
                <span key={s} className="bg-white text-navy-900 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium hover:border-gold-400 hover:text-gold-700 transition-colors cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
