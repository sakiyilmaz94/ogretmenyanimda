import { db } from "@/lib/db";
import AdminBookingsView, { type AdminBookingItem } from "@/components/dashboard/AdminBookingsView";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: true, educator: { include: { user: true } }, slot: true, payment: true },
  });

  const items: AdminBookingItem[] = bookings.map((b) => ({
    id: b.id,
    studentName: b.student.name,
    educatorName: b.educator.user.name ?? "—",
    subject: b.subject,
    date: b.slot.date.toISOString(),
    startTime: b.slot.startTime,
    totalPrice: b.totalPrice.toNumber(),
    paymentStatus: b.payment?.status ?? null,
    status: b.status as AdminBookingItem["status"],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-md text-on-background">Rezervasyon Yönetimi</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Tüm rezervasyonları öğrenci, öğretmen, durum ve döneme göre filtreleyin.</p>
      </div>
      <AdminBookingsView bookings={items} />
    </div>
  );
}
