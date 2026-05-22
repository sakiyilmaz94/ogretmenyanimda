import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata = { title: "İptal ve İade Koşulları — Öğretmen Yanımda" };

export default function IptalIadeKosullarPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">

          <div className="mb-8">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Yasal</p>
            <h1 className="font-display text-headline-lg text-on-background mb-2">İptal ve İade Koşulları</h1>
            <p className="text-outline text-body-md">Son güncelleme: Mayıs 2026</p>
          </div>

          <div className="bg-surface-container-lowest rounded-md p-10 soft-card-static">
            <div className="space-y-8 text-on-surface-variant text-body-md leading-relaxed">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { icon: "✅", title: "24 Saat Öncesi", desc: "Tam iade" },
                  { icon: "⚠️", title: "24 Saat İçinde", desc: "İade yapılmaz" },
                  { icon: "🔄", title: "Öğretmen İptali", desc: "Tam iade veya erteleme" },
                ].map((item) => (
                  <div key={item.title} className="bg-surface-container-low rounded-md p-5 text-center">
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="font-semibold text-on-background text-label-md">{item.title}</p>
                    <p className="text-outline text-caption mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">1. İptal Koşulları</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-on-background">Dersten 24 saat veya daha fazla önce yapılan iptaller:</strong> Ücretin tamamı iade edilir veya talep halinde ders başka bir tarihe ertelenir.</li>
                  <li><strong className="text-on-background">Dersten 24 saatten az önce yapılan iptaller:</strong> Ücret iadesi yapılmaz. Ancak öğretmenin onayıyla tek seferlik erteleme yapılabilir.</li>
                  <li><strong className="text-on-background">Ders başladıktan sonra yapılan iptaller:</strong> Ücret iadesi yapılmaz.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">2. Öğretmen Tarafından İptal</h2>
                <p>Öğretmenin derse girmemesi veya dersi iptal etmesi durumunda ücretin tamamı 3–5 iş günü içinde iade edilir. Bunun yanı sıra alternatif öğretmen ya da erteleme seçeneği sunulur.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">3. İade Süreci</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>İade talebinizi <a href="/iletisim" className="text-primary hover:underline">iletişim formundan</a> veya info@ogretmenyanimda.com.tr adresine e-posta göndererek yapabilirsiniz.</li>
                  <li>Onaylanan iadeler 3–5 iş günü içinde ödeme yaptığınız kart hesabına yansıtılır.</li>
                  <li>Banka işlem sürelerine bağlı olarak hesabınıza geçiş süresi değişebilir.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">4. Teknik Sorunlar</h2>
                <p>Platform kaynaklı teknik sorun nedeniyle ders gerçekleşmezse tam iade veya ücretsiz yeniden rezervasyon hakkı tanınır.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">5. İletişim</h2>
                <p>İade ve iptal talepleriniz için: <a href="mailto:info@ogretmenyanimda.com.tr" className="text-primary hover:underline">info@ogretmenyanimda.com.tr</a></p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
