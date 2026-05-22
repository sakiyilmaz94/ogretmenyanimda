import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate, SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";
import EducatorDetailActions from "@/components/dashboard/EducatorDetailActions";

const statusLabel: Record<string, string> = {
  PENDING: "Beklemede", CONFIRMED: "Onaylandı", CANCELLED: "İptal", COMPLETED: "Tamamlandı",
};
const statusColor: Record<string, string> = {
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed",
  CONFIRMED: "bg-secondary-container text-on-secondary-container",
  CANCELLED: "bg-error-container text-on-error-container",
  COMPLETED: "bg-surface-container text-on-surface-variant",
};

export default async function AdminEducatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const educator = await db.educator.findUnique({
    where: { id },
    include: {
      user: true,
      bookings: {
        orderBy: { createdAt: "desc" },
        include: { student: true, slot: true, payment: true },
      },
      educatorLessons: { include: { lessonProgram: true } },
    },
  });

  if (!educator) notFound();

  const confirmedBookings = educator.bookings.filter((b) => ["CONFIRMED", "COMPLETED"].includes(b.status));
  const totalEarnings = confirmedBookings.reduce((s, b) => s + b.totalPrice.toNumber(), 0);
  const paidAmount = educator.bookings.reduce((s, b) => b.payment ? s + b.payment.amount.toNumber() : s, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/educators" className="p-2 hover:bg-surface-container rounded-lg transition border border-outline-variant/20">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display text-headline-md text-on-background">{educator.user.name}</h1>
          <p className="text-label-md text-on-surface-variant">{educator.user.email}</p>
        </div>
      </div>

      {/* Profile + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 lg:col-span-2 space-y-4 soft-card-static">
          <h2 className="font-display text-headline-md text-on-background">Profil Bilgileri</h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            <div><p className="text-caption text-on-surface-variant">Telefon</p><p className="text-body-md font-medium text-on-background">{educator.phone ?? "—"}</p></div>
            <div><p className="text-caption text-on-surface-variant">Saatlik Ücret</p><p className="text-body-md font-medium text-on-background">{formatCurrency(educator.hourlyRate.toNumber())}</p></div>
            <div><p className="text-caption text-on-surface-variant">Unvan</p><p className="text-body-md font-medium text-on-background">{educator.titleName ?? "—"}</p></div>
            <div><p className="text-caption text-on-surface-variant">Deneyim</p><p className="text-body-md font-medium text-on-background">{educator.experience ? `${educator.experience} yıl` : "—"}</p></div>
            <div>
              <p className="text-caption text-on-surface-variant">Durum</p>
              <span className={`text-caption font-semibold px-3 py-1 rounded-full ${
                educator.status === "APPROVED"
                  ? "bg-secondary-container text-on-secondary-container"
                  : educator.status === "PENDING"
                  ? "bg-tertiary-fixed text-on-tertiary-fixed"
                  : "bg-error-container text-on-error-container"
              }`}>
                {educator.status === "APPROVED" ? "Onaylı" : educator.status === "PENDING" ? "Beklemede" : "Reddedildi"}
              </span>
            </div>
            <div><p className="text-caption text-on-surface-variant">Kayıt Tarihi</p><p className="text-body-md font-medium text-on-background">{new Date(educator.createdAt).toLocaleDateString("tr-TR")}</p></div>
          </div>
          {educator.bio && (
            <div><p className="text-caption text-on-surface-variant mb-1">Hakkında</p><p className="text-body-md text-on-surface-variant leading-relaxed">{educator.bio}</p></div>
          )}
          {educator.subjects.length > 0 && (
            <div>
              <p className="text-caption text-on-surface-variant mb-1.5">Ders Konuları</p>
              <div className="flex flex-wrap gap-1.5">
                {educator.subjects.map((s) => <span key={s} className="text-caption bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-medium">{SUBJECT_LABELS[s]}</span>)}
              </div>
            </div>
          )}
          {educator.gradeLevels.length > 0 && (
            <div>
              <p className="text-caption text-on-surface-variant mb-1.5">Sınıf Seviyeleri</p>
              <div className="flex flex-wrap gap-1.5">
                {educator.gradeLevels.map((g) => <span key={g} className="text-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">{GRADE_LABELS[g]}</span>)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {[
            { label: "Toplam Rezervasyon", value: educator.bookings.length.toString() },
            { label: "Onaylı Ders", value: confirmedBookings.length.toString() },
            { label: "Toplam Kazanç", value: formatCurrency(totalEarnings) },
            { label: "Tahsil Edilen", value: formatCurrency(paidAmount) },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-4 soft-card-static">
              <p className="text-caption text-on-surface-variant mb-1">{s.label}</p>
              <p className="font-display text-headline-md text-on-background">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
        <h2 className="font-display text-headline-md text-on-background mb-4">Kimlik Doğrulama Belgeleri</h2>
        {!educator.diplomaUrl && !educator.idCardUrl ? (
          <div className="bg-tertiary-fixed/40 border border-outline-variant/20 rounded-lg p-4">
            <p className="text-body-md text-on-tertiary-fixed font-medium">Bu başvuruda belge yüklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Diploma PDF */}
            <div>
              <p className="text-caption font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Diploma / Sertifika</p>
              {educator.diplomaUrl ? (
                <div className="border border-outline-variant/20 rounded-xl overflow-hidden">
                  <iframe
                    src={educator.diplomaUrl}
                    className="w-full h-64"
                    title="Diploma"
                  />
                  <div className="p-3 bg-surface-container-low border-t border-outline-variant/20">
                    <a
                      href={educator.diplomaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-md text-primary hover:underline font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Yeni sekmede aç
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-body-md text-on-surface-variant italic">Yüklenmemiş</p>
              )}
            </div>

            {/* ID Card */}
            <div>
              <p className="text-caption font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Kimlik Belgesi</p>
              {educator.idCardUrl ? (
                <div className="border border-outline-variant/20 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={educator.idCardUrl}
                    alt="Kimlik belgesi"
                    className="w-full h-64 object-contain bg-surface-container-low"
                  />
                  <div className="p-3 bg-surface-container-low border-t border-outline-variant/20">
                    <a
                      href={educator.idCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-md text-primary hover:underline font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Yeni sekmede aç
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-body-md text-on-surface-variant italic">Yüklenmemiş</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Approve/Reject actions — only for PENDING */}
      {educator.status === "PENDING" && (
        <EducatorDetailActions educatorId={educator.id} />
      )}

      {/* Rejection note if rejected */}
      {educator.status === "REJECTED" && educator.rejectionNote && (
        <div className="bg-error-container border border-outline-variant/20 rounded-md p-5">
          <p className="text-label-md font-semibold text-on-error-container mb-1">Red Notu</p>
          <p className="text-body-md text-on-error-container">{educator.rejectionNote}</p>
        </div>
      )}

      {/* Educator Lessons */}
      {educator.educatorLessons.length > 0 && (
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
          <h2 className="font-display text-headline-md text-on-background mb-4">Ders Programları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {educator.educatorLessons.map((el) => (
              <div key={el.id} className="border border-outline-variant/20 rounded-xl p-4 space-y-1 bg-surface-container-low">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-on-background text-body-md">{el.lessonProgram.name}</p>
                  <span className={`text-caption px-2 py-0.5 rounded-full font-semibold ${
                    el.status === "APPROVED"
                      ? "bg-secondary-container text-on-secondary-container"
                      : el.status === "PENDING_APPROVAL"
                      ? "bg-tertiary-fixed text-on-tertiary-fixed"
                      : "bg-error-container text-on-error-container"
                  }`}>
                    {el.status === "APPROVED" ? "Onaylı" : el.status === "PENDING_APPROVAL" ? "Beklemede" : "Reddedildi"}
                  </span>
                </div>
                <p className="text-primary font-bold text-body-md">{formatCurrency(el.price.toNumber())}</p>
                <p className="text-caption text-on-surface-variant">{SUBJECT_LABELS[el.lessonProgram.subject]} · {GRADE_LABELS[el.lessonProgram.gradeLevel]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings table */}
      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-hidden border border-outline-variant/20">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h2 className="font-display text-headline-md text-on-background">Rezervasyonlar ({educator.bookings.length})</h2>
        </div>
        {educator.bookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-label-md text-on-surface-variant">Henüz rezervasyon yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-md">
              <thead className="bg-surface-container">
                <tr>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğrenci</th>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Konu</th>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Tarih</th>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Ücret</th>
                  <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {educator.bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low transition">
                    <td className="px-5 py-3.5 font-medium text-on-background">{b.student.name}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{formatDate(b.slot.date)} {b.slot.startTime}</td>
                    <td className="px-5 py-3.5 font-bold text-primary">{formatCurrency(b.totalPrice.toNumber())}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-caption px-3 py-1 rounded-full font-semibold ${statusColor[b.status] ?? "bg-surface-container text-on-surface-variant"}`}>
                        {statusLabel[b.status] ?? b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
