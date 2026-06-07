import { db } from "@/lib/db";
import { auth } from "@/auth";
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
  const session = await auth();
  const role = session?.user?.role ?? null;

  const educator = await db.educator.findUnique({
    where: { id, status: "APPROVED" },
    include: {
      user: true,
      educatorLessons: { where: { status: "APPROVED" }, include: { lessonProgram: true } },
      reviews: { where: { isPublic: true }, include: { student: true }, orderBy: { createdAt: "desc" }, take: 10 },
      resources: { where: { isFree: true }, orderBy: { createdAt: "desc" } },
    },
  });

  // Gelecekteki müsait slotlar (30 gün)
  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + 30);
  const availableSlots = educator ? await db.availabilitySlot.findMany({
    where: { educatorId: educator.id, isBooked: false, date: { gte: now, lte: future } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    take: 50,
  }) : [];

  const slotsByDate = availableSlots.reduce<Record<string, typeof availableSlots>>((acc, s) => {
    const key = s.date.toISOString().split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  if (!educator) notFound();

  const avgRating = educator.reviews.length > 0
    ? (educator.reviews.reduce((s, r) => s + r.rating, 0) / educator.reviews.length).toFixed(1)
    : null;

  return (
    <>
      <PublicNavbar role={role} />
      <main className="pt-16 bg-background">

        {/* Hero */}
        <section className="bg-inverse-surface py-16 relative overflow-hidden">
          <div className="blob-bg bg-primary-fixed w-96 h-96 rounded-full absolute -top-20 -right-20 opacity-30" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="bg-primary rounded-full w-24 h-24 flex items-center justify-center text-on-primary font-display text-4xl shrink-0 overflow-hidden">
                {educator.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={educator.photoUrl} alt={educator.user.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <span>
                    {(educator.user.name ?? "E")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-primary text-label-md font-semibold uppercase tracking-widest mb-1">
                  {educator.titleName ?? "Öğretmen"}
                </p>
                <h1 className="font-display text-headline-lg text-on-background mb-2">{educator.user.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-body-md">
                  {educator.experience && <span>{educator.experience} yıl deneyim</span>}
                  {avgRating && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-on-tertiary-fixed" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {avgRating} ({educator.reviews.length} değerlendirme)
                    </span>
                  )}
                  {educator.hourlyRate && (
                    <span className="text-primary font-bold">{formatCurrency(educator.hourlyRate.toNumber())} / saat</span>
                  )}
                </div>
              </div>
              {role === "PARENT" ? (
                <Link
                  href={`/parent/book?educatorId=${educator.id}`}
                  className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 font-semibold text-body-md shrink-0"
                >
                  Randevu Al
                </Link>
              ) : role ? null : (
                <Link
                  href={`/register`}
                  className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 font-semibold text-body-md shrink-0"
                >
                  Randevu Al
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left */}
              <div className="lg:col-span-2 space-y-8">
                {educator.bio && (
                  <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static">
                    <h2 className="font-display text-headline-md text-on-background mb-3">Hakkında</h2>
                    <p className="text-on-surface-variant text-body-md leading-relaxed">{educator.bio}</p>
                  </div>
                )}

                {educator.subjects.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static">
                    <h2 className="font-display text-headline-md text-on-background mb-3">Ders Konuları</h2>
                    <div className="flex flex-wrap gap-2">
                      {educator.subjects.map((s) => (
                        <span key={s} className="bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-1 text-label-md font-medium">
                          {SUBJECT_LABELS[s] ?? s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {educator.gradeLevels.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static">
                    <h2 className="font-display text-headline-md text-on-background mb-3">Sınıf Seviyeleri</h2>
                    <div className="flex flex-wrap gap-2">
                      {educator.gradeLevels.map((g) => (
                        <span key={g} className="bg-surface-container text-on-surface-variant rounded-full px-3 py-1 text-label-md font-medium">
                          {GRADE_LABELS[g] ?? g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {educator.educatorLessons.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static">
                    <h2 className="font-display text-headline-md text-on-background mb-3">Ders Programları</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {educator.educatorLessons.map((el) => (
                        <div key={el.id} className="bg-surface-container rounded-md p-4 space-y-1">
                          <p className="font-semibold text-on-background text-body-md">{el.lessonProgram.name}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-0.5 text-caption font-medium">{SUBJECT_LABELS[el.lessonProgram.subject]}</span>
                            <span className="bg-surface-container-low text-on-surface-variant rounded-full px-3 py-0.5 text-caption font-medium">{el.lessonProgram.durationMin} dk</span>
                            {el.lessonProgram.maxStudents > 1 && <span className="bg-surface-container-low text-on-surface-variant rounded-full px-3 py-0.5 text-caption font-medium">Grup ({el.lessonProgram.maxStudents})</span>}
                          </div>
                          <p className="font-bold text-on-primary-fixed-variant text-body-lg">{formatCurrency(el.price.toNumber())}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Müsait Takvim */}
                {Object.keys(slotsByDate).length > 0 && (
                  <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static">
                    <h2 className="font-display text-headline-md text-on-background mb-3">Müsait Günler</h2>
                    <div className="space-y-3">
                      {Object.entries(slotsByDate).slice(0, 7).map(([date, slots]) => (
                        <div key={date} className="flex items-start gap-4 bg-surface-container-low rounded-md p-4">
                          <div className="text-center shrink-0 w-14">
                            <p className="text-caption text-outline uppercase">
                              {new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "short" })}
                            </p>
                            <p className="text-headline-md font-display font-bold text-on-background leading-none">
                              {new Date(date + "T12:00:00").getDate()}
                            </p>
                            <p className="text-caption text-outline">
                              {new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { month: "short" })}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {slots.map((s) => (
                              <span key={s.id} className="text-caption bg-surface-container-lowest border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-full font-medium">
                                {s.startTime}–{s.endTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {role === "PARENT" && (
                      <div className="mt-4">
                        <Link href={`/parent/book?educatorId=${educator.id}`}
                          className="inline-flex items-center gap-2 rounded-full squishy-btn bg-primary text-on-primary px-5 py-2.5 text-label-md font-semibold">
                          Bu saatlerden birini seç →
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {educator.reviews.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static">
                    <h2 className="font-display text-headline-md text-on-background mb-3">
                      Değerlendirmeler ({educator.reviews.length})
                      {avgRating && <span className="text-secondary-container ml-2">★ {avgRating}</span>}
                    </h2>
                    <div className="space-y-4">
                      {educator.reviews.map((r) => (
                        <div key={r.id} className="bg-surface-container-low rounded-md p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1,2,3,4,5].map((n) => (
                                <svg key={n} className={`w-4 h-4 ${n <= r.rating ? "text-on-primary-fixed" : "text-outline-variant"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-label-md text-on-surface-variant">{r.student.name}</span>
                          </div>
                          {r.comment && <p className="text-on-surface-variant text-body-md">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {educator.skills.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-md p-5 soft-card-static">
                    <h3 className="font-display font-semibold text-on-background mb-3 text-label-md uppercase tracking-wide">Yetenekler</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {educator.skills.map((s) => (
                        <span key={s} className="text-caption bg-surface-container text-on-surface-variant border border-outline-variant px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {educator.certificates.length > 0 && (
                  <div className="bg-surface-container-lowest rounded-md p-5 soft-card-static">
                    <h3 className="font-display font-semibold text-on-background mb-3 text-label-md uppercase tracking-wide">Sertifikalar</h3>
                    <ul className="space-y-2">
                      {educator.certificates.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                          <svg className="w-4 h-4 text-on-secondary-container mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="flex items-center gap-2 bg-[#0077b5] text-white rounded-md p-4 hover:bg-[#006396] transition text-body-md font-medium">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profili
                  </a>
                )}

                <div className="bg-primary rounded-md p-6 text-center relative overflow-hidden">
                  <div className="blob-bg bg-surface-container-lowest w-32 h-32 rounded-full absolute -top-8 -right-8 opacity-10" />
                  <p className="font-display text-inverse-on-surface text-headline-md mb-2">Ders Al</p>
                  {role === "PARENT" ? (
                    <>
                      <p className="text-on-primary/80 text-body-md mb-4">Bu öğretmenle hemen randevu alın.</p>
                      <Link href={`/parent/book?educatorId=${educator.id}`}
                        className="block w-full bg-surface-container-lowest text-primary py-3 rounded-full font-bold text-label-md hover:bg-primary-fixed transition">
                        Randevu Al
                      </Link>
                    </>
                  ) : role ? (
                    <p className="text-on-primary/80 text-body-md">Ders almak için veli hesabı gereklidir.</p>
                  ) : (
                    <>
                      <p className="text-on-primary/80 text-body-md mb-4">Hemen kayıt olun ve rezervasyon yapın.</p>
                      <Link href="/register"
                        className="block w-full bg-surface-container-lowest text-primary py-3 rounded-full font-bold text-label-md hover:bg-primary-fixed transition">
                        Ücretsiz Kayıt Ol
                      </Link>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Ücretsiz Kaynaklar */}
        {educator.resources.length > 0 && (
          <section className="bg-surface-container-low py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <p className="text-primary font-semibold text-label-md uppercase tracking-widest mb-1">Ücretsiz Kaynaklar</p>
                <h2 className="font-display text-headline-md text-on-background">
                  {educator.user.name} tarafından paylaşıldı
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {educator.resources.map((r) => (
                  <a
                    key={r.id}
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-container-lowest rounded-md p-5 soft-card flex items-start gap-4 group hover:bg-primary-fixed/30 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-fixed text-primary rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-on-background text-body-md truncate group-hover:text-primary transition-colors">{r.title}</p>
                      {r.description && <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-2">{r.description}</p>}
                      <p className="text-caption text-secondary mt-1.5 font-medium">PDF · Ücretsiz İndir ↓</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <PublicFooter />
    </>
  );
}
