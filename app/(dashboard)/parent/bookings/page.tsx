import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS } from "@/lib/utils";
import Link from "next/link";

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

export default async function ParentBookingsPage() {
  const session = await auth();

  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: {
      students: {
        include: {
          bookings: {
            orderBy: { createdAt: "desc" },
            include: {
              educator: { include: { user: true } },
              slot: true,
              payment: true,
            },
          },
        },
      },
    },
  });

  if (!parent) return null;

  const allBookings = parent.students.flatMap((s) =>
    s.bookings.map((b) => ({ ...b, studentName: s.name }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlarım</h1>
          <p className="text-gray-500">Tüm ders rezervasyonlarınız</p>
        </div>
        <Link
          href="/parent/book"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Yeni Rezervasyon
        </Link>
      </div>

      {allBookings.length === 0 ? (
        <div className="bg-blue-50 rounded-xl p-10 text-center">
          <p className="text-3xl mb-3">📋</p>
          <h3 className="font-semibold text-gray-900 mb-2">Henüz rezervasyon yok</h3>
          <p className="text-gray-500 text-sm mb-4">İlk dersi hemen rezerve edin!</p>
          <Link
            href="/parent/book"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Ders Al
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Öğrenci</th>
                <th className="text-left px-4 py-3 font-medium">Eğitmen</th>
                <th className="text-left px-4 py-3 font-medium">Ders</th>
                <th className="text-left px-4 py-3 font-medium">Tarih / Saat</th>
                <th className="text-left px-4 py-3 font-medium">Tutar</th>
                <th className="text-left px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.studentName}</td>
                  <td className="px-4 py-3">{b.educator.user.name}</td>
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
