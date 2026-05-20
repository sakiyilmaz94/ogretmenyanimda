import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Link from "next/link";

export const metadata = { title: "SSS — Öğretmen Yanımda" };

const faqCategories = [
  {
    title: "Platform & Dersler",
    items: [
      { q: "Özel dersler nasıl işliyor?", a: "Her öğrencinin ihtiyacına göre birebir veya grup ders seçeneklerimiz bulunmaktadır. Veli platformdan öğretmeni seçer, uygun saati rezerve eder, ödeme yapar ve ders başlar." },
      { q: "Dersler hangi seviyeleri kapsıyor?", a: "İlkokul (1–4. sınıf) ve ortaokul (5–8. sınıf) öğrencilerine yönelik kapsamlı dersler sunmaktayız." },
      { q: "Dersler online mı yapılmaktadır?", a: "Evet, tüm dersler interaktif online platformumuz üzerinden gerçekleşmektedir. İnternet bağlantısı ve kamera yeterlidir." },
      { q: "Bireysel ders süresi ne kadar?", a: "Bireysel dersler 45 dakika, grup dersleri ise 60 dakikadır." },
      { q: "Grup derslerinde kaç öğrenci var?", a: "Her grup dersi maksimum 6 öğrenci ile sınırlıdır. Bu sayede her öğrenciye yeterli ilgi gösterilir." },
    ],
  },
  {
    title: "Öğretmenler",
    items: [
      { q: "Öğretmenler kimlerdir?", a: "Uzman eğitimcilerimiz alanlarında deneyimli ve sertifikalı öğretmenlerden oluşmaktadır. Her öğretmen özgeçmiş, diploma ve referans incelemesinden geçer." },
      { q: "Öğretmen nasıl seçebilirim?", a: "Platform üzerinden öğretmenlerin profillerini, uzmanlık alanlarını ve ücretlerini inceleyebilir, size en uygun olanı seçebilirsiniz." },
      { q: "Öğretmenim uygun değilse değiştirebilir miyim?", a: "Evet, herhangi bir sebep göstermeksizin öğretmen değişikliği talep edebilirsiniz. Destek ekibimiz en kısa sürede yardımcı olur." },
    ],
  },
  {
    title: "Ödeme & İptal",
    items: [
      { q: "Ödemeler nasıl yapılmaktadır?", a: "Kredi kartı, banka kartı ve dijital cüzdan seçenekleriyle iyzico güvenceli ödeme yapabilirsiniz. Kartınız otomatik olarak kaydedilmez." },
      { q: "Ödeme güvenli mi?", a: "Ödemeler iyzico altyapısıyla 256-bit SSL şifrelemeli olarak işlenmektedir. Kart bilgileriniz hiçbir şekilde sistemimizde saklanmaz." },
      { q: "Ders iptali durumunda ne olur?", a: "En az 24 saat öncesinde bildirilen iptallerде tam ücret iadesi veya ders erteleme yapılır. 24 saat içinde yapılan iptallerde ücret iadesi yapılmaz." },
      { q: "İade süreci ne kadar sürer?", a: "Onaylanan iade talepleri 3–5 iş günü içinde kart hesabınıza yansıtılır." },
    ],
  },
];

export default function SSSPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-ivory py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">SSS</p>
            <h1 className="font-serif text-5xl text-navy-900 mb-4">Sıkça Sorulan Sorular</h1>
            <p className="text-slate-600 text-lg">İhtiyaç duyduğunuz bilgilere hızlıca ulaşabilirsiniz. Cevabı bulamazsanız bize yazın.</p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {faqCategories.map((cat) => (
              <div key={cat.title}>
                <h2 className="font-semibold text-navy-900 text-lg mb-4 pb-2 border-b-2 border-gold-400 inline-block">{cat.title}</h2>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                  <FaqAccordion items={cat.items} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-navy-900 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl text-white mb-3">Aradığınızı Bulamadınız mı?</h2>
            <p className="text-navy-300 mb-6">Sorularınız için destek ekibimize ulaşabilirsiniz. Size en kısa sürede dönüş yapacağız.</p>
            <Link href="/iletisim" className="inline-flex items-center gap-2 bg-gold-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-gold-600 transition-colors cursor-pointer">
              Bize Ulaşın
            </Link>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
