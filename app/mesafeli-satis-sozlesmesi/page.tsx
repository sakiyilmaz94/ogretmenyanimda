import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata = { title: "Mesafeli Satış Sözleşmesi — Öğretmen Yanımda" };

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">

          <div className="mb-8">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Yasal</p>
            <h1 className="font-display text-headline-lg text-on-background mb-2">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-outline text-body-md">Son güncelleme: Mayıs 2026</p>
          </div>

          <div className="bg-surface-container-lowest rounded-md p-10 soft-card-static">
            <div className="space-y-8 text-on-surface-variant text-body-md leading-relaxed">

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 1 — Taraflar</h2>
                <p><strong className="text-on-background">Satıcı:</strong> Öğretmen Yanımda Eğitim Teknolojileri<br />
                E-posta: info@ogretmenyanimda.com.tr</p>
                <p className="mt-2"><strong className="text-on-background">Alıcı:</strong> Platforma kayıt olan ve hizmet satın alan kullanıcı (Veli veya öğrenci).</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 2 — Konu</h2>
                <p>İşbu sözleşme, Alıcı&apos;nın Öğretmen Yanımda platformu üzerinden satın aldığı online özel ders hizmetlerine ilişkin hak ve yükümlülükleri düzenlemektedir.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 3 — Hizmet Bedeli ve Ödeme</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ders ücreti rezervasyon sırasında ekranda gösterilir.</li>
                  <li>Ödeme, iyzico güvenli ödeme altyapısı üzerinden kredi kartı veya banka kartıyla yapılır.</li>
                  <li>Kart bilgileri sistemimizde saklanmaz.</li>
                  <li>Ödeme onayı ile rezervasyon kesinleşir.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 4 — Teslimat</h2>
                <p>Satın alınan hizmet, belirlenen ders tarih ve saatinde online platform üzerinden sunulur. Ders linki ve bilgileri e-posta ve platform bildirimleri ile iletilir.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 5 — İptal ve İade</h2>
                <p>İptal ve iade koşulları için <a href="/iptal-ve-iade-kosullar" className="text-primary hover:underline">İptal ve İade Koşulları</a> sayfamızı inceleyiniz.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 6 — Uyuşmazlık Çözümü</h2>
                <p>İşbu sözleşmeden doğacak uyuşmazlıklarda Türk Hukuku uygulanır. Tüketici Hakem Heyeti ve Tüketici Mahkemeleri yetkilidir.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 7 — Cayma Hakkı</h2>
                <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, hizmetin ifasına başlanmadan önce 14 gün içinde cayma hakkı kullanılabilir. Ders gerçekleştikten sonra cayma hakkı kullanılamaz.</p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
