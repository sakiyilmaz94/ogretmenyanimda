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
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ödeme Yönetimi</h1>
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
          Toplam Gelir: {formatCurrency(totalPaid)}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Öğrenci</th>
              <th className="text-left px-4 py-3 font-medium">Eğitmen</th>
              <th className="text-left px-4 py-3 font-medium">Tutar</th>
              <th className="text-left px-4 py-3 font-medium">Durum</th>
              <th className="text-left px-4 py-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Henüz ödeme bulunmuyor.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.booking.student.name}</td>
                  <td className="px-4 py-3">{p.booking.educator.user.name}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(p.amount.toNumber())}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
