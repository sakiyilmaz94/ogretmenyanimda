import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata = { title: "Mesafeli Satış Sözleşmesi — Öğretmen Yanımda" };

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">
        <section className="bg-ivory py-16">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Yasal</p>
            <h1 className="font-serif text-4xl text-navy-900 mb-2">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-slate-500 text-sm">Son güncelleme: Mayıs 2026</p>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="space-y-8 text-slate-700 text-sm leading-relaxed">

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">Madde 1 — Taraflar</h2>
                <p><strong className="text-navy-900">Satıcı:</strong> Öğretmen Yanımda Eğitim Teknolojileri<br />
                E-posta: info@ogretmenyanimda.com.tr</p>
                <p className="mt-2"><strong className="text-navy-900">Alıcı:</strong> Platforma kayıt olan ve hizmet satın alan kullanıcı (Veli veya öğrenci).</p>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">Madde 2 — Konu</h2>
                <p>İşbu sözleşme, Alıcı&apos;nın Öğretmen Yanımda platformu üzerinden satın aldığı online özel ders hizmetlerine ilişkin hak ve yükümlülükleri düzenlemektedir.</p>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">Madde 3 — Hizmet Bedeli ve Ödeme</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ders ücreti rezervasyon sırasında ekranda gösterilir.</li>
                  <li>Ödeme, iyzico güvenli ödeme altyapısı üzerinden kredi kartı veya banka kartıyla yapılır.</li>
                  <li>Kart bilgileri sistemimizde saklanmaz.</li>
                  <li>Ödeme onayı ile rezervasyon kesinleşir.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">Madde 4 — Teslimat</h2>
                <p>Satın alınan hizmet, belirlenen ders tarih ve saatinde online platform üzerinden sunulur. Ders linki ve bilgileri e-posta ve platform bildirimleri ile iletilir.</p>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">Madde 5 — İptal ve İade</h2>
                <p>İptal ve iade koşulları için <a href="/iptal-ve-iade-kosullar" className="text-gold-600 hover:underline">İptal ve İade Koşulları</a> sayfamızı inceleyiniz.</p>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">Madde 6 — Uyuşmazlık Çözümü</h2>
                <p>İşbu sözleşmeden doğacak uyuşmazlıklarda Türk Hukuku uygulanır. Tüketici Hakem Heyeti ve Tüketici Mahkemeleri yetkilidir.</p>
              </div>

              <div>
                <h2 className="font-serif text-xl text-navy-900 mb-3">Madde 7 — Cayma Hakkı</h2>
                <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, hizmetin ifasına başlanmadan önce 14 gün içinde cayma hakkı kullanılabilir. Ders gerçekleştikten sonra cayma hakkı kullanılamaz.</p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
