import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime, GRADE_LABELS } from "@/lib/utils";
import AdminBookingsView, { type AdminBookingItem } from "@/components/dashboard/AdminBookingsView";

export const dynamic = "force-dynamic";

const pStatus: Record<string, { label: string; cls: string }> = {
  PAID: { label: "Ödendi", cls: "bg-secondary-container text-on-secondary-container" },
  PENDING: { label: "Beklemede", cls: "bg-tertiary-fixed text-on-tertiary-fixed" },
  FAILED: { label: "Başarısız", cls: "bg-error-container text-on-error-container" },
  REFUNDED: { label: "İade", cls: "bg-surface-container text-on-surface-variant" },
};

export default async function AdminParentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parent = await db.parent.findUnique({
    where: { id },
    include: {
      user: true,
      students: {
        include: {
          bookings: {
            orderBy: { createdAt: "desc" },
            include: { educator: { include: { user: true } }, slot: true, payment: true },
          },
        },
      },
    },
  });
  if (!parent) notFound();

  const allBookings = parent.students.flatMap((s) => s.bookings.map((b) => ({ ...b, studentName: s.name })));
  const payments = allBookings.filter((b) => b.payment).map((b) => ({ ...b.payment!, studentName: b.studentName, educatorName: b.educator.user.name }));
  const totalSpent = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount.toNumber(), 0);

  const bookingItems: AdminBookingItem[] = allBookings.map((b) => ({
    id: b.id,
    studentName: b.studentName,
    educatorName: b.educator.user.name ?? "—",
    subject: b.subject,
    date: b.slot.date.toISOString(),
    startTime: b.slot.startTime,
    totalPrice: b.totalPrice.toNumber(),
    paymentStatus: b.payment?.status ?? null,
    status: b.status,
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/parents" className="p-2 hover:bg-surface-container rounded-lg transition border border-outline-variant/20">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display text-headline-md text-on-background">{parent.user.name}</h1>
          <p className="text-label-md text-on-surface-variant">{parent.user.email}{parent.phone ? ` · ${parent.phone}` : ""}</p>
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Çocuk", value: parent.students.length.toString() },
          { label: "Toplam Rezervasyon", value: allBookings.length.toString() },
          { label: "Tamamlanan Ödeme", value: payments.filter((p) => p.status === "PAID").length.toString() },
          { label: "Toplam Harcama", value: formatCurrency(totalSpent) },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-4 soft-card-static">
            <p className="text-caption text-on-surface-variant mb-1">{s.label}</p>
            <p className="font-display text-headline-md text-on-background">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Çocuklar */}
      <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-6 soft-card-static">
        <h2 className="font-display text-headline-md text-on-background mb-4">Çocuklar ({parent.students.length})</h2>
        {parent.students.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">Kayıtlı çocuk yok.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {parent.students.map((s) => (
              <div key={s.id} className="flex items-center gap-3 border border-outline-variant/20 rounded-xl p-3">
                <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  <span className="text-on-primary font-display font-bold">{s.name[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-on-background">{s.name}</p>
                  <p className="text-caption text-on-surface-variant">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel} · {s.bookings.length} ders</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rezervasyonlar (filtreli) */}
      <div>
        <h2 className="font-display text-headline-md text-on-background mb-3">Rezervasyonlar ({allBookings.length})</h2>
        {allBookings.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-8 text-center soft-card-static">
            <p className="text-label-md text-on-surface-variant">Henüz rezervasyon yok.</p>
          </div>
        ) : (
          <AdminBookingsView bookings={bookingItems} />
        )}
      </div>

      {/* Ödemeler */}
      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-hidden border border-outline-variant/20">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h2 className="font-display text-headline-md text-on-background">Ödemeler ({payments.length})</h2>
        </div>
        {payments.length === 0 ? (
          <p className="p-8 text-center text-label-md text-on-surface-variant">Henüz ödeme yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-md min-w-[620px]">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  <th className="text-left px-5 py-3 text-label-md font-semibold">Tarih</th>
                  <th className="text-left px-5 py-3 text-label-md font-semibold">Öğrenci</th>
                  <th className="text-left px-5 py-3 text-label-md font-semibold">Öğretmen</th>
                  <th className="text-left px-5 py-3 text-label-md font-semibold">Tutar</th>
                  <th className="text-left px-5 py-3 text-label-md font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low transition">
                    <td className="px-5 py-3 text-on-surface-variant text-caption">{formatDateTime(p.createdAt)}</td>
                    <td className="px-5 py-3 text-on-background">{p.studentName}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{p.educatorName}</td>
                    <td className="px-5 py-3 font-bold text-on-background">{formatCurrency(p.amount.toNumber())}</td>
                    <td className="px-5 py-3">
                      <span className={`text-caption px-3 py-1 rounded-full font-semibold ${pStatus[p.status]?.cls ?? "bg-surface-container text-on-surface-variant"}`}>
                        {pStatus[p.status]?.label ?? p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
