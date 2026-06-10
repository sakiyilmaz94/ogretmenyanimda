import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import ParentBookingsView, { type ParentBookingItem } from "@/components/dashboard/ParentBookingsView";

export const dynamic = "force-dynamic";

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
              lessonReport: true,
            },
          },
        },
      },
    },
  });

  if (!parent) return null;

  const items: ParentBookingItem[] = parent.students.flatMap((s) =>
    s.bookings.map((b) => ({
      id: b.id,
      status: b.status,
      studentName: s.name,
      educatorName: b.educator.user.name ?? "—",
      subject: b.subject,
      date: b.slot.date.toISOString(),
      startTime: b.slot.startTime,
      totalPrice: b.totalPrice.toNumber(),
      paymentStatus: b.payment?.status ?? null,
      meetingUrl: b.meetingUrl,
      report: b.lessonReport
        ? {
            topicsCovered: b.lessonReport.topicsCovered,
            nextSteps: b.lessonReport.nextSteps,
            homework: b.lessonReport.homework,
            notes: b.lessonReport.notes,
            createdAt: b.lessonReport.createdAt.toISOString(),
          }
        : null,
    }))
  );

  return (
    <div className="space-y-6">
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
        <Link href="/parent/book" className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold">
          + Yeni Rezervasyon
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-container rounded-md p-10 text-center soft-card-static">
          <p className="text-3xl mb-3">📋</p>
          <h3 className="font-display font-semibold text-on-background mb-2">Henüz rezervasyon yok</h3>
          <p className="text-body-md text-on-surface-variant mb-4">İlk dersi hemen rezerve edin!</p>
          <Link href="/parent/book" className="inline-block rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold">
            Ders Al
          </Link>
        </div>
      ) : (
        <ParentBookingsView bookings={items} />
      )}
    </div>
  );
}
