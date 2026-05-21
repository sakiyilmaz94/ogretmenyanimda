import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";
import BookingStatusActions from "@/components/dashboard/BookingStatusActions";

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
          <h1 className="text-2xl font-bold text-navy-900">Rezervasyonlar</h1>
          <p className="text-slate-500 text-sm mt-0.5">Size yapılan tüm ders talepleri</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="font-semibold text-navy-900 mb-2">Henüz rezervasyon yok</h3>
          <p className="text-slate-500 text-sm">Uygunluk takviminizi doldurduktan sonra veliler sizi seçebilecek.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Rezervasyonlar</h1>
        <p className="text-slate-500 text-sm mt-0.5">Size yapılan tüm ders talepleri</p>
      </div>

      {/* Onay Bekleyenler */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-amber-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full inline-block" />
            Onay Bekleyen ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-amber-100 p-5 hover:border-amber-200 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-navy-900">{b.student.name}</span>
                      {b.gradeLevel && (
                        <span className="text-xs bg-navy-50 text-navy-600 px-2 py-0.5 rounded-full border border-navy-100">
                          {GRADE_LABELS[b.gradeLevel] ?? b.gradeLevel}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">· {b.student.parent.user.name}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{SUBJECT_LABELS[b.subject] ?? b.subject}</p>
                    <p className="text-xs text-slate-400">{formatDate(b.slot.date)} · {b.slot.startTime}–{b.slot.endTime}</p>
                    {b.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 rounded-lg px-3 py-1.5">&quot;{b.notes}&quot;</p>
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
          <h2 className="text-base font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
            Ödeme Bekleniyor ({confirmed.length})
          </h2>
          <div className="space-y-3">
            {confirmed.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-blue-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-navy-900">{b.student.name}</span>
                      {b.gradeLevel && (
                        <span className="text-xs bg-navy-50 text-navy-600 px-2 py-0.5 rounded-full border border-navy-100">
                          {GRADE_LABELS[b.gradeLevel] ?? b.gradeLevel}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">· {b.student.parent.user.name}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{SUBJECT_LABELS[b.subject] ?? b.subject}</p>
                    <p className="text-xs text-slate-400">{formatDate(b.slot.date)} · {b.slot.startTime}–{b.slot.endTime}</p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full font-medium">
                    Veli ödemesi bekleniyor…
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Kesinleşenler */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
            Kesinleşti ({completed.length})
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Öğrenci</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Sınıf</th>
                  <th className="text-left px-5 py-3 font-medium">Ders</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Tarih</th>
                  <th className="text-left px-5 py-3 font-medium">Ücret</th>
                  <th className="text-left px-5 py-3 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {completed.map((b) => (
                  <tr key={b.id} className="hover:bg-green-50/30">
                    <td className="px-5 py-3 font-medium text-navy-900">{b.student.name}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs hidden sm:table-cell">
                      {b.gradeLevel ? (GRADE_LABELS[b.gradeLevel] ?? b.gradeLevel) : "—"}
                    </td>
                    <td className="px-5 py-3">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs hidden md:table-cell">{formatDate(b.slot.date)} {b.slot.startTime}</td>
                    <td className="px-5 py-3 font-bold text-green-700">{formatCurrency(b.totalPrice.toNumber())}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Kesinleşti
                      </span>
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
          <h2 className="text-base font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-300 rounded-full inline-block" />
            İptal ({cancelled.length})
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden opacity-70">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-50">
                {cancelled.map((b) => (
                  <tr key={b.id} className="text-slate-400">
                    <td className="px-5 py-3">{b.student.name}</td>
                    <td className="px-5 py-3">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                    <td className="px-5 py-3 text-xs">{formatDate(b.slot.date)}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">İptal</span>
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
