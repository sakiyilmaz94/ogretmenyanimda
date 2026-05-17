import { auth } from "@/auth";
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

export default async function EducatorBookingsPage() {
  const session = await auth();
  const educator = await db.educator.findUnique({
    where: { userId: session!.user.id },
  });
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlarım</h1>
        <p className="text-gray-500">Size yapılan tüm ders rezervasyonları</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-gray-500">Henüz rezervasyon bulunmuyor.</p>
          <p className="text-sm text-gray-400 mt-1">
            Uygunluk takviminizi doldurduktan sonra veliler sizi seçebilecek.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Öğrenci</th>
                <th className="text-left px-4 py-3 font-medium">Veli</th>
                <th className="text-left px-4 py-3 font-medium">Ders</th>
                <th className="text-left px-4 py-3 font-medium">Tarih / Saat</th>
                <th className="text-left px-4 py-3 font-medium">Ücret</th>
                <th className="text-left px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.student.name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.student.parent.user.name}</td>
                  <td className="px-4 py-3">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(b.slot.date)} · {b.slot.startTime}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(b.totalPrice.toNumber())}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[b.status] ?? "bg-gray-100 text-gray-700"}`}>
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
  );
}
