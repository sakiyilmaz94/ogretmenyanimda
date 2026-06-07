import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata = { title: "Öğretmen Başvurusu — Öğretmen Yanımda" };

const steps = [
  { n: "01", title: "Formu Doldurun", desc: "Aşağıdaki formu eksiksiz doldurun ve belgelerinizi hazırlayın." },
  { n: "02", title: "İnceleme", desc: "Başvurunuz 1–3 iş günü içinde yöneticilerimiz tarafından incelenir." },
  { n: "03", title: "Bildirim", desc: "Onay veya red durumunda e-posta ile bilgilendirilirsiniz." },
  { n: "04", title: "Platforma Katılın", desc: "Onaylanan öğretmenler giriş yaparak profilini oluşturur ve ders verir." },
];

export default function EgitmenBasvurusuPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16 bg-background">

        {/* Hero */}
        <section className="bg-inverse-surface py-20 relative overflow-hidden">
          <div className="blob-bg bg-primary-fixed w-96 h-96 rounded-full absolute -top-20 -right-20 opacity-30" />
          <div className="blob-bg bg-primary-fixed w-64 h-64 rounded-full absolute -bottom-10 -left-10 opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-4">Öğretmen Başvurusu</p>
                <h1 className="font-display text-headline-xl text-on-background mb-4 leading-tight">
                  Öğretmen Yanımda Ailesine Katılın!
                </h1>
                <p className="text-on-surface-variant text-body-lg leading-relaxed">
                  Platformumuzda ders vermek isteyen deneyimli öğretmenleri bekliyoruz. Başvurunuzu değerlendirip en kısa sürede size dönüş yapacağız.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: "Hızla", label: "Büyüyen Komunite" },
                  { n: "₺", label: "Düzenli Gelir" },
                  { n: "Esnek", label: "Çalışma Saati" },
                  { n: "Online", label: "Tamamen Dijital" },
                ].map((s) => (
                  <div key={s.label} className="bg-surface-container-lowest rounded-md p-5 border border-outline-variant/40">
                    <p className="font-display text-headline-lg text-primary mb-1">{s.n}</p>
                    <p className="text-on-surface-variant text-label-md">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="bg-surface-container-low py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-headline-lg text-on-background text-center mb-12">Başvuru Süreci</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s) => (
                <div key={s.n} className="text-center p-6 bg-surface-container-lowest rounded-md soft-card-static">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-on-primary font-bold text-label-md">{s.n}</span>
                  </div>
                  <h3 className="font-display font-semibold text-on-background text-body-md mb-2">{s.title}</h3>
                  <p className="text-on-surface-variant text-body-md">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form / Register CTA */}
        <section className="bg-background py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-surface-container-lowest rounded-md p-8 text-center soft-card-static">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h2 className="font-display text-headline-lg text-on-background mb-3">Öğretmen Hesabı Oluşturun</h2>
              <p className="text-on-surface-variant text-body-md mb-6 leading-relaxed">
                Kayıt formunda &ldquo;Öğretmen&rdquo; rolünü seçin. Başvurunuz yöneticilerimiz tarafından incelendikten sonra platforma erişim sağlarsınız.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full squishy-btn bg-primary text-on-primary px-8 py-4 font-bold text-body-md cursor-pointer w-full sm:w-auto"
              >
                Başvuru Yap
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <p className="mt-4 text-label-md text-on-surface-variant">
                Zaten hesabınız var mı?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline cursor-pointer">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
