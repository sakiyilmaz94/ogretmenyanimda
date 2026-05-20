import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata = { title: "İptal ve İade Koşulları — Öğretmen Yanımda" };

export default function IptalIadeKosullarPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">
        <section className="bg-ivory py-16">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Yasal</p>
            <h1 className="font-serif text-4xl text-navy-900 mb-2">İptal ve İade Koşulları</h1>
            <p className="text-slate-500 text-sm">Son güncelleme: Mayıs 2026</p>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="space-y-8 text-slate-700 text-sm leading-relaxed">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { icon: "✅", title: "24 Saat Öncesi", desc: "Tam iade" },
                  { icon: "⚠️", title: "24 Saat İçinde", desc: "İade yapılmaz" },
                  { icon: "🔄", title: "Öğretmen İptali", desc: "Tam iade veya erteleme" },
                ].map((item) => (
                  <div key={item.title} className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="font-semibold text-navy-900 text-sm">{item.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">1. İptal Koşulları</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-navy-900">Dersten 24 saat veya daha fazla önce yapılan iptaller:</strong> Ücretin tamamı iade edilir veya talep halinde ders başka bir tarihe ertelenir.</li>
                  <li><strong className="text-navy-900">Dersten 24 saatten az önce yapılan iptaller:</strong> Ücret iadesi yapılmaz. Ancak öğretmenin onayıyla tek seferlik erteleme yapılabilir.</li>
                  <li><strong className="text-navy-900">Ders başladıktan sonra yapılan iptaller:</strong> Ücret iadesi yapılmaz.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">2. Öğretmen Tarafından İptal</h2>
                <p>Öğretmenin derse girmemesi veya dersi iptal etmesi durumunda ücretin tamamı 3–5 iş günü içinde iade edilir. Bunun yanı sıra alternatif öğretmen ya da erteleme seçeneği sunulur.</p>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">3. İade Süreci</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>İade talebinizi <a href="/iletisim" className="text-gold-600 hover:underline">iletişim formundan</a> veya info@ogretmenyanimda.com.tr adresine e-posta göndererek yapabilirsiniz.</li>
                  <li>Onaylanan iadeler 3–5 iş günü içinde ödeme yaptığınız kart hesabına yansıtılır.</li>
                  <li>Banka işlem sürelerine bağlı olarak hesabınıza geçiş süresi değişebilir.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">4. Teknik Sorunlar</h2>
                <p>Platform kaynaklı teknik sorun nedeniyle ders gerçekleşmezse tam iade veya ücretsiz yeniden rezervasyon hakkı tanınır.</p>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">5. İletişim</h2>
                <p>İade ve iptal talepleriniz için: <a href="mailto:info@ogretmenyanimda.com.tr" className="text-gold-600 hover:underline">info@ogretmenyanimda.com.tr</a></p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
