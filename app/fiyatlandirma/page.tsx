import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Link from "next/link";

export const metadata = { title: "Fiyatlandırma — Öğretmen Yanımda" };

const plans = [
  {
    name: "Başlangıç",
    price: "199",
    desc: "Temel derslerle akademik temelleri güçlendirin.",
    features: ["Ayda 4 ders (grup)", "İlerleme raporu", "E-posta desteği", "Ders notlarına erişim"],
    highlight: false,
    cta: "Başla",
  },
  {
    name: "Standart",
    price: "299",
    desc: "Bireysel ve grup dersleriyle öğrenmeyi derinleştirin.",
    features: ["Ayda 8 ders (bireysel + grup)", "Haftalık ilerleme raporu", "Öncelikli destek", "Esnek saat seçimi", "Ebeveyn bilgilendirme"],
    highlight: true,
    cta: "En Popüler — Başla",
  },
  {
    name: "Premium",
    price: "499",
    desc: "Uzman öğretmenlerle kapsamlı, kişiye özel destek.",
    features: ["Sınırsız bireysel ders", "Günlük ilerleme raporu", "7/24 destek", "Özel eğitim planı", "Aylık koçluk seansı", "Sınav hazırlık paketi"],
    highlight: false,
    cta: "Premium Başla",
  },
];

const faqItems = [
  { q: "Bireysel dersler nasıl işliyor?", a: "Uzman öğretmenlerimizle yapılan bireysel dersler öğrencinin seviyesine ve ihtiyaçlarına özel hazırlanır. Her ders 45 dakikadır." },
  { q: "Grup derslerinde kaç öğrenci bulunuyor?", a: "Her grup dersi maksimum 6 öğrenci ile sınırlıdır; böylece herkese yeterli ilgi gösterilir." },
  { q: "Ödemeler nasıl yapılmaktadır?", a: "Kredi kartı, banka kartı ve dijital cüzdan seçenekleriyle iyzico güvenceli ödeme yapabilirsiniz." },
  { q: "Ders iptali durumunda ne olur?", a: "En az 24 saat öncesinde bildirilen iptallerде tam ücret iadesi veya ders erteleme yapılır." },
  { q: "Hangi sınıf seviyeleri için ders veriliyor?", a: "İlkokul (1–4. sınıf) ve ortaokul (5–8. sınıf) öğrencilerine yönelik dersler mevcuttur." },
  { q: "Ders saatleri esnek mi?", a: "Öğrencinin programına uygun, tamamen esnek ders saatleri planlanmaktadır. Hafta sonu ve akşam saatleri de müsaittir." },
];

export default function FiyatlandirmaPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-ivory py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Fiyatlandırma</p>
            <h1 className="font-serif text-5xl text-navy-900 mb-4">Çocuklarınız İçin En İyi Eğitim Çözümleri</h1>
            <p className="text-slate-600 text-lg">Eğitim ihtiyaçlarınıza uygun fiyat planları — gizli ücret yok, şeffaf fiyatlandırma.</p>
          </div>
        </section>

        {/* Plans */}
        <section className="bg-white py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-8 ${
                    plan.highlight
                      ? "bg-navy-900 border-navy-700 shadow-2xl scale-105"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  {plan.highlight && (
                    <span className="inline-block bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      ✦ En Popüler
                    </span>
                  )}
                  <h2 className={`font-semibold text-lg mb-1 ${plan.highlight ? "text-white" : "text-navy-900"}`}>{plan.name}</h2>
                  <p className={`text-sm mb-4 ${plan.highlight ? "text-navy-300" : "text-slate-500"}`}>{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-navy-900"}`}>₺{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? "text-navy-300" : "text-slate-400"}`}>/ay</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? "text-navy-200" : "text-slate-700"}`}>
                        <svg className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-gold-400" : "text-sage-500"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      plan.highlight
                        ? "bg-gold-500 text-white hover:bg-gold-600"
                        : "bg-navy-900 text-white hover:bg-navy-800"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-slate-500 text-sm">
              Tüm planlar 14 gün ücretsiz deneme içerir. Kredi kartı gerekmez. İstediğiniz zaman iptal edebilirsiniz.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-ivory py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-navy-900 text-center mb-10">Sıkça Sorulan Sorular</h2>
            <div className="bg-white rounded-2xl border border-slate-100 p-8">
              <FaqAccordion items={faqItems} />
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
