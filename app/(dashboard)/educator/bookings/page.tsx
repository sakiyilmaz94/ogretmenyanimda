import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS } from "@/lib/utils";
import BookingStatusActions from "@/components/dashboard/BookingStatusActions";

const statusLabel: Record<string, string> = {
  PENDING: "Beklemede", CONFIRMED: "Onaylandı", CANCELLED: "İptal", COMPLETED: "Tamamlandı",
};
const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

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
  const others = bookings.filter((b) => b.status !== "PENDING");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Rezervasyonlar</h1>
        <p className="text-slate-500 text-sm mt-0.5">Size yapılan tüm ders talepleri</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="font-semibold text-navy-900 mb-2">Henüz rezervasyon yok</h3>
          <p className="text-slate-500 text-sm">Uygunluk takviminizi doldurduktan sonra veliler sizi seçebilecek.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-amber-700 mb-4">Onay Bekleyen ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-amber-100 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-navy-900">{b.student.name}</span>
                          <span className="text-xs text-slate-400">· {b.student.parent.user.name}</span>
                        </div>
                        <p className="text-sm text-slate-600">{SUBJECT_LABELS[b.subject] ?? b.subject}</p>
                        <p className="text-xs text-slate-400">{formatDate(b.slot.date)} · {b.slot.startTime}–{b.slot.endTime}</p>
                        {b.notes && <p className="text-xs text-slate-500 italic">&quot;{b.notes}&quot;</p>}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-navy-900">{formatCurrency(b.totalPrice.toNumber())}</p>
                        <BookingStatusActions bookingId={b.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-navy-900 mb-4">Diğer Rezervasyonlar ({others.length})</h2>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium">Öğrenci</th>
                      <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Veli</th>
                      <th className="text-left px-5 py-3 font-medium">Ders</th>
                      <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Tarih</th>
                      <th className="text-left px-5 py-3 font-medium">Ücret</th>
                      <th className="text-left px-5 py-3 font-medium">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {others.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-navy-900">{b.student.name}</td>
                        <td className="px-5 py-3 text-slate-500 hidden sm:table-cell">{b.student.parent.user.name}</td>
                        <td className="px-5 py-3">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                        <td className="px-5 py-3 text-slate-400 text-xs hidden md:table-cell">{formatDate(b.slot.date)} {b.slot.startTime}</td>
                        <td className="px-5 py-3 font-semibold text-gold-600">{formatCurrency(b.totalPrice.toNumber())}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[b.status] ?? "bg-slate-100 text-slate-600"}`}>
                            {statusLabel[b.status] ?? b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
