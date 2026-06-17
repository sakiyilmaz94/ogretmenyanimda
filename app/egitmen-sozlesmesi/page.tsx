import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata = { title: "Eğitmen Hizmet Sözleşmesi — Öğretmen Yanımda" };

export default function EgitmenSozlesmesiPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">

          <div className="mb-8">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">Yasal</p>
            <h1 className="font-display text-headline-lg text-on-background mb-2">Eğitmen Hizmet Sözleşmesi</h1>
            <p className="text-outline text-body-md">Son güncelleme: Haziran 2026</p>
          </div>

          <div className="bg-surface-container-lowest rounded-md p-10 soft-card-static">
            <div className="space-y-8 text-on-surface-variant text-body-md leading-relaxed">

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 1 — Taraflar ve Tanımlar</h2>
                <p><strong className="text-on-background">Platform:</strong> Öğretmen Yanımda Eğitim Teknolojileri (&quot;Öğretmen Yanımda&quot; / &quot;Platform&quot;) — info@ogretmenyanimda.com.tr</p>
                <p className="mt-2"><strong className="text-on-background">Eğitmen:</strong> Platforma eğitmen (öğretmen) sıfatıyla kayıt olan ve işbu sözleşmeyi elektronik ortamda kabul eden gerçek kişi.</p>
                <p className="mt-2"><strong className="text-on-background">Kullanıcı:</strong> Platform üzerinden ders talep eden veli ve/veya öğrenci.</p>
                <p className="mt-2"><strong className="text-on-background">Komisyon:</strong> Platform&apos;un sunduğu aracılık hizmeti karşılığında, Eğitmen&apos;in Platform üzerinden gerçekleştirdiği derslerden Platform&apos;un yürürlükteki tarifesine göre aldığı hizmet bedeli.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 2 — Sözleşmenin Konusu</h2>
                <p>İşbu sözleşme, Platform&apos;un Eğitmen ile Kullanıcılar arasında online özel ders hizmetlerinin sunulmasına aracılık etmesine ilişkin tarafların hak ve yükümlülüklerini düzenler. Platform bir aracı hizmet sağlayıcıdır; ders hizmetinin içeriği ve ifası Eğitmen&apos;in sorumluluğundadır.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 3 — Platformun Yükümlülükleri</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Eğitmen profilini onay sürecinin ardından Kullanıcılara sunmak.</li>
                  <li>Rezervasyon, takvim, ödeme ve görüntülü görüşme (Google Meet) altyapısını sağlamak.</li>
                  <li>Kullanıcılardan tahsil edilen ders bedellerini, yürürlükteki Komisyon düşüldükten sonra Eğitmen&apos;e ödemek.</li>
                  <li>Eğitmen&apos;in yüklediği kimlik ve diploma belgelerini yalnızca kimlik doğrulama amacıyla, KVKK&apos;ya uygun şekilde işlemek.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 4 — Eğitmenin Yükümlülükleri</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Profilinde ve belgelerinde doğru, güncel ve gerçek bilgiler sunmak.</li>
                  <li>Onayladığı randevulara zamanında ve hazırlıklı katılmak; dersleri özenle ve mesleki etik kurallarına uygun yürütmek.</li>
                  <li>Kullanıcılara karşı saygılı davranmak, mevzuata ve genel ahlaka aykırı davranışlardan kaçınmak.</li>
                  <li>Platform üzerinden edindiği Kullanıcı bilgilerini gizli tutmak ve yalnızca ders amacıyla kullanmak.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 5 — Komisyon ve Ödeme</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Eğitmen, Platform üzerinden gerçekleştirdiği tüm derslerden Platform&apos;un yürürlükteki Komisyon oranını/tarifesini ödemeyi kabul eder. Güncel oran Eğitmen panelinde ve/veya ekte belirtilir.</li>
                  <li>Platform üzerinden tanışılan Kullanıcılarla yapılan derslere ilişkin <strong className="text-on-background">tüm ödemeler münhasıran Platform üzerinden</strong> gerçekleştirilir.</li>
                  <li>Eğitmen&apos;e ödeme, Platform&apos;un belirlediği dönem ve yöntemle, Komisyon mahsup edilerek yapılır.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 6 — Platform Dışına Çıkmama ve Rekabet Etmeme</h2>
                <p>Eğitmen, Platform&apos;un aracılık hizmeti ve bundan doğan Komisyon hakkının korunması amacıyla aşağıdaki yükümlülükleri kabul ve taahhüt eder:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Platform aracılığıyla tanıştığı hiçbir Kullanıcı (veli/öğrenci) ile, Platform dışında doğrudan ya da dolaylı olarak ders vermemek; bu amaçla özel iletişim bilgisi (telefon, e-posta, sosyal medya vb.) talep etmemek, vermemek veya paylaşmamak.</li>
                  <li>Kullanıcıyı Platform dışında ders almaya, ödeme yapmaya veya iletişime geçmeye <strong className="text-on-background">yönlendirmemek, teşvik etmemek</strong>; bu yönde teklifte bulunmamak.</li>
                  <li>Bu yükümlülük, ilgili Kullanıcı ile Platform üzerinden gerçekleşen <strong className="text-on-background">son temas/dersten itibaren 12 (on iki) ay</strong> boyunca geçerlidir.</li>
                </ul>
                <p className="mt-3"><strong className="text-on-background">Cezai Şart:</strong> Eğitmen&apos;in bu maddeyi ihlal etmesi hâlinde, ihlale konu her bir Kullanıcı için, Platform&apos;un söz konusu Kullanıcı üzerinden mahrum kaldığı/kalacağı aylık Komisyon tutarının <strong className="text-on-background">on iki (12) katı</strong> tutarında cezai şartı, Platform&apos;un ilk yazılı talebi üzerine ödemeyi kabul eder. Platform&apos;un bu tutarı aşan gerçek zararını ayrıca talep hakkı saklıdır. İşbu cezai şart, 6098 sayılı Türk Borçlar Kanunu&apos;nun 179-182. maddeleri kapsamında kararlaştırılmıştır.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 7 — Fikri Mülkiyet, Gizlilik ve Kişisel Verilerin Korunması</h2>
                <p>Eğitmen, Platform aracılığıyla edindiği Kullanıcı kişisel verilerini yalnızca ders hizmetinin ifası amacıyla, 6698 sayılı KVKK&apos;ya uygun olarak işler; bu verileri üçüncü kişilerle paylaşamaz ve sözleşme amacı dışında kullanamaz. Platform&apos;a ait marka, yazılım ve içeriklerin tüm fikri mülkiyet hakları Platform&apos;a aittir.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 8 — Sözleşmenin Süresi ve Feshi</h2>
                <p>İşbu sözleşme, Eğitmen&apos;in kaydı ile yürürlüğe girer ve taraflardan biri feshetmedikçe yürürlükte kalır. Taraflar sözleşmeyi yazılı bildirimle her zaman feshedebilir. Eğitmen&apos;in Madde 4 veya Madde 6&apos;daki yükümlülükleri ihlal etmesi hâlinde Platform sözleşmeyi derhal feshedebilir ve hesabı askıya alabilir. Madde 6&apos;daki yükümlülükler ve cezai şart, sözleşmenin sona ermesinden sonra da belirtilen süre boyunca geçerliliğini korur.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 9 — Uyuşmazlıkların Çözümü ve Yetki</h2>
                <p>İşbu sözleşmeden doğacak uyuşmazlıklarda Türk Hukuku uygulanır. Uyuşmazlıkların çözümünde <strong className="text-on-background">İstanbul Mahkemeleri ve İcra Daireleri</strong> yetkilidir.</p>
              </div>

              <div>
                <h2 className="font-display text-headline-md text-on-background mb-3">Madde 10 — Yürürlük ve Elektronik Kabul</h2>
                <p>Eğitmen, kayıt sırasında işbu sözleşmeyi okuduğunu, anladığını ve kabul ettiğini elektronik ortamda onaylar. Bu elektronik onay, tarafların serbest iradesiyle kurulmuş geçerli bir sözleşme hükmündedir ve imza yerine geçer.</p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
