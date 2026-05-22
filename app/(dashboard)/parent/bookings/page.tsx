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

const statusBadge: Record<string, string> = {
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-caption font-semibold",
  CONFIRMED: "bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-caption font-semibold",
  CANCELLED: "bg-error-container text-on-error-container px-3 py-1 rounded-full text-caption font-semibold",
  COMPLETED: "bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-caption font-semibold",
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
        <div className="bg-secondary-container border border-on-secondary-container/20 text-on-secondary-container rounded-md px-5 py-4 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-display font-semibold">Ödeme başarıyla tamamlandı!</p>
            <p className="text-body-md text-on-secondary-container/80">Rezervasyonunuz kesinleşti. Öğretmen bilgilendirildi.</p>
          </div>
        </div>
      )}
      {payment === "failed" && (
        <div className="bg-error-container border border-on-error-container/20 text-on-error-container rounded-md px-5 py-4 flex items-center gap-3">
          <span className="text-xl">❌</span>
          <div>
            <p className="font-display font-semibold">Ödeme başarısız oldu.</p>
            <p className="text-body-md text-on-error-container/80">Lütfen tekrar deneyin veya farklı bir kart kullanın.</p>
          </div>
        </div>
      )}
      {payment === "already_paid" && (
        <div className="bg-primary-fixed border border-primary/20 text-on-primary-fixed rounded-md px-5 py-4 flex items-center gap-3">
          <span className="text-xl">ℹ️</span>
          <p className="font-display font-semibold">Bu rezervasyon zaten ödendi.</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-background">Rezervasyonlarım</h1>
          <p className="text-body-md text-on-surface-variant">Tüm ders rezervasyonlarınız</p>
        </div>
        <Link
          href="/parent/book"
          className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold"
        >
          + Yeni Rezervasyon
        </Link>
      </div>

      {allBookings.length === 0 ? (
        <div className="bg-surface-container rounded-md p-10 text-center soft-card-static">
          <p className="text-3xl mb-3">📋</p>
          <h3 className="font-display font-semibold text-on-background mb-2">Henüz rezervasyon yok</h3>
          <p className="text-body-md text-on-surface-variant mb-4">İlk dersi hemen rezerve edin!</p>
          <Link
            href="/parent/book"
            className="inline-block rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold"
          >
            Ders Al
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-body-md">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğrenci</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğretmen</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Ders</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tarih / Saat</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tutar</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Durum</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {allBookings.map((b) => (
                <tr key={b.id} className={`hover:bg-surface-container-low transition ${b.status === "CANCELLED" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-on-background">{b.studentName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.educator.user.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                  <td className="px-4 py-3 text-on-surface-variant text-caption">
                    {formatDate(b.slot.date)} · {b.slot.startTime}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {b.status === "COMPLETED"
                      ? <span className="text-on-secondary-container">{formatCurrency(b.totalPrice.toNumber())}</span>
                      : b.status === "CONFIRMED"
                        ? <span className="text-on-tertiary-fixed">{formatCurrency(b.totalPrice.toNumber())}</span>
                        : <span className="text-on-surface-variant text-caption">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "COMPLETED" ? (
                      <span className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-caption font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Kesinleştirildi
                      </span>
                    ) : (
                      <span className={statusBadge[b.status] ?? "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-semibold"}>
                        {statusLabel[b.status] ?? b.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      {b.status === "CONFIRMED" && b.payment?.status !== "PAID" && (
                        <Link
                          href={`/parent/payments/${b.id}`}
                          className="text-caption bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full hover:opacity-90 font-semibold transition text-center"
                        >
                          Ödeme Yap →
                        </Link>
                      )}
                      {(b.status === "CONFIRMED" || b.status === "COMPLETED") && b.meetingUrl && (
                        <Link
                          href={b.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-caption bg-[#1a73e8] text-white px-3 py-1.5 rounded-full hover:bg-[#1558b0] font-semibold transition"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                          </svg>
                          Google Meet
                        </Link>
                      )}
                    </div>
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
