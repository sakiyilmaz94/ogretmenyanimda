import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { db } from "@/lib/db";
import { SUBJECT_LABELS, GRADE_LABELS, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Öğretmenlerimiz — Öğretmen Yanımda" };

export default async function EgitmenlerimizPage() {
  const educators = await db.educator.findMany({
    where: { status: "APPROVED" },
    include: {
      user: true,
      educatorLessons: { where: { status: "APPROVED" }, include: { lessonProgram: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const publicEducators = educators.filter((e) => e.isProfilePublic);
  const allEducators = educators;

  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-navy-900 py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Öğretmenlerimiz</p>
            <h1 className="font-serif text-5xl text-white mb-4">Uzman Kadromuzla Tanışın</h1>
            <p className="text-navy-200 text-lg">
              Onaylı öğretmenlerimizin tamamı özgeçmiş, diploma ve referans incelemesinden geçmiştir.
            </p>
          </div>
        </section>

        {/* Trust badges */}
        <section className="bg-white py-10 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { label: "Onaylı Öğretmen", count: `${allEducators.length}+` },
                { label: "Ortalama Deneyim", count: "5+ yıl" },
                { label: "Öğrenci Memnuniyeti", count: "%98" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold text-navy-900">{s.count}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {allEducators.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">Yakında Burada</h3>
                <p className="text-slate-500 text-sm">Onaylı öğretmenlerimiz çok yakında yayında.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allEducators.map((e) => (
                  <div key={e.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-gold-300 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-navy-900">
                        {e.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={e.photoUrl} alt={e.user.name ?? ""} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-serif text-2xl text-gold-400">
                            {(e.user.name ?? "E")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-900">{e.user.name}</h3>
                        {e.titleName && <p className="text-xs text-slate-500">{e.titleName}</p>}
                        {e.hourlyRate && (
                          <p className="text-gold-600 font-bold text-sm">{formatCurrency(e.hourlyRate.toNumber())}/saat</p>
                        )}
                      </div>
                    </div>

                    {e.bio && (
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">{e.bio}</p>
                    )}

                    {e.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {e.subjects.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full border border-navy-100">
                            {SUBJECT_LABELS[s] ?? s}
                          </span>
                        ))}
                        {e.subjects.length > 3 && (
                          <span className="text-xs text-slate-400">+{e.subjects.length - 3}</span>
                        )}
                      </div>
                    )}

                    {e.gradeLevels.length > 0 && (
                      <p className="text-xs text-slate-500 mb-3">
                        {e.gradeLevels.map((g) => GRADE_LABELS[g] ?? g).slice(0, 2).join(", ")}
                        {e.gradeLevels.length > 2 && " ..."}
                      </p>
                    )}

                    {e.experience && (
                      <p className="text-xs text-slate-400 mb-3">{e.experience} yıl deneyim</p>
                    )}

                    <div className="mt-auto flex gap-2">
                      {e.isProfilePublic ? (
                        <Link
                          href={`/egitmenlerimiz/${e.id}`}
                          className="flex-1 text-center bg-navy-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors cursor-pointer"
                        >
                          Profili Gör
                        </Link>
                      ) : (
                        <Link
                          href="/register"
                          className="flex-1 text-center bg-navy-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors cursor-pointer"
                        >
                          Ders Al
                        </Link>
                      )}
                      <Link
                        href="/register"
                        className="flex-1 text-center border border-gold-400 text-gold-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-50 transition-colors cursor-pointer"
                      >
                        Randevu Al
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gold-500 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl text-white mb-3">Siz de Öğretmen Olmak İster misiniz?</h2>
            <p className="text-white/85 mb-6">Binlerce öğrenciye ulaşın, kendi programınızı oluşturun.</p>
            <Link href="/egitmen-basvurusu" className="inline-flex items-center gap-2 bg-white text-gold-600 px-7 py-3.5 rounded-xl font-bold hover:bg-gold-50 transition-colors cursor-pointer">
              Öğretmen Başvurusu Yap
            </Link>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
