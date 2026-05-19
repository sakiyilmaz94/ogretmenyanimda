import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata = { title: "Eğitmen Başvurusu — Öğretmen Yanımda" };

const steps = [
  { n: "01", title: "Formu Doldurun", desc: "Aşağıdaki formu eksiksiz doldurun ve belgelerinizi hazırlayın." },
  { n: "02", title: "İnceleme", desc: "Başvurunuz 1–3 iş günü içinde yöneticilerimiz tarafından incelenir." },
  { n: "03", title: "Bildirim", desc: "Onay veya red durumunda e-posta ile bilgilendirilirsiniz." },
  { n: "04", title: "Platforma Katılın", desc: "Onaylanan eğitmenler giriş yaparak profilini oluşturur ve ders verir." },
];

export default function EgitmenBasvurusuPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-navy-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-4">Eğitmen Başvurusu</p>
                <h1 className="font-serif text-5xl text-white mb-4 leading-tight">
                  Öğretmen Yanımda Ailesine Katılın!
                </h1>
                <p className="text-navy-200 text-lg leading-relaxed">
                  Platformumuzda ders vermek isteyen deneyimli öğretmenleri bekliyoruz. Başvurunuzu değerlendirip en kısa sürede size dönüş yapacağız.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: "500+", label: "Aktif Öğrenci" },
                  { n: "₺", label: "Düzenli Gelir" },
                  { n: "Esnek", label: "Çalışma Saati" },
                  { n: "Online", label: "Tamamen Dijital" },
                ].map((s) => (
                  <div key={s.label} className="bg-navy-800 rounded-2xl p-5 border border-navy-700">
                    <p className="font-serif text-3xl text-gold-400 mb-1">{s.n}</p>
                    <p className="text-navy-300 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-navy-900 text-center mb-12">Başvuru Süreci</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s) => (
                <div key={s.n} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-gold-400 font-bold">{s.n}</span>
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form / Register CTA */}
        <section className="bg-ivory py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h2 className="font-serif text-3xl text-navy-900 mb-3">Eğitmen Hesabı Oluşturun</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Kayıt formunda &ldquo;Eğitmen&rdquo; rolünü seçin. Başvurunuz yöneticilerimiz tarafından incelendikten sonra platforma erişim sağlarsınız.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-gold-600 transition-colors cursor-pointer w-full sm:w-auto"
              >
                Başvuru Yap
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <p className="mt-4 text-sm text-slate-500">
                Zaten hesabınız var mı?{" "}
                <Link href="/login" className="text-gold-600 font-medium hover:underline cursor-pointer">
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
