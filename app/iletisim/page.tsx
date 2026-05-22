import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata = { title: "İletişim — Öğretmen Yanımda" };

export default function IletisimPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden bg-surface-container-low py-20 text-center">
          <div className="blob-bg w-64 h-64 bg-primary/15 rounded-full -top-12 -right-12" />
          <div className="max-w-3xl mx-auto px-4 relative">
            <p className="inline-block text-label-md bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 mb-3">İletişim</p>
            <h1 className="font-display text-headline-xl text-on-background mb-4">Bize Ulaşın</h1>
            <p className="text-on-surface-variant text-body-lg">Sorularınız, önerileriniz veya destek talepleriniz için buradayız.</p>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

              {/* Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="font-display text-headline-md text-on-background mb-6">İletişim Bilgileri</h2>
                  <div className="space-y-4">
                    {[
                      {
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        ),
                        label: "E-posta",
                        value: "info@ogretmenyanimda.com.tr",
                      },
                      {
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        ),
                        label: "Platform Saatleri",
                        value: "7/24 — Dersler her gün planlanabilir",
                      },
                      {
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        ),
                        label: "Yanıt Süresi",
                        value: "1 iş günü içinde",
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="bg-primary-fixed text-on-primary-fixed-variant rounded-xl w-12 h-12 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-caption text-outline font-medium uppercase tracking-wide">{item.label}</p>
                          <p className="text-on-background font-medium mt-0.5 text-body-md">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-inverse-surface rounded-md p-6 soft-card-static">
                  <h3 className="text-inverse-on-surface font-semibold mb-2">Hızlı Yanıt</h3>
                  <p className="text-inverse-on-surface/70 text-body-md leading-relaxed">
                    Öğretmen başvuruları ve teknik destek talepleri en geç 1 iş günü içinde yanıtlanmaktadır. Platform ve dersler 7/24 erişilebilirdir.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static">
                  <h2 className="font-display text-headline-md text-on-background mb-6">Mesaj Gönderin</h2>
                  <form className="space-y-5" action="mailto:info@ogretmenyanimda.com.tr" method="get">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-label-md text-on-surface-variant mb-1.5" htmlFor="ad">Ad</label>
                        <input
                          id="ad" name="Ad" type="text" placeholder="Adınız"
                          className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface-container-low text-body-md text-on-background placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-label-md text-on-surface-variant mb-1.5" htmlFor="soyad">Soyad</label>
                        <input
                          id="soyad" name="Soyad" type="text" placeholder="Soyadınız"
                          className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface-container-low text-body-md text-on-background placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1.5" htmlFor="email">E-posta</label>
                      <input
                        id="email" name="E-posta" type="email" placeholder="ornek@email.com"
                        className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface-container-low text-body-md text-on-background placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1.5" htmlFor="konu">Konu</label>
                      <select
                        id="konu" name="Konu"
                        className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface-container-low text-body-md text-on-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      >
                        <option value="">Konu seçin</option>
                        <option value="genel">Genel Bilgi</option>
                        <option value="egitmen">Öğretmen Başvurusu</option>
                        <option value="teknik">Teknik Destek</option>
                        <option value="odeme">Ödeme & İade</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1.5" htmlFor="mesaj">Mesajınız</label>
                      <textarea
                        id="mesaj" name="Mesaj" rows={5} placeholder="Mesajınızı buraya yazın..."
                        className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface-container-low text-body-md text-on-background placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-full squishy-btn bg-primary text-on-primary py-3.5 font-semibold cursor-pointer"
                    >
                      Gönder
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
