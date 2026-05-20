import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { SUBJECT_LABELS, GRADE_LABELS, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const educator = await db.educator.findUnique({ where: { id }, include: { user: true } });
  if (!educator) return { title: "Öğretmen Bulunamadı" };
  return { title: `${educator.user.name} — Öğretmen Yanımda` };
}

export default async function EducatorPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const educator = await db.educator.findUnique({
    where: { id, status: "APPROVED", isProfilePublic: true },
    include: {
      user: true,
      educatorLessons: { where: { status: "APPROVED" }, include: { lessonProgram: true } },
      reviews: { where: { isPublic: true }, include: { student: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!educator) notFound();

  const avgRating = educator.reviews.length > 0
    ? (educator.reviews.reduce((s, r) => s + r.rating, 0) / educator.reviews.length).toFixed(1)
    : null;

  return (
    <>
      <PublicNavbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-navy-900 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-navy-800 border-2 border-navy-700 flex items-center justify-center shrink-0 overflow-hidden">
                {educator.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={educator.photoUrl} alt={educator.user.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif text-4xl text-gold-400">
                    {(educator.user.name ?? "E")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-1">
                  {educator.titleName ?? "Öğretmen"}
                </p>
                <h1 className="font-serif text-3xl text-white mb-2">{educator.user.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-navy-300 text-sm">
                  {educator.experience && <span>{educator.experience} yıl deneyim</span>}
                  {avgRating && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {avgRating} ({educator.reviews.length} değerlendirme)
                    </span>
                  )}
                  {educator.hourlyRate && (
                    <span className="text-gold-400 font-bold">{formatCurrency(educator.hourlyRate.toNumber())} / saat</span>
                  )}
                </div>
              </div>
              <Link
                href="/register"
                className="bg-gold-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gold-600 transition shrink-0"
              >
                Randevu Al
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left */}
              <div className="lg:col-span-2 space-y-8">
                {educator.bio && (
                  <div>
                    <h2 className="font-serif text-xl text-navy-900 mb-3">Hakkında</h2>
                    <p className="text-slate-600 leading-relaxed">{educator.bio}</p>
                  </div>
                )}

                {educator.subjects.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl text-navy-900 mb-3">Ders Konuları</h2>
                    <div className="flex flex-wrap gap-2">
                      {educator.subjects.map((s) => (
                        <span key={s} className="bg-navy-50 text-navy-700 px-3 py-1 rounded-full text-sm border border-navy-100">
                          {SUBJECT_LABELS[s] ?? s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {educator.gradeLevels.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl text-navy-900 mb-3">Sınıf Seviyeleri</h2>
                    <div className="flex flex-wrap gap-2">
                      {educator.gradeLevels.map((g) => (
                        <span key={g} className="bg-gold-50 text-gold-700 px-3 py-1 rounded-full text-sm border border-gold-100">
                          {GRADE_LABELS[g] ?? g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {educator.educatorLessons.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl text-navy-900 mb-3">Ders Programları</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {educator.educatorLessons.map((el) => (
                        <div key={el.id} className="border border-slate-100 rounded-2xl p-4 space-y-1">
                          <p className="font-semibold text-navy-900 text-sm">{el.lessonProgram.name}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{SUBJECT_LABELS[el.lessonProgram.subject]}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{el.lessonProgram.durationMin} dk</span>
                            {el.lessonProgram.maxStudents > 1 && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Grup ({el.lessonProgram.maxStudents})</span>}
                          </div>
                          <p className="font-bold text-gold-600 text-lg">{formatCurrency(el.price.toNumber())}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {educator.reviews.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl text-navy-900 mb-3">
                      Değerlendirmeler ({educator.reviews.length})
                      {avgRating && <span className="text-gold-500 ml-2">★ {avgRating}</span>}
                    </h2>
                    <div className="space-y-4">
                      {educator.reviews.map((r) => (
                        <div key={r.id} className="border border-slate-100 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1,2,3,4,5].map((n) => (
                                <svg key={n} className={`w-4 h-4 ${n <= r.rating ? "text-gold-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-slate-500">{r.student.name}</span>
                          </div>
                          {r.comment && <p className="text-slate-600 text-sm">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {educator.skills.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="font-semibold text-navy-900 mb-3 text-sm uppercase tracking-wide">Yetenekler</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {educator.skills.map((s) => (
                        <span key={s} className="text-xs bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {educator.certificates.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="font-semibold text-navy-900 mb-3 text-sm uppercase tracking-wide">Sertifikalar</h3>
                    <ul className="space-y-2">
                      {educator.certificates.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {educator.linkedinUrl && (
                  <a href={educator.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#0077b5] text-white rounded-2xl p-4 hover:bg-[#006396] transition text-sm font-medium">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profili
                  </a>
                )}

                <div className="bg-gold-500 rounded-2xl p-6 text-center">
                  <p className="font-serif text-white text-xl mb-2">Ders Al</p>
                  <p className="text-white/80 text-sm mb-4">Hemen kayıt olun ve rezervasyon yapın.</p>
                  <Link href="/register"
                    className="block w-full bg-white text-gold-600 py-3 rounded-xl font-bold text-sm hover:bg-gold-50 transition">
                    Ücretsiz Kayıt Ol
                  </Link>
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
