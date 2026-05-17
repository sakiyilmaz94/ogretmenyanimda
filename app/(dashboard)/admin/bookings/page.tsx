import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
};
const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yönetimi</h1>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
          {bookings.length} rezervasyon
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Öğrenci</th>
              <th className="text-left px-4 py-3 font-medium">Eğitmen</th>
              <th className="text-left px-4 py-3 font-medium">Ders</th>
              <th className="text-left px-4 py-3 font-medium">Tarih</th>
              <th className="text-left px-4 py-3 font-medium">Ücret</th>
              <th className="text-left px-4 py-3 font-medium">Ödeme</th>
              <th className="text-left px-4 py-3 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  Henüz rezervasyon bulunmuyor.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.student.name}</td>
                  <td className="px-4 py-3">{b.educator.user.name}</td>
                  <td className="px-4 py-3">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(b.slot.date)} · {b.slot.startTime}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(b.totalPrice.toNumber())}</td>
                  <td className="px-4 py-3">
                    {b.payment ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        b.payment.status === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {b.payment.status === "PAID" ? "Ödendi" : "Beklemede"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[b.status] ?? "bg-gray-100 text-gray-700"}`}>
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
