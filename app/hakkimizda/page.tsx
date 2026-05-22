import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";

export const metadata = { title: "Hakkımızda — Öğretmen Yanımda" };

export default function HakkimizdaPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden bg-primary py-24">
          <div className="blob-bg w-96 h-96 bg-white/10 rounded-full -top-24 -left-24" />
          <div className="blob-bg w-80 h-80 bg-white/10 rounded-full -bottom-16 -right-16" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-4">Hakkımızda</p>
            <h1 className="font-display text-headline-xl text-on-primary mb-6 leading-tight">
              Formasyonlu Öğretmenlerle<br />Güvenli Özel Ders
            </h1>
            <p className="text-on-primary/80 text-body-lg leading-relaxed max-w-2xl mx-auto">
              Yeni kurulduk. Büyük rakamlar değil, samimi bir başlangıç sunuyoruz. Her öğrenci bize önemli — ve bunu her adımda hissettirmeye kararlıyız.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-surface-container-low py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3 block text-center mx-auto w-fit">Hikayemiz</p>
            <h2 className="font-display text-headline-lg text-on-background mb-8 text-center">Neden Bunu Kuruyoruz?</h2>
            <div className="space-y-5 text-on-surface-variant text-body-lg leading-relaxed">
              <p>
                Türkiye&apos;de pek çok veli, çocuğu için güvenilir bir özel ders öğretmeni bulmakta zorlanıyor. Sosyal medya grupları, elden tavsiyeler... Ama hangi öğretmenin diploması var? Kim gerçekten formasyonlu?
              </p>
              <p>
                Öğretmen Yanımda bu soruya net bir cevap vermek için kuruldu. Platforma kayıtlı her öğretmen belgelerini sunuyor, kimliğini doğruluyor ve yalnızca onaylandıktan sonra ders verebiliyor.
              </p>
              <p>
                Henüz yolun başındayız. Ama küçük ve güvenilir olmak, büyük ve dağınık olmaktan çok daha değerli.
              </p>
            </div>
          </div>
        </section>

        {/* For parents */}
        <section className="bg-background py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static">
                <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Veliler İçin</p>
                <h2 className="font-display text-headline-md text-on-background mb-6">Çocuğunuz Emin Ellerde</h2>
                <ul className="space-y-4">
                  {[
                    { icon: "✅", text: "Her öğretmen diploma ve kimlik doğrulamasından geçer" },
                    { icon: "📅", text: "Takvime bakın, uygun saati seçin — 5 dakikada ders ayarlayın" },
                    { icon: "💳", text: "Güvenli ödeme altyapısı ile kart bilgileriniz korunur" },
                    { icon: "🔄", text: "Dersten 24 saat önce iptal ederseniz tam iade garantisi" },
                    { icon: "💬", text: "Sorularınız için 1 iş günü içinde yanıt alırsınız" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                      <p className="text-on-surface-variant text-body-md">{item.text}</p>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="inline-block mt-8 rounded-full squishy-btn bg-primary text-on-primary px-7 py-3.5 font-semibold">
                  Hemen Ders Al
                </Link>
              </div>
              <div className="bg-surface-container rounded-md p-8 soft-card-static">
                <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Öğretmenler İçin</p>
                <h2 className="font-display text-headline-md text-on-background mb-6">Emeğinizin Karşılığını Alın</h2>
                <ul className="space-y-4">
                  {[
                    { icon: "🗓️", text: "Kendi takviminizi siz belirleyin, istediğiniz saatte ders verin" },
                    { icon: "💰", text: "Ders ücretinizi kendiniz belirleyin" },
                    { icon: "📱", text: "Tüm rezervasyonlarınızı tek ekrandan yönetin" },
                    { icon: "🎓", text: "Formasyonlu olmanız öne çıkmanızı sağlar" },
                    { icon: "🤝", text: "Yeni platform — erken üye olmanın avantajını yaşayın" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                      <p className="text-on-surface-variant text-body-md">{item.text}</p>
                    </li>
                  ))}
                </ul>
                <Link href="/egitmen-basvurusu" className="inline-block mt-8 rounded-full border-2 border-primary text-primary px-7 py-3.5 font-semibold hover:bg-primary/5 transition">
                  Öğretmen Olarak Başvur
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-surface-container-low py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Değerlerimiz</p>
              <h2 className="font-display text-headline-lg text-on-background">Bizi Biz Yapan İlkeler</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { n: "1", title: "Şeffaflık", desc: "Her ücret, her kural açık. Gizli maliyet yok, sürpriz yok." },
                { n: "2", title: "Güven", desc: "Öğretmenleri doğruluyoruz. Veliler çocuklarını gönül rahatlığıyla emanet edebilir." },
                { n: "3", title: "Erişilebilirlik", desc: "İstanbul'da da olsanız, Muş'ta da — aynı kalitede öğretmene ulaşabilirsiniz." },
                { n: "4", title: "Samimiyet", desc: "Yeni bir platformuz. Büyük rakamlar yerine dürüst bir başlangıç sunuyoruz." },
              ].map((v) => (
                <div key={v.title} className="bg-surface-container-lowest rounded-md p-7 soft-card-static flex gap-5">
                  <div className="bg-primary-fixed rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    <span className="font-display text-headline-md text-on-primary-fixed-variant font-bold">{v.n}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-background mb-1">{v.title}</h3>
                    <p className="text-on-surface-variant text-body-md leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-inverse-surface py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-headline-lg text-inverse-on-surface mb-4">Birlikte Büyüyelim</h2>
            <p className="text-inverse-on-surface/70 text-body-lg mb-8 leading-relaxed">
              Öğretmenlerimizin ilk üyeleri arasında yer alın ya da çocuğunuz için hemen ders ayarlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="rounded-full squishy-btn bg-primary text-on-primary px-7 py-3.5 font-semibold">
                Ders Al
              </Link>
              <Link href="/egitmen-basvurusu" className="rounded-full border-2 border-inverse-on-surface/30 text-inverse-on-surface px-7 py-3.5 font-semibold hover:bg-white/5 transition">
                Öğretmen Olarak Katıl
              </Link>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
