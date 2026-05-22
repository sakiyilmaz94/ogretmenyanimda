import { db } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      booking: {
        include: {
          student: true,
          educator: { include: { user: true } },
        },
      },
    },
  });

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount.toNumber(), 0);

  const statusLabel: Record<string, string> = {
    PAID: "Ödendi",
    PENDING: "Beklemede",
    FAILED: "Başarısız",
    REFUNDED: "İade Edildi",
  };
  const statusColor: Record<string, string> = {
    PAID: "bg-secondary-container text-on-secondary-container",
    PENDING: "bg-tertiary-fixed text-on-tertiary-fixed",
    FAILED: "bg-error-container text-on-error-container",
    REFUNDED: "bg-surface-container text-on-surface-variant",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-headline-md text-on-background">Ödeme Yönetimi</h1>
          <p className="text-label-md text-on-surface-variant mt-0.5">Tüm platform ödemelerini görüntüleyin</p>
        </div>
        <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-label-md font-semibold">
          Toplam Gelir: {formatCurrency(totalPaid)}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-hidden border border-outline-variant/20">
        <table className="w-full text-body-md">
          <thead className="bg-surface-container">
            <tr>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğrenci</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Öğretmen</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Tutar</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Durum</th>
              <th className="text-left px-5 py-3 text-label-md text-on-surface-variant">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-on-surface-variant text-label-md">
                  Henüz ödeme bulunmuyor.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition">
                  <td className="px-5 py-3.5 text-on-background font-medium">{p.booking.student.name}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{p.booking.educator.user.name}</td>
                  <td className="px-5 py-3.5 font-semibold text-on-background">{formatCurrency(p.amount.toNumber())}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-caption px-3 py-1 rounded-full font-semibold ${statusColor[p.status] ?? "bg-surface-container text-on-surface-variant"}`}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
