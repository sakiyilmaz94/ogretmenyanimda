import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate, SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PENDING: "Beklemede", CONFIRMED: "Onaylandı", CANCELLED: "İptal", COMPLETED: "Tamamlandı",
};
const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700", COMPLETED: "bg-blue-100 text-blue-700",
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
        <Link href="/admin/educators" className="p-2 hover:bg-slate-100 rounded-lg transition">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{educator.user.name}</h1>
          <p className="text-slate-500 text-sm">{educator.user.email}</p>
        </div>
      </div>

      {/* Profile + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-navy-900">Profil Bilgileri</h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div><p className="text-slate-400 text-xs">Telefon</p><p className="font-medium text-navy-900">{educator.phone ?? "—"}</p></div>
            <div><p className="text-slate-400 text-xs">Saatlik Ücret</p><p className="font-medium text-navy-900">{formatCurrency(educator.hourlyRate.toNumber())}</p></div>
            <div><p className="text-slate-400 text-xs">Unvan</p><p className="font-medium text-navy-900">{educator.titleName ?? "—"}</p></div>
            <div><p className="text-slate-400 text-xs">Deneyim</p><p className="font-medium text-navy-900">{educator.experience ? `${educator.experience} yıl` : "—"}</p></div>
            <div><p className="text-slate-400 text-xs">Durum</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${educator.status === "APPROVED" ? "bg-green-100 text-green-700" : educator.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                {educator.status === "APPROVED" ? "Onaylı" : educator.status === "PENDING" ? "Beklemede" : "Reddedildi"}
              </span>
            </div>
            <div><p className="text-slate-400 text-xs">Kayıt Tarihi</p><p className="font-medium text-navy-900">{new Date(educator.createdAt).toLocaleDateString("tr-TR")}</p></div>
          </div>
          {educator.bio && (
            <div><p className="text-slate-400 text-xs mb-1">Hakkında</p><p className="text-sm text-slate-600 leading-relaxed">{educator.bio}</p></div>
          )}
          {educator.subjects.length > 0 && (
            <div>
              <p className="text-slate-400 text-xs mb-1.5">Ders Konuları</p>
              <div className="flex flex-wrap gap-1.5">
                {educator.subjects.map((s) => <span key={s} className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{SUBJECT_LABELS[s]}</span>)}
              </div>
            </div>
          )}
          {educator.gradeLevels.length > 0 && (
            <div>
              <p className="text-slate-400 text-xs mb-1.5">Sınıf Seviyeleri</p>
              <div className="flex flex-wrap gap-1.5">
                {educator.gradeLevels.map((g) => <span key={g} className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">{GRADE_LABELS[g]}</span>)}
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
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-navy-900">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Educator Lessons */}
      {educator.educatorLessons.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Ders Programları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {educator.educatorLessons.map((el) => (
              <div key={el.id} className="border border-slate-100 rounded-xl p-4 space-y-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-navy-900 text-sm">{el.lessonProgram.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${el.status === "APPROVED" ? "bg-green-100 text-green-700" : el.status === "PENDING_APPROVAL" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {el.status === "APPROVED" ? "Onaylı" : el.status === "PENDING_APPROVAL" ? "Beklemede" : "Reddedildi"}
                  </span>
                </div>
                <p className="text-gold-600 font-bold text-sm">{formatCurrency(el.price.toNumber())}</p>
                <p className="text-xs text-slate-400">{SUBJECT_LABELS[el.lessonProgram.subject]} · {GRADE_LABELS[el.lessonProgram.gradeLevel]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-navy-900 mb-4">Rezervasyonlar ({educator.bookings.length})</h2>
        {educator.bookings.length === 0 ? (
          <p className="text-slate-400 text-sm">Henüz rezervasyon yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="text-left py-2 pr-4 font-medium">Öğrenci</th>
                  <th className="text-left py-2 pr-4 font-medium">Konu</th>
                  <th className="text-left py-2 pr-4 font-medium">Tarih</th>
                  <th className="text-left py-2 pr-4 font-medium">Ücret</th>
                  <th className="text-left py-2 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {educator.bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-4 font-medium text-navy-900">{b.student.name}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                    <td className="py-2.5 pr-4 text-slate-400">{formatDate(b.slot.date)} {b.slot.startTime}</td>
                    <td className="py-2.5 pr-4 font-bold text-gold-600">{formatCurrency(b.totalPrice.toNumber())}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[b.status] ?? "bg-slate-100 text-slate-600"}`}>
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
