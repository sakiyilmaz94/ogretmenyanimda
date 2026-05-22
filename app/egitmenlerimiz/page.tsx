import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { SUBJECT_LABELS, GRADE_LABELS, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Öğretmenlerimiz — Öğretmen Yanımda" };

export default async function EgitmenlerimizPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const session = await auth();
  const role = session?.user?.role ?? null;
  const { subject } = await searchParams;

  const educators = await db.educator.findMany({
    where: {
      status: "APPROVED",
      ...(subject ? { subjects: { has: subject as never } } : {}),
    },
    include: {
      user: true,
      educatorLessons: { where: { status: "APPROVED" }, include: { lessonProgram: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const allEducators = educators.filter((e) => e.isProfilePublic);

  return (
    <>
      <PublicNavbar role={role} />
      <main className="pt-16 bg-background">

        {/* Hero */}
        <section className="bg-inverse-surface py-20 text-center relative overflow-hidden">
          <div className="blob-bg bg-primary-fixed w-96 h-96 rounded-full absolute -top-20 -right-20 opacity-10" />
          <div className="blob-bg bg-primary-fixed w-64 h-64 rounded-full absolute -bottom-10 -left-10 opacity-10" />
          <div className="max-w-3xl mx-auto px-4 relative">
            <p className="text-on-primary-fixed font-semibold text-label-md uppercase tracking-widest mb-3">Öğretmenlerimiz</p>
            <h1 className="font-display text-headline-xl text-inverse-on-surface mb-4">Uzman Kadromuzla Tanışın</h1>
            <p className="text-inverse-on-surface/70 text-body-lg">
              Onaylı öğretmenlerimizin tamamı özgeçmiş, diploma ve referans incelemesinden geçmiştir.
            </p>
          </div>
        </section>

        {/* Trust badges */}
        <section className="bg-surface-container-lowest py-10 border-b border-outline-variant">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { label: "Onaylı Öğretmen", count: `${allEducators.length}+` },
                { label: "Ortalama Deneyim", count: "5+ yıl" },
                { label: "Öğrenci Memnuniyeti", count: "%98" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-headline-md font-display font-bold text-on-background">{s.count}</p>
                  <p className="text-label-md text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="bg-surface-container-low py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {subject && (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-body-md text-on-surface-variant">
                  <span className="font-semibold text-on-background">{SUBJECT_LABELS[subject] ?? subject}</span> branşındaki öğretmenler gösteriliyor
                </span>
                <Link
                  href="/egitmenlerimiz"
                  className="text-label-md text-outline hover:text-on-surface-variant underline transition-colors"
                >
                  Filtreyi kaldır
                </Link>
              </div>
            )}
            {allEducators.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-on-primary-fixed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-on-background mb-2">Yakında Burada</h3>
                <p className="text-on-surface-variant text-body-md">Onaylı öğretmenlerimiz çok yakında yayında.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allEducators.map((e) => (
                  <div key={e.id} className="bg-surface-container-lowest rounded-md p-6 soft-card flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary rounded-full w-14 h-14 flex items-center justify-center text-on-primary font-display text-xl shrink-0 overflow-hidden">
                        {e.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={e.photoUrl} alt={e.user.name ?? ""} className="w-full h-full object-cover" />
                        ) : (
                          <span>
                            {(e.user.name ?? "E")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-on-background text-body-md">{e.user.name}</h3>
                        {e.titleName && <p className="text-caption text-on-surface-variant">{e.titleName}</p>}
                        {e.hourlyRate && (
                          <p className="text-on-primary-fixed-variant font-bold text-label-md">{formatCurrency(e.hourlyRate.toNumber())}/saat</p>
                        )}
                      </div>
                    </div>

                    {e.bio && (
                      <p className="text-on-surface-variant text-body-md leading-relaxed line-clamp-2 mb-4">{e.bio}</p>
                    )}

                    {e.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {e.subjects.slice(0, 3).map((s) => (
                          <span key={s} className="bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-0.5 text-caption font-medium">
                            {SUBJECT_LABELS[s] ?? s}
                          </span>
                        ))}
                        {e.subjects.length > 3 && (
                          <span className="text-caption text-outline">+{e.subjects.length - 3}</span>
                        )}
                      </div>
                    )}

                    {e.gradeLevels.length > 0 && (
                      <p className="text-caption text-on-surface-variant mb-3">
                        {e.gradeLevels.map((g) => GRADE_LABELS[g] ?? g).slice(0, 2).join(", ")}
                        {e.gradeLevels.length > 2 && " ..."}
                      </p>
                    )}

                    {e.experience && (
                      <p className="text-caption text-outline mb-3">{e.experience} yıl deneyim</p>
                    )}

                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/egitmenlerimiz/${e.id}`}
                        className="flex-1 text-center rounded-full bg-primary text-on-primary px-5 py-2.5 text-label-md font-semibold squishy-btn cursor-pointer"
                      >
                        Profili Gör
                      </Link>
                      <Link
                        href={role === "PARENT" ? `/parent/book?educatorId=${e.id}` : "/register"}
                        className="flex-1 text-center rounded-full border-2 border-primary text-primary px-5 py-2.5 text-label-md font-semibold hover:bg-primary/5 transition cursor-pointer"
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
        <section className="bg-primary py-16 relative overflow-hidden">
          <div className="blob-bg bg-surface-container-lowest w-80 h-80 rounded-full absolute -top-20 -right-20 opacity-10" />
          <div className="max-w-3xl mx-auto px-4 text-center relative">
            <h2 className="font-display text-headline-lg text-on-primary mb-3">Siz de Öğretmen Olmak İster misiniz?</h2>
            <p className="text-on-primary/80 text-body-lg mb-6">Binlerce öğrenciye ulaşın, kendi programınızı oluşturun.</p>
            <Link href="/egitmen-basvurusu" className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary px-7 py-3.5 rounded-full font-bold text-body-md hover:bg-primary-fixed transition-colors cursor-pointer squishy-btn">
              Öğretmen Başvurusu Yap
            </Link>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
