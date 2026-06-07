import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata = { title: "Hizmetler — Öğretmen Yanımda" };

const services = [
  {
    title: "Bireysel Dersler",
    subtitle: "45 dk · Birebir Eğitim",
    desc: "Öğrencinin güçlü ve zayıf yönleri analiz edilerek kişiselleştirilmiş müfredat hazırlanır. Öğretmen dikkatinin tamamı tek öğrenciye yönelir.",
    features: ["Kişiselleştirilmiş müfredat", "Esnek saat seçimi", "Haftalık ilerleme raporu", "Ödev takibi", "Ebeveyn bilgilendirme"],
    color: "bg-primary",
    accent: "text-on-primary/70",
  },
  {
    title: "Grup Dersleri",
    subtitle: "60 dk · Maks. 6 Öğrenci",
    desc: "Küçük gruplarla sosyal öğrenme ortamı. Akranlarla birlikte problem çözmek hem motivasyonu artırır hem de uygun fiyatlıdır.",
    features: ["Uygun fiyatlı seçenek", "Sosyal beceli gelişimi", "Rekabetçi öğrenme ortamı", "Grup ödevi ve projeler", "Haftalık grup raporu"],
    color: "bg-secondary",
    accent: "text-on-primary/70",
  },
  {
    title: "Öğrenci Koçluğu",
    subtitle: "45 dk · Motivasyon & Strateji",
    desc: "Akademik başarının temelinde doğru çalışma alışkanlıkları yatar. Koçluk seanslarıyla hedef belirleme, zaman yönetimi ve motivasyon desteklenir.",
    features: ["Hedef belirleme & takip", "Çalışma planı oluşturma", "Sınav strateji eğitimi", "Motivasyon seansları", "Ebeveyn & öğrenci görüşmesi"],
    color: "bg-on-primary-fixed-variant",
    accent: "text-on-primary/70",
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
        <section className="relative overflow-hidden bg-surface-container-low py-20">
          <div className="blob-bg w-72 h-72 bg-primary/20 rounded-full -top-16 -right-16" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Hizmetlerimiz</p>
            <h1 className="font-display text-headline-xl text-on-background mb-4">Kişiye Özel Eğitim</h1>
            <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
              Bireysel ve grup dersleriyle kişiye özel eğitim. Öğrencilerimizin başarısı için uzman öğretmenlerle çeşitli ders seçenekleri.
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="bg-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {services.map((s, i) => (
              <div key={s.title} className="bg-surface-container-lowest rounded-md overflow-hidden soft-card-static">
                <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                  <div className={`${s.color} p-10 flex flex-col justify-center ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <p className={`text-label-md ${s.accent} mb-2`}>{s.subtitle}</p>
                    <h2 className="font-display text-headline-md text-on-primary mb-3">{s.title}</h2>
                    <p className="text-on-primary/80 text-body-md leading-relaxed">{s.desc}</p>
                  </div>
                  <div className={`bg-surface-container-low p-10 flex flex-col justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <h3 className="font-semibold text-on-background text-body-lg mb-4">Neler Dahil?</h3>
                    <ul className="space-y-3">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-body-md text-on-surface-variant">
                          <svg className="w-5 h-5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 font-semibold w-fit">
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
        <section className="bg-surface-container-low py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-headline-lg text-on-background mb-3">Verilen Dersler</h2>
            <p className="text-on-surface-variant text-body-md mb-10">İlkokul ve ortaokul müfredatındaki tüm dersler için uzman öğretmenlerimiz hazır.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {subjects.map((s) => (
                <span key={s} className="bg-surface-container-lowest text-on-background border border-outline-variant px-4 py-2 rounded-full text-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors cursor-default">
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
