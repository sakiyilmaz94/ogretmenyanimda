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
        <section className="bg-navy-900 py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-4">Hakkımızda</p>
            <h1 className="font-serif text-5xl text-white mb-6 leading-tight">
              Formasyonlu Öğretmenlerle<br />Güvenli Özel Ders
            </h1>
            <p className="text-navy-200 text-xl leading-relaxed max-w-2xl mx-auto">
              Yeni kurulduk. Büyük rakamlar değil, samimi bir başlangıç sunuyoruz. Her öğrenci bize önemli — ve bunu her adımda hissettirmeye kararlıyız.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-ivory py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3 text-center">Hikayemiz</p>
            <h2 className="font-serif text-4xl text-navy-900 mb-8 text-center">Neden Bunu Kuruyoruz?</h2>
            <div className="space-y-5 text-slate-600 text-lg leading-relaxed">
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
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Veliler İçin</p>
                <h2 className="font-serif text-4xl text-navy-900 mb-6">Çocuğunuz Emin Ellerde</h2>
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
                      <p className="text-slate-700">{item.text}</p>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="inline-block mt-8 bg-gold-500 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-gold-600 transition-colors">
                  Hemen Ders Al
                </Link>
              </div>
              <div className="bg-navy-50 rounded-3xl p-8 border border-navy-100">
                <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Öğretmenler İçin</p>
                <h2 className="font-serif text-3xl text-navy-900 mb-6">Emeğinizin Karşılığını Alın</h2>
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
                      <p className="text-slate-700">{item.text}</p>
                    </li>
                  ))}
                </ul>
                <Link href="/egitmen-basvurusu" className="inline-block mt-8 bg-navy-900 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-navy-800 transition-colors">
                  Öğretmen Olarak Başvur
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-ivory py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Değerlerimiz</p>
              <h2 className="font-serif text-4xl text-navy-900">Bizi Biz Yapan İlkeler</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { n: "1", title: "Şeffaflık", desc: "Her ücret, her kural açık. Gizli maliyet yok, sürpriz yok." },
                { n: "2", title: "Güven", desc: "Öğretmenleri doğruluyoruz. Veliler çocuklarını gönül rahatlığıyla emanet edebilir." },
                { n: "3", title: "Erişilebilirlik", desc: "İstanbul'da da olsanız, Muş'ta da — aynı kalitede öğretmene ulaşabilirsiniz." },
                { n: "4", title: "Samimiyet", desc: "Yeni bir platformuz. Büyük rakamlar yerine dürüst bir başlangıç sunuyoruz." },
              ].map((v) => (
                <div key={v.title} className="p-7 bg-white rounded-2xl border border-slate-100 hover:border-gold-200 hover:shadow-md transition-all duration-300 flex gap-5">
                  <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center shrink-0">
                    <span className="font-serif text-gold-400 font-bold">{v.n}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-1">{v.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy-900 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl text-white mb-4">Birlikte Büyüyelim</h2>
            <p className="text-navy-200 text-lg mb-8 leading-relaxed">
              Öğretmenlerimizin ilk üyeleri arasında yer alın ya da çocuğunuz için hemen ders ayarlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-gold-500 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-gold-600 transition-colors">
                Ders Al
              </Link>
              <Link href="/egitmen-basvurusu" className="bg-navy-800 text-white border border-navy-600 px-7 py-3.5 rounded-xl font-semibold hover:bg-navy-700 transition-colors">
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
