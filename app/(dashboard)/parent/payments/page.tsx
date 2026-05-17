import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDateTime, SUBJECT_LABELS } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PAID: "Ödendi",
  PENDING: "Beklemede",
  FAILED: "Başarısız",
  REFUNDED: "İade Edildi",
};
const statusColor: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
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
          <h1 className="text-2xl font-bold text-gray-900">Ödemelerim</h1>
          <p className="text-gray-500">Tüm ödeme geçmişiniz</p>
        </div>
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
          Toplam: {formatCurrency(totalPaid)}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center">
          <p className="text-3xl mb-3">💳</p>
          <p className="text-gray-500">Henüz ödeme geçmişiniz bulunmuyor.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Öğrenci</th>
                <th className="text-left px-4 py-3 font-medium">Eğitmen</th>
                <th className="text-left px-4 py-3 font-medium">Ders</th>
                <th className="text-left px-4 py-3 font-medium">Tutar</th>
                <th className="text-left px-4 py-3 font-medium">Taksit</th>
                <th className="text-left px-4 py-3 font-medium">Durum</th>
                <th className="text-left px-4 py-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.booking.student.name}</td>
                  <td className="px-4 py-3">{p.booking.educator.user.name}</td>
                  <td className="px-4 py-3">{SUBJECT_LABELS[p.booking.subject] ?? p.booking.subject}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(p.amount.toNumber())}</td>
                  <td className="px-4 py-3">{p.installment}x</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
