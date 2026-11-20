import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import SalesAnnouncementBar from "@/components/layout/SalesAnnouncementBar";
import { auth } from "@/auth";

export const metadata = {
  title: "Ücretsiz Eğitim Oyunları — Öğretmen Yanımda",
  description: "İlkokul öğrencileri için ücretsiz çarpım tablosu, okuma ve harf-ses oyunları.",
};

const GAMES = [
  {
    href: "/oyunlar/carpim-tablosu.html",
    emoji: "🧮",
    title: "Çarpım Tablosu Hız Testi",
    desc: "Çalışmak istediğin tabloları seç, soru sayısını belirle. Süre tutulur, en çok zorlandığın tablo söylenir.",
    tag: "Matematik",
  },
  {
    href: "/oyunlar/tane-tane-oku.html",
    emoji: "📖",
    title: "Tane Tane Oku",
    desc: "Harfler birleşir, heceler, kelimeler ve cümleler tane tane akar. İlkokul 1. sınıf ses gruplarına göre.",
    tag: "Okuma",
  },
  {
    href: "/oyunlar/hiz-okuma.html",
    emoji: "⚡",
    title: "Hız Okuma Antrenmanı",
    desc: "Kelimeler ekrandan tek tek akar, göz tek bakışta okumaya alışır. Hazır hikâyeler ve göz taraması alıştırması içerir.",
    tag: "Okuma Hızı",
  },

];

export default async function OyunlarPage() {
  const session = await auth();
  const role = session?.user?.role ?? null;

  return (
    <>
      <SalesAnnouncementBar />
      <PublicNavbar role={role} />
      <main className="pt-16 bg-background">
        <section className="bg-inverse-surface py-16 text-center relative overflow-hidden">
          <div className="blob-bg bg-primary-fixed w-96 h-96 rounded-full absolute -top-20 -right-20 opacity-30" />
          <div className="max-w-3xl mx-auto px-4 relative">
            <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-3">Ücretsiz</p>
            <h1 className="font-display text-headline-xl text-on-background mb-4">Eğitim Oyunları</h1>
            <p className="text-on-surface-variant text-body-lg">
              Çocuğunuzla birlikte oynayın. Kayıt gerekmez, telefonda ve bilgisayarda çalışır.
            </p>
          </div>
        </section>

        <section className="bg-surface-container-low py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {GAMES.map((g) => (
              <a
                key={g.href}
                href={g.href}
                className="bg-surface-container-lowest rounded-md p-7 soft-card flex flex-col text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="text-6xl mb-4" aria-hidden="true">{g.emoji}</div>
                <span className="self-center text-caption bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-semibold mb-3">{g.tag}</span>
                <h2 className="font-display text-headline-md text-on-background mb-2">{g.title}</h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed flex-1">{g.desc}</p>
                <span className="mt-5 inline-flex items-center justify-center rounded-full bg-primary text-on-primary px-6 py-3 font-bold text-label-md">
                  Oyna →
                </span>
              </a>
            ))}
          </div>
          <p className="text-center text-caption text-on-surface-variant mt-8 px-4">
            Oyunların ilerlemesi yalnızca kullandığınız cihazın tarayıcısında saklanır, bizimle paylaşılmaz.
          </p>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
