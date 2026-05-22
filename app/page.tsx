import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import FaqAccordion from "@/components/ui/FaqAccordion";

export const dynamic = "force-dynamic";

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

      <main>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="min-h-[90vh] flex items-center relative overflow-hidden bg-background">
          {/* Blob arka planlar */}
          <div className="blob-bg bg-primary-fixed w-[500px] h-[500px] rounded-full -top-24 -left-32" />
          <div className="blob-bg bg-secondary-fixed w-[400px] h-[400px] rounded-full top-40 -right-20" style={{ animationDelay: "-5s" }} />

          <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-full text-label-md font-semibold mb-8">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Türkiye&apos;nin Güvenilir Özel Ders Platformu
            </span>

            <h1 className="font-display text-headline-lg-mobile md:text-headline-xl text-on-background mb-6">
              Uzmanlarla<br/>
              <span className="text-primary">Kaliteli</span> ve Etkili Öğrenim
            </h1>

            <p className="text-body-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl mx-auto">
              İlkokul ve ortaokul öğrencileri için alanında uzman, yönetici onaylı öğretmenlerle bireysel dersler. Randevu al, öde, öğren.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              {role === "PARENT" ? (
                <Link
                  href="/egitmenlerimiz"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-display font-bold text-body-md squishy-btn"
                >
                  Öğretmen Bul
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              ) : role ? (
                <Link
                  href={role === "EDUCATOR" ? "/educator" : role === "ADMIN" ? "/admin" : "/parent"}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-display font-bold text-body-md squishy-btn"
                >
                  Panelime Git
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-display font-bold text-body-md squishy-btn"
                >
                  Ücretsiz Başla
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              )}
              <Link
                href="/egitmenlerimiz"
                className="inline-flex items-center justify-center gap-2 bg-surface-container text-primary px-8 py-4 rounded-full border-2 border-primary-fixed hover:bg-surface-variant font-display font-semibold text-body-md transition-colors duration-200"
              >
                Öğretmenleri Keşfet
              </Link>
            </div>

            {/* Ders konuları */}
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">
                Hangi derste destek arıyorsunuz?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: "Matematik",       slug: "MATEMATIK" },
                  { label: "Türkçe",          slug: "TURKCE" },
                  { label: "Fen Bilgisi",     slug: "FEN_BILGISI" },
                  { label: "İngilizce",       slug: "INGILIZCE" },
                  { label: "Hayat Bilgisi",   slug: "HAYAT_BILGISI" },
                  { label: "İlk Okuma Yazma", slug: "ILK_OKUMA_YAZMA" },
                  { label: "Sosyal Bilgiler", slug: "SOSYAL_BILGILER" },
                ].map((s) => (
                  <Link
                    key={s.slug}
                    href={`/egitmenlerimiz?subject=${s.slug}`}
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-label-md bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-primary hover:text-primary hover:bg-primary-fixed transition-colors duration-150"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR (3 özellik) ────────────────────────── */}
        <section className="bg-surface-container-low py-12">
          <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static">
              <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    ),
                    title: "Onaylı Öğretmenler",
                    desc: "Her öğretmen belge ve referans incelemesinden geçer",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    ),
                    title: "Şeffaf Fiyatlandırma",
                    desc: "Abonelik yok, gizli ücret yok — sadece ders başına ödeme",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    ),
                    title: "Veli Takip Raporu",
                    desc: "Her dersin ardından öğretmen ilerleme notu bırakır",
                  },
                ].map((item, i, arr) => (
                  <div key={item.title} className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 max-w-[220px]">
                      <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-display text-headline-md text-on-background mb-1">{item.title}</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="hidden md:block w-px h-20 bg-outline-variant mx-4 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── NASIL ÇALIŞIR ────────────────────────────────── */}
        <section className="bg-surface-container-lowest py-20">
          <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-3">Nasıl Çalışır?</p>
              <h2 className="font-display text-headline-lg text-on-background">3 Adımda Ders Al</h2>
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
                <div key={item.step} className="relative bg-surface-container-low rounded-md p-8 soft-card cursor-default overflow-hidden">
                  <span className="absolute top-6 right-6 font-display text-5xl text-primary-fixed font-bold opacity-40 select-none">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-headline-md text-on-background mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HİZMETLER ────────────────────────────────────── */}
        <section className="bg-background py-20">
          <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-3">Hizmetlerimiz</p>
              <h2 className="font-display text-headline-lg text-on-background">Kişiye Özel Eğitim Seçenekleri</h2>
              <p className="mt-4 text-on-surface-variant text-body-md max-w-xl mx-auto">
                Öğrencilerimizin başarısı için uzman öğretmenlerle çeşitli ders seçenekleri sunuyoruz.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Bireysel Dersler",
                  desc: "Öğrencinin bireysel ihtiyaçlarına göre hazırlanan ders programlarıyla maksimum verim. 45 dakika, birebir eğitim.",
                  iconBg: "bg-secondary-container",
                  iconColor: "text-on-secondary-container",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  ),
                  features: ["Kişiselleştirilmiş müfredat", "Esnek saat seçimi", "İlerleme takibi"],
                },
                {
                  title: "Veli Takip Paketi",
                  desc: "Her dersin sonunda öğretmen kısa bir ilerleme notu bırakır; veli panelinden kolayca takip edersiniz.",
                  iconBg: "bg-primary-fixed",
                  iconColor: "text-on-primary-fixed",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  ),
                  features: ["Ders sonrası ilerleme notu", "Güçlü / zayıf konu raporu", "Veli–öğretmen iletişimi"],
                },
                {
                  title: "Öğrenci Koçluğu",
                  desc: "Akademik başarının ötesinde motivasyon, çalışma stratejisi ve hedef belirleme seansları.",
                  iconBg: "bg-tertiary-fixed",
                  iconColor: "text-on-tertiary-fixed",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  ),
                  features: ["Hedef belirleme", "Motivasyon artırma", "Çalışma planı"],
                },
              ].map((s) => (
                <div key={s.title} className="bg-surface-container-lowest rounded-md p-8 soft-card border border-outline-variant/30 cursor-default">
                  <div className={`w-12 h-12 ${s.iconBg} ${s.iconColor} rounded-full flex items-center justify-center mb-5`}>
                    {s.icon}
                  </div>
                  <h3 className="font-display text-headline-md text-on-background mb-3">{s.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-on-background">
                        <svg className="w-4 h-4 text-secondary shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
              <Link
                href="/hizmetler"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-container transition-colors cursor-pointer"
              >
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
          <section className="bg-surface-container-low py-20">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-3">Öğretmenlerimiz</p>
                <h2 className="font-display text-headline-lg text-on-background">Uzman Kadromuzla Tanışın</h2>
                <p className="mt-4 text-on-surface-variant text-body-md max-w-xl mx-auto">
                  Onaylı öğretmenlerimizin tamamı özgeçmiş ve belge incelemesinden geçmiştir.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {educators.map((e) => (
                  <div key={e.id} className="bg-surface-container-lowest rounded-md p-7 soft-card text-center cursor-default">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-display font-bold text-on-primary">
                        {(e.user.name ?? "E")[0].toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-on-background mb-1">{e.user.name}</h3>
                    {e.bio && <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{e.bio}</p>}
                    {e.hourlyRate && (
                      <p className="mt-3 text-primary font-bold text-sm">
                        ₺{Number(e.hourlyRate).toFixed(0)}/saat
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  href="/egitmenlerimiz"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full text-label-md font-bold squishy-btn"
                >
                  Tüm Öğretmenleri Gör
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── NASIL ÜCRETLENDİRİLİR ───────────────────────── */}
        <section className="bg-primary py-20 relative overflow-hidden">
          {/* Hafif blob dekorasyonu */}
          <div className="blob-bg bg-primary-container w-80 h-80 rounded-full -top-20 -right-20 opacity-30" />
          <div className="blob-bg bg-primary-fixed-dim w-64 h-64 rounded-full bottom-10 -left-16 opacity-20" style={{ animationDelay: "-3s" }} />

          <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-primary-fixed font-semibold text-label-md uppercase tracking-widest mb-3">Şeffaf Fiyatlandırma</p>
              <h2 className="font-display text-headline-lg text-on-primary">Nasıl Ücretlendirilir?</h2>
              <p className="mt-4 text-on-primary/75 text-body-md max-w-xl mx-auto">
                Abonelik yok, gizli ücret yok. Sadece aldığınız ders için ödeme yaparsınız.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  step: "1",
                  title: "Öğretmeni Seç",
                  desc: "Her öğretmenin profil sayfasında saatlik ücreti açıkça yazar. Bütçenize uygun öğretmeni kolayca bulun.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  ),
                  highlight: false,
                },
                {
                  step: "2",
                  title: "Rezervasyon Yap",
                  desc: "Uygun saate tıklayın, rezervasyonunuzu oluşturun. Öğretmen onayının ardından ödeme ekranına geçin.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  ),
                  highlight: true,
                },
                {
                  step: "3",
                  title: "Güvenle Öde",
                  desc: "iyzico güvencesiyle tek seferlik ödeme yapın. Kart bilgileriniz sistemimizde saklanmaz.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                  ),
                  highlight: false,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`rounded-md p-8 ${
                    item.highlight
                      ? "bg-on-primary-fixed scale-105 shadow-2xl"
                      : "bg-primary-container"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-5 ${
                    item.highlight
                      ? "bg-primary text-on-primary"
                      : "bg-primary/30 text-on-primary"
                  }`}>
                    {item.icon}
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                    item.highlight ? "text-on-surface-variant" : "text-on-primary/50"
                  }`}>
                    Adım {item.step}
                  </p>
                  <h3 className={`font-display text-headline-md mb-3 ${
                    item.highlight ? "text-on-background" : "text-on-primary"
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    item.highlight ? "text-on-surface-variant" : "text-on-primary/75"
                  }`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Alt bilgi şeridi */}
            <div className="bg-primary-container rounded-md px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap justify-center sm:justify-start gap-8 text-center sm:text-left">
                {[
                  { label: "Üyelik Ücreti",        value: "Ücretsiz" },
                  { label: "Rezervasyon Ücreti",   value: "Ücretsiz" },
                  { label: "İptal (24 saat önce)", value: "Tam İade" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-on-primary font-bold text-lg font-display">{item.value}</p>
                    <p className="text-on-primary/60 text-xs mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/egitmenlerimiz"
                className="shrink-0 inline-flex items-center gap-2 bg-surface-container-lowest text-primary px-6 py-3 rounded-full text-label-md font-bold hover:bg-primary-fixed transition-colors cursor-pointer"
              >
                Öğretmen Fiyatlarını Gör
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── GÜVEN ROZETLERİ ──────────────────────────────── */}
        <section className="bg-surface-container-low py-16">
          <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: "🛡️", title: "Güvenli Ödeme",      desc: "iyzico 256-bit SSL" },
                { icon: "✅", title: "Onaylı Öğretmenler", desc: "Belge incelemeli kabul" },
                { icon: "📋", title: "Veli Takip Raporu",  desc: "Her dersten sonra not" },
                { icon: "🔄", title: "Ücretsiz İptal",     desc: "24 saat öncesinde" },
              ].map((b) => (
                <div key={b.title} className="cursor-default">
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <p className="font-display font-bold text-on-background text-sm">{b.title}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SSS ──────────────────────────────────────────── */}
        <section className="bg-background py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-3">SSS</p>
              <h2 className="font-display text-headline-lg text-on-background">Sıkça Sorulan Sorular</h2>
            </div>
            <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static">
              <FaqAccordion items={faqItems} />
            </div>
            <p className="text-center mt-6 text-on-surface-variant text-sm">
              Aklınıza başka sorular mı takıldı?{" "}
              <Link href="/iletisim" className="text-primary font-semibold hover:underline cursor-pointer">
                Bize ulaşın
              </Link>
            </p>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="bg-primary py-20 relative overflow-hidden">
          <div className="blob-bg bg-primary-fixed w-96 h-96 rounded-full -top-20 -left-20 opacity-25" />
          <div className="blob-bg bg-secondary-fixed w-72 h-72 rounded-full bottom-10 -right-16 opacity-20" style={{ animationDelay: "-4s" }} />

          <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-headline-lg md:text-headline-xl text-on-primary mb-4">
              Çocuğunuzun Başarısı<br/>Bir Tık Uzağınızda
            </h2>
            <p className="text-on-primary/80 text-body-lg mb-10 max-w-xl mx-auto">
              Hemen üye olun, uzman öğretmenlerle ilk dersi planlayın. İlk ders memnuniyeti garantilidir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-display font-bold text-body-md hover:bg-primary-fixed transition-colors cursor-pointer squishy-btn"
                style={{ boxShadow: "0 4px 0 rgba(0,0,0,0.2)" }}
              >
                Ücretsiz Kayıt Ol
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <Link
                href="/egitmen-basvurusu"
                className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary border-2 border-primary-fixed-dim/40 px-8 py-4 rounded-full font-display font-semibold text-body-md hover:bg-primary-fixed/20 transition-colors cursor-pointer"
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
