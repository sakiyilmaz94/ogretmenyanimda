import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, SUBJECT_LABELS } from "@/lib/utils";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  PENDING: "Onay Bekleniyor",
  CONFIRMED: "Onaylandı — Ödeme Bekleniyor",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Kesinleştirildi",
};
const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border border-blue-200",
  CANCELLED: "bg-slate-100 text-slate-500 border border-slate-200",
  COMPLETED: "bg-green-100 text-green-700 border border-green-200",
};

export default async function ParentBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; bookingId?: string }>;
}) {
  const session = await auth();
  const { payment } = await searchParams;

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
      {/* Ödeme bildirimi */}
      {payment === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-semibold">Ödeme başarıyla tamamlandı!</p>
            <p className="text-sm text-green-700">Rezervasyonunuz kesinleşti. Öğretmen bilgilendirildi.</p>
          </div>
        </div>
      )}
      {payment === "failed" && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-5 py-4 flex items-center gap-3">
          <span className="text-xl">❌</span>
          <div>
            <p className="font-semibold">Ödeme başarısız oldu.</p>
            <p className="text-sm text-red-700">Lütfen tekrar deneyin veya farklı bir kart kullanın.</p>
          </div>
        </div>
      )}
      {payment === "already_paid" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-5 py-4 flex items-center gap-3">
          <span className="text-xl">ℹ️</span>
          <p className="font-semibold">Bu rezervasyon zaten ödendi.</p>
        </div>
      )}

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
                <th className="text-left px-4 py-3 font-medium">Öğretmen</th>
                <th className="text-left px-4 py-3 font-medium">Ders</th>
                <th className="text-left px-4 py-3 font-medium">Tarih / Saat</th>
                <th className="text-left px-4 py-3 font-medium">Tutar</th>
                <th className="text-left px-4 py-3 font-medium">Durum</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBookings.map((b) => (
                <tr key={b.id} className={`hover:bg-gray-50 ${b.status === "CANCELLED" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 font-medium text-navy-900">{b.studentName}</td>
                  <td className="px-4 py-3 text-slate-700">{b.educator.user.name}</td>
                  <td className="px-4 py-3 text-slate-700">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {formatDate(b.slot.date)} · {b.slot.startTime}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {b.status === "COMPLETED"
                      ? <span className="text-green-700">{formatCurrency(b.totalPrice.toNumber())}</span>
                      : b.status === "CONFIRMED"
                        ? <span className="text-amber-600">{formatCurrency(b.totalPrice.toNumber())}</span>
                        : <span className="text-slate-400 text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "COMPLETED" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Kesinleştirildi
                      </span>
                    ) : (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[b.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {statusLabel[b.status] ?? b.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "CONFIRMED" && b.payment?.status !== "PAID" && (
                      <Link
                        href={`/parent/payments/${b.id}`}
                        className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 font-medium transition"
                      >
                        Ödeme Yap →
                      </Link>
                    )}
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
