import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import FaqAccordion from "@/components/ui/FaqAccordion";

const faqItems = [
  { q: "Özel dersler nasıl işliyor?", a: "Veliler platformdan onaylı öğretmeni seçer, uygun saat dilimini rezerve eder ve ödeme yapar. Dersler tamamen online, interaktif ortamda gerçekleşir." },
  { q: "Dersler hangi seviyeleri kapsıyor?", a: "İlkokul (1–4. sınıf) ve ortaokul (5–8. sınıf) öğrencilerine yönelik kapsamlı dersler sunmaktayız." },
  { q: "Ders süresi ne kadardır?", a: "Bireysel dersler 45 dakika, grup dersleri (maks. 6 öğrenci) 60 dakika sürmektedir." },
  { q: "Ders iptali durumunda ne olur?", a: "En az 24 saat öncesinden bildirilen iptallerде tam ücret iadesi veya ders erteleme yapılmaktadır." },
  { q: "Öğretmenler nasıl seçiliyor?", a: "Tüm öğretmenlerimiz özgeçmiş, belge ve referans incelemesinden geçer; yönetici onayıyla platforma kabul edilir." },
  { q: "Ödeme güvenli mi?", a: "Ödemeler iyzico altyapısıyla 256-bit SSL şifrelemeli olarak işlenmektedir. Kart bilgileriniz sistemimizde saklanmaz." },
];

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role ?? null;

  const educators = await db.educator.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
    take: 4,
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <PublicNavbar role={role} />

      <main className="pt-16">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="bg-ivory min-h-[88vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gold-200 mb-6">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Türkiye&apos;nin Güvenilir Özel Ders Platformu
                </span>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-navy-900 leading-tight mb-6">
                  Uzmanlarla<br/>
                  <span className="text-gold-500">Kaliteli</span> ve<br/>
                  Etkili Öğrenim
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                  İlkokul ve ortaokul öğrencileri için alanında uzman öğretmenlerle bireysel ve grup dersleri. Randevu al, öde, öğren.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {role === "PARENT" ? (
                    <Link
                      href="/egitmenlerimiz"
                      className="inline-flex items-center justify-center gap-2 bg-gold-500 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-gold-600 transition-colors duration-200 cursor-pointer shadow-lg shadow-gold-200"
                    >
                      Öğretmen Bul
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </Link>
                  ) : role ? (
                    <Link
                      href={role === "EDUCATOR" ? "/educator" : role === "ADMIN" ? "/admin" : "/parent"}
                      className="inline-flex items-center justify-center gap-2 bg-gold-500 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-gold-600 transition-colors duration-200 cursor-pointer shadow-lg shadow-gold-200"
                    >
                      Panelime Git
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 bg-gold-500 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-gold-600 transition-colors duration-200 cursor-pointer shadow-lg shadow-gold-200"
                    >
                      Ücretsiz Başla
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </Link>
                  )}
                  <Link
                    href="/egitmenlerimiz"
                    className="inline-flex items-center justify-center gap-2 bg-white text-navy-900 border-2 border-navy-200 px-7 py-3.5 rounded-xl text-base font-semibold hover:border-navy-400 transition-colors duration-200 cursor-pointer"
                  >
                    Öğretmenleri Keşfet
                  </Link>
                </div>

                {/* Ders konuları */}
                <div className="mt-10">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">Hangi derste destek arıyorsunuz?</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Matematik",       slug: "MATEMATIK" },
                      { label: "Türkçe",           slug: "TURKCE" },
                      { label: "Fen Bilgisi",      slug: "FEN_BILGISI" },
                      { label: "İngilizce",        slug: "INGILIZCE" },
                      { label: "Hayat Bilgisi",    slug: "HAYAT_BILGISI" },
                      { label: "İlk Okuma Yazma",  slug: "ILK_OKUMA_YAZMA" },
                      { label: "Sosyal Bilgiler",  slug: "SOSYAL_BILGILER" },
                    ].map((s) => (
                      <Link
                        key={s.slug}
                        href={`/egitmenlerimiz?subject=${s.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-white border border-slate-200 text-navy-700 hover:border-gold-400 hover:text-gold-700 hover:bg-gold-50 transition-colors duration-150 cursor-pointer shadow-sm"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hero visual */}
              <div className="relative hidden lg:block">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">Ders Rezervasyonu</p>
                      <p className="text-xs text-slate-500">Bugün müsait saatler</p>
                    </div>
                  </div>
                  {[
                    { time: "09:00", subject: "Matematik", educator: "Elif Hanım", avail: true },
                    { time: "11:00", subject: "Türkçe",    educator: "Ahmet Bey",  avail: true },
                    { time: "14:00", subject: "Fen Bilgisi",educator: "Ayşe Hanım",avail: false },
                    { time: "16:00", subject: "İngilizce", educator: "Can Bey",    avail: true },
                  ].map((slot) => (
                    <div key={slot.time} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400 w-12">{slot.time}</span>
                        <div>
                          <p className="text-sm font-medium text-navy-900">{slot.subject}</p>
                          <p className="text-xs text-slate-500">{slot.educator}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${slot.avail ? "bg-sage-50 text-sage-600" : "bg-slate-100 text-slate-400"}`}>
                        {slot.avail ? "Müsait" : "Dolu"}
                      </span>
                    </div>
                  ))}
                  <Link href="/register" className="mt-4 block w-full text-center bg-navy-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors cursor-pointer">
                    Ders Al
                  </Link>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-gold-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                  ✓ Hemen Başla
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NASIL ÇALIŞIR ────────────────────────────────── */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Nasıl Çalışır?</p>
              <h2 className="font-serif text-4xl text-navy-900">3 Adımda Ders Al</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Öğretmen Seç",
                  desc: "Branşına ve bütçene uygun uzman öğretmeni incele, değerlendirmeleri oku.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "Saat Reserv Et",
                  desc: "Öğrencine en uygun saat dilimine tıkla, hızlıca rezervasyon yap.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "Güvenle Öde",
                  desc: "iyzico güvencesiyle öde; ders başlasın, başarı yaklaşsın.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="relative p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-gold-200 hover:shadow-md transition-all duration-300 cursor-default">
                  <span className="absolute top-6 right-6 font-serif text-5xl text-slate-100 font-bold select-none">{item.step}</span>
                  <div className="w-12 h-12 bg-navy-900 text-gold-400 rounded-xl flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HİZMETLER ────────────────────────────────────── */}
        <section className="bg-ivory py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Hizmetlerimiz</p>
              <h2 className="font-serif text-4xl text-navy-900">Kişiye Özel Eğitim Seçenekleri</h2>
              <p className="mt-4 text-slate-600 max-w-xl mx-auto">Öğrencilerimizin başarısı için uzman öğretmenlerle çeşitli ders seçenekleri sunuyoruz.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Bireysel Dersler",
                  desc: "Öğrencinin bireysel ihtiyaçlarına göre hazırlanan ders programlarıyla maksimum verim. 45 dakika, birebir eğitim.",
                  color: "bg-navy-900",
                  textColor: "text-gold-400",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  ),
                  features: ["Kişiselleştirilmiş müfredat", "Esnek saat seçimi", "İlerleme takibi"],
                },
                {
                  title: "Grup Dersleri",
                  desc: "Maks. 6 öğrenciyle sosyal öğrenme. Akranlarla birlikte öğrenmek motivasyonu artırır. 60 dakika.",
                  color: "bg-gold-500",
                  textColor: "text-white",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  ),
                  features: ["Uygun fiyat", "Sosyal beceri gelişimi", "Rekabetçi ortam"],
                },
                {
                  title: "Öğrenci Koçluğu",
                  desc: "Akademik başarının ötesinde motivasyon, çalışma stratejisi ve hedef belirleme seansları.",
                  color: "bg-sage-500",
                  textColor: "text-white",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  ),
                  features: ["Hedef belirleme", "Motivasyon artırma", "Çalışma planı"],
                },
              ].map((s) => (
                <div key={s.title} className="bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-lg hover:border-gold-200 transition-all duration-300 cursor-default">
                  <div className={`w-12 h-12 ${s.color} ${s.textColor} rounded-xl flex items-center justify-center mb-5`}>
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                        <svg className="w-4 h-4 text-sage-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/hizmetler" className="inline-flex items-center gap-2 text-navy-900 font-semibold hover:text-gold-600 transition-colors cursor-pointer">
                Tüm hizmetleri incele
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── EĞİTMENLER ───────────────────────────────────── */}
        {educators.length > 0 && (
          <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Öğretmenlerimiz</p>
                <h2 className="font-serif text-4xl text-navy-900">Uzman Kadromuzla Tanışın</h2>
                <p className="mt-4 text-slate-600 max-w-xl mx-auto">Onaylı öğretmenlerimizin tamamı özgeçmiş ve belge incelemesinden geçmiştir.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {educators.map((e) => (
                  <div key={e.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-gold-200 hover:shadow-md transition-all duration-300 cursor-default text-center">
                    <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-serif text-gold-400">
                        {(e.user.name ?? "E")[0].toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-1">{e.user.name}</h3>
                    {e.bio && <p className="text-xs text-slate-500 line-clamp-2">{e.bio}</p>}
                    {e.hourlyRate && (
                      <p className="mt-3 text-gold-600 font-semibold text-sm">
                        ₺{Number(e.hourlyRate).toFixed(0)}/saat
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/egitmenlerimiz" className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors cursor-pointer">
                  Tüm Öğretmenleri Gör
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── FİYATLANDIRMA ────────────────────────────────── */}
        <section className="bg-navy-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Fiyatlandırma</p>
              <h2 className="font-serif text-4xl text-white">Çocuklarınız İçin En İyi Eğitim</h2>
              <p className="mt-4 text-navy-200 max-w-xl mx-auto">Eğitim ihtiyaçlarınıza uygun planlar — faturanıza sürpriz yok.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Başlangıç",
                  price: "199",
                  desc: "Temel derslerle akademik temelleri güçlendirin.",
                  features: ["Ayda 4 ders", "Grup dersleri", "İlerleme raporu", "E-posta desteği"],
                  cta: "Başla",
                  highlight: false,
                },
                {
                  name: "Standart",
                  price: "299",
                  desc: "Bireysel ve grup dersleriyle öğrenmeyi derinleştirin.",
                  features: ["Ayda 8 ders", "Bireysel + grup", "Haftalık rapor", "Öncelikli destek", "Esnek saat seçimi"],
                  cta: "En Popüler",
                  highlight: true,
                },
                {
                  name: "Premium",
                  price: "499",
                  desc: "Uzman öğretmenlerle kapsamlı, kişiye özel destek.",
                  features: ["Sınırsız ders", "Sadece bireysel", "Günlük rapor", "7/24 destek", "Özel eğitim planı", "Koçluk seansı"],
                  cta: "Premium Başla",
                  highlight: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 border ${
                    plan.highlight
                      ? "bg-gold-500 border-gold-400 scale-105 shadow-2xl"
                      : "bg-navy-800 border-navy-700"
                  }`}
                >
                  {plan.highlight && (
                    <span className="inline-block bg-white text-gold-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                      ✦ En Popüler
                    </span>
                  )}
                  <h3 className={`font-semibold text-lg mb-1 ${plan.highlight ? "text-white" : "text-slate-300"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlight ? "text-white/80" : "text-navy-300"}`}>{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-white"}`}>₺{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-navy-300"}`}>/ay</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? "text-white" : "text-navy-200"}`}>
                        <svg className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-gold-400"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                      plan.highlight
                        ? "bg-white text-gold-600 hover:bg-gold-50"
                        : "bg-navy-700 text-white hover:bg-navy-600 border border-navy-600"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-navy-300 text-sm">
              Tüm planlar 14 gün deneme içerir. Kredi kartı gerektirmez.
            </p>
          </div>
        </section>

        {/* ── GÜVEN ROZETLERI ──────────────────────────────── */}
        <section className="bg-white py-16 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: "🛡️", title: "Güvenli Ödeme", desc: "iyzico 256-bit SSL" },
                { icon: "✅", title: "Onaylı Öğretmenler", desc: "Belge incelemeli kabul" },
                { icon: "⭐", title: "4.9/5 Memnuniyet", desc: "500+ veli değerlendirmesi" },
                { icon: "🔄", title: "Ücretsiz İptal", desc: "24 saat öncesinde" },
              ].map((b) => (
                <div key={b.title} className="cursor-default">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <p className="font-semibold text-navy-900 text-sm">{b.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SSS ──────────────────────────────────────────── */}
        <section className="bg-ivory py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">SSS</p>
              <h2 className="font-serif text-4xl text-navy-900">Sıkça Sorulan Sorular</h2>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <FaqAccordion items={faqItems} />
            </div>
            <p className="text-center mt-6 text-slate-500 text-sm">
              Aklınıza başka sorular mı takıldı?{" "}
              <Link href="/iletisim" className="text-gold-600 font-medium hover:underline cursor-pointer">
                Bize ulaşın
              </Link>
            </p>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="bg-gold-500 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl sm:text-5xl text-white mb-4">
              Çocuğunuzun Başarısı<br/>Bir Tık Uzağınızda
            </h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              Hemen üye olun, uzman öğretmenlerle ilk dersi planlayın. İlk ders memnuniyeti garantilidir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-gold-600 px-8 py-4 rounded-xl text-base font-bold hover:bg-gold-50 transition-colors cursor-pointer shadow-lg"
              >
                Ücretsiz Kayıt Ol
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <Link
                href="/egitmen-basvurusu"
                className="inline-flex items-center justify-center gap-2 bg-gold-600 text-white border-2 border-white/30 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gold-700 transition-colors cursor-pointer"
              >
                Öğretmen Başvurusu
              </Link>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </>
  );
}
