import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata = { title: "Gizlilik Politikası — Öğretmen Yanımda" };

export default function GizlilikPolitikasiPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">

          <div className="mb-8">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Yasal</p>
            <h1 className="font-display text-headline-lg text-on-background mb-2">Gizlilik Politikası</h1>
            <p className="text-outline text-body-md">Son güncelleme: Mayıs 2026</p>
          </div>

          <div className="bg-surface-container-lowest rounded-md p-10 soft-card-static">
            <div className="space-y-8 text-on-surface-variant text-body-md leading-relaxed">

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">1. Veri Sorumlusu</h2>
                <p>Öğretmen Yanımda platformu olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla hareket etmekteyiz. Kullanıcılarımızın kişisel verilerini güvenli bir şekilde işlemek ve korumak öncelikli sorumluluğumuzdur.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">2. Toplanan Veriler</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ad, soyad ve e-posta adresi (kayıt sırasında)</li>
                  <li>Telefon numarası (isteğe bağlı)</li>
                  <li>Ödeme bilgileri (yalnızca iyzico güvenli ödeme altyapısı üzerinden işlenir; kartınız sistemimizde saklanmaz)</li>
                  <li>Profil fotoğrafı (yalnızca öğretmenler için, isteğe bağlı)</li>
                  <li>Ders rezervasyon ve ödeme geçmişi</li>
                  <li>IP adresi ve tarayıcı bilgileri (güvenlik ve analiz amaçlı)</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">3. Verilerin Kullanım Amacı</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hizmet sunumu ve hesap yönetimi</li>
                  <li>Ders rezervasyonu ve ödeme işlemleri</li>
                  <li>Müşteri destek hizmetleri</li>
                  <li>Platform güvenliğinin sağlanması</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">4. Veri Güvenliği</h2>
                <p>Verileriniz, endüstri standardı SSL/TLS şifrelemesi ile korunmaktadır. Supabase (PostgreSQL) veritabanımız, Avrupa veri merkezi (Frankfurt) üzerinde barındırılmaktadır. Ödeme işlemleri iyzico&apos;nun 256-bit SSL altyapısıyla güvence altındadır.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">5. Üçüncü Taraf Paylaşımı</h2>
                <p>Kişisel verileriniz; yasal zorunluluklar dışında, açık rızanız olmaksızın üçüncü taraflarla paylaşılmaz. Ödeme işlemcisi iyzico ve bulut altyapı sağlayıcıları (Supabase, Vercel), gerekli hizmetlerin sunulması için verilerinize sınırlı erişime sahiptir.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">6. Haklarınız</h2>
                <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Kişisel verilerinize erişim ve kopyasını talep etme</li>
                  <li>Yanlış verilerin düzeltilmesini isteme</li>
                  <li>Verilerinizin silinmesini talep etme</li>
                  <li>Veri işlemeye itiraz etme</li>
                </ul>
                <p className="mt-2">Talepleriniz için: <a href="mailto:info@ogretmenyanimda.com.tr" className="text-primary hover:underline">info@ogretmenyanimda.com.tr</a></p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">7. İletişim</h2>
                <p>Gizlilik politikamıza ilişkin sorularınız için <a href="/iletisim" className="text-primary hover:underline">iletişim sayfamızı</a> ziyaret edebilirsiniz.</p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
