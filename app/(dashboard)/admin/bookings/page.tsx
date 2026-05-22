import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
};
const statusColor: Record<string, string> = {
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed",
  CONFIRMED: "bg-secondary-container text-on-secondary-container",
  CANCELLED: "bg-error-container text-on-error-container",
  COMPLETED: "bg-surface-container text-on-surface-variant",
};

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
      educator: { include: { user: true } },
      slot: true,
      payment: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-headline-md text-on-background">Rezervasyon Yönetimi</h1>
          <p className="text-label-md text-on-surface-variant mt-0.5">Platforma ait tüm rezervasyonlar</p>
        </div>
        <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-caption font-semibold">
          {bookings.length} rezervasyon
        </span>
      </div>

      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-hidden border border-outline-variant/20">
        <table className="w-full text-body-md">
          <thead className="bg-surface-container">
            <tr>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğrenci</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğretmen</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Ders</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Tarih</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Ücret</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Ödeme</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-on-surface-variant text-label-md">
                  Henüz rezervasyon bulunmuyor.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-surface-container-low transition">
                  <td className="px-5 py-3.5 font-medium text-on-background">{b.student.name}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{b.educator.user.name}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{formatDate(b.slot.date)} · {b.slot.startTime}</td>
                  <td className="px-5 py-3.5 font-semibold text-on-background">{formatCurrency(b.totalPrice.toNumber())}</td>
                  <td className="px-5 py-3.5">
                    {b.payment ? (
                      <span className={`text-caption px-3 py-1 rounded-full font-semibold ${
                        b.payment.status === "PAID"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-tertiary-fixed text-on-tertiary-fixed"
                      }`}>
                        {b.payment.status === "PAID" ? "Ödendi" : "Beklemede"}
                      </span>
                    ) : (
                      <span className="text-caption text-on-surface-variant">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-caption px-3 py-1 rounded-full font-semibold ${statusColor[b.status] ?? "bg-surface-container text-on-surface-variant"}`}>
                      {statusLabel[b.status] ?? b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
