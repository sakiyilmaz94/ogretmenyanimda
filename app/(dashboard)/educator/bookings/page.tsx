import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";
import BookingStatusActions from "@/components/dashboard/BookingStatusActions";
import LessonReportButton from "@/components/dashboard/LessonReportButton";
import AssessmentResultViewer from "@/components/dashboard/AssessmentResultViewer";
import Link from "next/link";

// Her zaman taze veri: tamamlanan seviye testi sonuçları anında görünsün (eski cache servis edilmesin).
export const dynamic = "force-dynamic";

export default async function EducatorBookingsPage() {
  const session = await auth();
  const educator = await db.educator.findUnique({ where: { userId: session!.user.id } });
  if (!educator) return null;

  const bookings = await db.booking.findMany({
    where: { educatorId: educator.id },
    orderBy: { createdAt: "desc" },
    include: {
      student: { include: { parent: { include: { user: true } } } },
      slot: true,
      payment: true,
      lessonReport: true,
      assessment: { include: { responses: true } },
    },
  });

  const pending = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  if (bookings.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-headline-xl text-on-background">Rezervasyonlar</h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">Size yapılan tüm ders talepleri</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-12 text-center soft-card-static">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="font-display text-headline-md text-on-background mb-2">Henüz rezervasyon yok</h3>
          <p className="text-body-md text-on-surface-variant">Uygunluk takviminizi doldurduktan sonra veliler sizi seçebilecek.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Rezervasyonlar</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">Size yapılan tüm ders talepleri</p>
      </div>

      {/* Onay Bekleyenler */}
      {pending.length > 0 && (
        <section>
          <h2 className="font-display text-headline-md text-on-tertiary-fixed mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-on-tertiary-fixed rounded-full inline-block" />
            Onay Bekleyen ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static hover:border-primary/20 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-on-background text-body-lg">{b.student.name}</span>
                      {b.gradeLevel && (
                        <span className="text-caption bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">
                          {GRADE_LABELS[b.gradeLevel] ?? b.gradeLevel}
                        </span>
                      )}
                      <span className="text-caption text-on-surface-variant">· {b.student.parent.user.name}</span>
                    </div>
                    <p className="text-body-md font-medium text-on-background">{SUBJECT_LABELS[b.subject] ?? b.subject}</p>
                    <p className="text-caption text-on-surface-variant">{formatDate(b.slot.date)} · {b.slot.startTime}–{b.slot.endTime}</p>
                    {b.notes && (
                      <p className="text-caption text-on-surface-variant italic bg-surface-container rounded-lg px-3 py-1.5">&quot;{b.notes}&quot;</p>
                    )}
                  </div>
                  <BookingStatusActions bookingId={b.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ödeme Bekleyenler */}
      {confirmed.length > 0 && (
        <section>
          <h2 className="font-display text-headline-md text-primary mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full inline-block" />
            Ödeme Bekleniyor ({confirmed.length})
          </h2>
          <div className="space-y-3">
            {confirmed.map((b) => (
              <div key={b.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-on-background text-body-lg">{b.student.name}</span>
                      {b.gradeLevel && (
                        <span className="text-caption bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">
                          {GRADE_LABELS[b.gradeLevel] ?? b.gradeLevel}
                        </span>
                      )}
                      <span className="text-caption text-on-surface-variant">· {b.student.parent.user.name}</span>
                    </div>
                    <p className="text-body-md font-medium text-on-background">{SUBJECT_LABELS[b.subject] ?? b.subject}</p>
                    <p className="text-caption text-on-surface-variant">{formatDate(b.slot.date)} · {b.slot.startTime}–{b.slot.endTime}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <span className="text-caption bg-primary-fixed text-on-primary-fixed border border-outline-variant/20 px-3 py-1.5 rounded-full font-medium">
                      Veli ödemesi bekleniyor…
                    </span>
                    {b.assessment?.status === "COMPLETED" && b.assessment.responses.length > 0 && (
                      <AssessmentResultViewer assessmentId={b.assessment.id} />
                    )}
                    {b.meetingUrl && (
                      <Link
                        href={b.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-caption bg-[#1a73e8] text-white px-3 py-1.5 rounded-full font-medium hover:bg-[#1558b0] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.4 13c.1-.3.1-.7.1-1s0-.7-.1-1l2.1-1.6c.2-.2.2-.4.1-.6l-2-3.5c-.1-.2-.4-.3-.6-.2l-2.5 1c-.5-.4-1.1-.7-1.7-.9l-.4-2.7c0-.2-.2-.4-.5-.4h-4c-.2 0-.4.2-.5.4l-.4 2.7c-.6.2-1.2.5-1.7.9l-2.5-1c-.2-.1-.5 0-.6.2l-2 3.5c-.1.2-.1.5.1.6L4.6 11c-.1.3-.1.7-.1 1s0 .7.1 1L2.5 14.6c-.2.2-.2.4-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7.9l.4 2.7c.1.2.3.4.5.4h4c.2 0 .4-.2.5-.4l.4-2.7c.6-.2 1.2-.5 1.7-.9l2.5 1c.2.1.5 0 .6-.2l2-3.5c.1-.2.1-.5-.1-.6L19.4 13zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
                        </svg>
                        Google Meet&apos;e Katıl
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Kesinleşenler */}
      {completed.length > 0 && (
        <section>
          <h2 className="font-display text-headline-md text-on-secondary-container mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-on-secondary-container rounded-full inline-block" />
            Kesinleşti ({completed.length})
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden soft-card-static">
            <table className="w-full text-body-md">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Öğrenci</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Sınıf</th>
                  <th className="text-left px-5 py-3 font-medium">Ders</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Tarih</th>
                  <th className="text-left px-5 py-3 font-medium">Ücret</th>
                  <th className="text-left px-5 py-3 font-medium">Durum</th>
                  <th className="text-left px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {completed.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container/50">
                    <td className="px-5 py-3 font-medium text-on-background">{b.student.name}</td>
                    <td className="px-5 py-3 text-on-surface-variant text-caption hidden sm:table-cell">
                      {b.gradeLevel ? (GRADE_LABELS[b.gradeLevel] ?? b.gradeLevel) : "—"}
                    </td>
                    <td className="px-5 py-3 text-on-background">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                    <td className="px-5 py-3 text-on-surface-variant text-caption hidden md:table-cell">{formatDate(b.slot.date)} {b.slot.startTime}</td>
                    <td className="px-5 py-3 font-bold text-on-secondary-container">{formatCurrency(b.totalPrice.toNumber())}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-caption bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Kesinleşti
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {b.meetingUrl && (
                          <Link
                            href={b.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-caption text-primary hover:underline font-medium"
                          >
                            Meet
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                          </Link>
                        )}
                        <LessonReportButton bookingId={b.id} hasReport={!!b.lessonReport} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* İptal Edilenler */}
      {cancelled.length > 0 && (
        <section>
          <h2 className="font-display text-headline-md text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full inline-block" />
            İptal ({cancelled.length})
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden opacity-70 soft-card-static">
            <table className="w-full text-body-md">
              <tbody className="divide-y divide-outline-variant/20">
                {cancelled.map((b) => (
                  <tr key={b.id} className="text-on-surface-variant">
                    <td className="px-5 py-3">{b.student.name}</td>
                    <td className="px-5 py-3">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                    <td className="px-5 py-3 text-caption">{formatDate(b.slot.date)}</td>
                    <td className="px-5 py-3">
                      <span className="text-caption bg-error-container text-on-error-container px-3 py-1 rounded-full font-semibold">İptal</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
