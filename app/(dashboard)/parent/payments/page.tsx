import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDateTime, SUBJECT_LABELS } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PAID: "Ödendi",
  PENDING: "Beklemede",
  FAILED: "Başarısız",
  REFUNDED: "İade Edildi",
};

const statusBadge: Record<string, string> = {
  PAID: "bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-caption font-semibold",
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-caption font-semibold",
  FAILED: "bg-error-container text-on-error-container px-3 py-1 rounded-full text-caption font-semibold",
  REFUNDED: "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-semibold",
};

export default async function ParentPaymentsPage() {
  const session = await auth();

  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
  });
  if (!parent) return null;

  const payments = await db.payment.findMany({
    where: { booking: { student: { parentId: parent.id } } },
    orderBy: { createdAt: "desc" },
    include: {
      booking: {
        include: {
          student: true,
          educator: { include: { user: true } },
          slot: true,
        },
      },
    },
  });

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount.toNumber(), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-background">Ödemelerim</h1>
          <p className="text-body-md text-on-surface-variant">Tüm ödeme geçmişiniz</p>
        </div>
        <div className="bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-full text-label-md font-semibold">
          Toplam: {formatCurrency(totalPaid)}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-surface-container rounded-md p-10 text-center soft-card-static">
          <p className="text-3xl mb-3">💳</p>
          <p className="text-body-md text-on-surface-variant">Henüz ödeme geçmişiniz bulunmuyor.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-body-md">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğrenci</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğretmen</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Ders</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tutar</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Taksit</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Durum</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition">
                  <td className="px-4 py-3 text-on-background">{p.booking.student.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.booking.educator.user.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{SUBJECT_LABELS[p.booking.subject] ?? p.booking.subject}</td>
                  <td className="px-4 py-3 font-semibold text-on-background">{formatCurrency(p.amount.toNumber())}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.installment}x</td>
                  <td className="px-4 py-3">
                    <span className={statusBadge[p.status] ?? "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-semibold"}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant text-caption">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
