import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata = { title: "Fiyatlandırma — Öğretmen Yanımda" };
export const revalidate = 60;

const faqItems = [
  { q: "Ders ücreti nasıl belirleniyor?", a: "Her öğretmen kendi ders ücretini belirler. Ders sayfasında öğretmenin belirlediği ücret açıkça gösterilir." },
  { q: "Ödeme nasıl yapılır?", a: "Kredi kartı veya banka kartıyla iyzico güvenceli ödeme altyapısı üzerinden ödeme yapabilirsiniz. Kart bilgileriniz sistemimizde saklanmaz." },
  { q: "Ders iptali durumunda ne olur?", a: "Dersten 24 saat veya daha önce yapılan iptallerde ücretin tamamı iade edilir. 24 saatten az kalan iptallerde iade yapılmaz." },
  { q: "Hangi sınıf seviyelerine ders veriliyor?", a: "İlkokul (1–4. sınıf) ve ortaokul (5–8. sınıf) öğrencilerine yönelik dersler mevcuttur." },
  { q: "Ders saatleri esnek mi?", a: "Evet. Her öğretmen kendi müsaitlik takvimini belirler. Hafta sonu ve akşam saatlerinde de ders planlanabilir." },
  { q: "Öğretmen onaylı mı?", a: "Evet. Platforma kayıtlı tüm öğretmenler diploma ve kimlik doğrulamasından geçer, admin onayı olmadan ders veremez." },
];

export default async function FiyatlandirmaPage() {
  const plans = await db.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        <section className="relative overflow-hidden bg-surface-container-low py-20 text-center">
          <div className="blob-bg w-72 h-72 bg-primary/15 rounded-full -top-16 -left-16" />
          <div className="max-w-3xl mx-auto px-4 relative">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Fiyatlandırma</p>
            <h1 className="font-display text-headline-xl text-on-background mb-4">Şeffaf Fiyatlandırma</h1>
            <p className="text-on-surface-variant text-body-lg">Gizli ücret yok. Her ders için önceden belirlenen, net fiyat.</p>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {plans.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-outline text-body-lg mb-2">Fiyat paketleri yakında burada olacak.</p>
                <p className="text-outline text-body-md mb-8">Her öğretmen kendi ders ücretini belirler — öğretmen profilinden doğrudan ders alabilirsiniz.</p>
                <Link href="/egitmenlerimiz" className="inline-block rounded-full squishy-btn bg-primary text-on-primary px-7 py-3.5 font-semibold">
                  Öğretmenleri İncele
                </Link>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-1 gap-6 items-center ${plans.length === 1 ? "max-w-sm mx-auto" : plans.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`rounded-md p-8 relative soft-card ${
                        plan.isPopular
                          ? "bg-primary"
                          : "bg-surface-container-lowest"
                      }`}
                    >
                      {plan.isPopular && (
                        <span className="inline-block bg-secondary-container text-on-secondary-container text-label-md px-3 py-1 rounded-full mb-4">
                          ✦ En Popüler
                        </span>
                      )}
                      <h2 className={`font-semibold text-body-lg mb-1 ${plan.isPopular ? "text-on-primary" : "text-on-background"}`}>
                        {plan.name}
                      </h2>
                      {plan.description && (
                        <p className={`text-body-md mb-4 ${plan.isPopular ? "text-on-primary/70" : "text-on-surface-variant"}`}>
                          {plan.description}
                        </p>
                      )}
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-4xl font-bold ${plan.isPopular ? "text-on-primary" : "text-on-background"}`}>
                          ₺{parseFloat(plan.price.toString()).toLocaleString("tr-TR")}
                        </span>
                      </div>
                      <p className={`text-caption mb-6 ${plan.isPopular ? "text-on-primary/60" : "text-outline"}`}>
                        {plan.duration} dakika ders
                      </p>
                      {plan.features.length > 0 && (
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((f) => (
                            <li key={f} className={`flex items-center gap-2 text-body-md ${plan.isPopular ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                              <svg className={`w-4 h-4 shrink-0 ${plan.isPopular ? "text-on-primary" : "text-primary"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link
                        href="/register"
                        className={`block w-full text-center py-3 rounded-full text-label-md font-semibold transition-colors cursor-pointer ${
                          plan.isPopular
                            ? "bg-on-primary text-primary hover:bg-on-primary/90"
                            : "bg-primary text-on-primary hover:bg-primary/90"
                        }`}
                      >
                        Hemen Başla
                      </Link>
                    </div>
                  ))}
                </div>
                <p className="text-center mt-8 text-on-surface-variant text-body-md">
                  Sorularınız için <a href="/iletisim" className="text-primary hover:underline">bize ulaşın</a>.
                </p>
              </>
            )}
          </div>
        </section>

        <section className="bg-surface-container-low py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-headline-lg text-on-background text-center mb-10">Sıkça Sorulan Sorular</h2>
            <div className="bg-surface-container-lowest rounded-md border border-outline-variant/30 p-8 soft-card-static">
              <FaqAccordion items={faqItems} />
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
