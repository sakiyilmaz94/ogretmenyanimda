import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata = { title: "Hakkımızda — Öğretmen Yanımda" };

const values = [
  { title: "Kalite", desc: "Her eğitmen özgeçmiş ve belge incelemesinden geçer. Kalite standardımızdan ödün vermeyiz." },
  { title: "Erişilebilirlik", desc: "Kaliteli eğitim sadece büyük şehirlere özgü olmamalı. Türkiye'nin her yerinden erişilebilir platform." },
  { title: "Kişiselleştirme", desc: "Her öğrenci farklıdır. Müfredatımız öğrencinin seviyesine ve hedeflerine göre şekillenir." },
  { title: "Güven", desc: "Veliler çocuklarını emanet ediyor. Güvenli ödeme, onaylı eğitmenler ve şeffaf iletişim bizim önceliğimiz." },
];

export default function HakkimizdaPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-navy-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-4">Hakkımızda</p>
                <h1 className="font-serif text-5xl text-white mb-6 leading-tight">
                  Alanında Uzman Öğretmenlerle İlkokul ve Ortaokul Öğrencilerine Özel Eğitim
                </h1>
                <p className="text-navy-200 text-lg leading-relaxed">
                  Öğretmen Yanımda, her öğrencinin potansiyelini en iyi şekilde geliştirmeyi amaçlar; kaliteli, erişilebilir ve bireyselleştirilmiş eğitimle geleceğin başarılarını destekler.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: "2024", label: "Kuruluş Yılı" },
                  { n: "500+", label: "Aktif Öğrenci" },
                  { n: "50+",  label: "Uzman Eğitmen" },
                  { n: "4.9",  label: "Ortalama Puan" },
                ].map((s) => (
                  <div key={s.label} className="bg-navy-800 rounded-2xl p-6 border border-navy-700">
                    <p className="font-serif text-4xl text-gold-400 mb-1">{s.n}</p>
                    <p className="text-navy-300 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-ivory py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Misyonumuz</p>
            <h2 className="font-serif text-4xl text-navy-900 mb-6">Neden Öğretmen Yanımda?</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Türkiye'de milyonlarca ilkokul ve ortaokul öğrencisi akademik desteğe ihtiyaç duyuyor. Ancak kaliteli, güvenilir ve erişilebilir bir platforma ulaşmak her zaman kolay olmuyor.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Biz bu boşluğu doldurmak için kurulduk. Velilerin güvenle seçebileceği, öğrencilerin gerçekten verim alabileceği ve eğitmenlerin değerini bulabileceği bir platform inşa ediyoruz.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Değerlerimiz</p>
              <h2 className="font-serif text-4xl text-navy-900">Bizi Biz Yapan İlkeler</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={v.title} className="p-7 bg-slate-50 rounded-2xl border border-slate-100 hover:border-gold-200 hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center mb-4">
                    <span className="font-serif text-gold-400 font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gold-500 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl text-white mb-4">Ailemize Katılın</h2>
            <p className="text-white/85 mb-8">Eğitmen başvurusu yapın veya çocuğunuz için hemen rezervasyon alın.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-white text-gold-600 px-7 py-3.5 rounded-xl font-bold hover:bg-gold-50 transition-colors cursor-pointer">
                Hemen Başla
              </Link>
              <Link href="/egitmen-basvurusu" className="bg-gold-600 text-white border-2 border-white/30 px-7 py-3.5 rounded-xl font-semibold hover:bg-gold-700 transition-colors cursor-pointer">
                Eğitmen Başvurusu
              </Link>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
