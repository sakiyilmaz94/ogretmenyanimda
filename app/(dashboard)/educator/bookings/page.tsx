import { auth } from "@/auth";
import { db } from "@/lib/db";
import EducatorBookingsView, { type BookingItem } from "@/components/dashboard/EducatorBookingsView";

// Her zaman taze veri: tamamlanan seviye testi sonuçları anında görünsün (eski cache servis edilmesin).
export const dynamic = "force-dynamic";

export default async function EducatorBookingsPage() {
  const session = await auth();
  const educator = await db.educator.findUnique({ where: { userId: session!.user.id } });
  if (!educator) return null;

  const bookings = await db.booking.findMany({
    where: { educatorId: educator.id },
    orderBy: { createdAt: "desc" },
    include: {
      student: { include: { parent: { include: { user: true } } } },
      slot: true,
      payment: true,
      lessonReport: true,
      assessment: { include: { responses: true } },
    },
  });

  const items: BookingItem[] = bookings.map((b) => ({
    id: b.id,
    status: b.status,
    studentName: b.student.name,
    parentName: b.student.parent.user.name ?? "—",
    gradeLevel: b.gradeLevel ?? null,
    subject: b.subject,
    date: b.slot.date.toISOString(),
    startTime: b.slot.startTime,
    endTime: b.slot.endTime,
    notes: b.notes,
    totalPrice: b.totalPrice.toNumber(),
    meetingUrl: b.meetingUrl,
    paymentStatus: b.payment?.status ?? null,
    report: b.lessonReport
      ? {
          topics: b.lessonReport.topics,
          participation: b.lessonReport.participation,
          comprehension: b.lessonReport.comprehension,
          confidence: b.lessonReport.confidence,
          mastery: b.lessonReport.mastery,
          highlight: b.lessonReport.highlight,
          homework: (b.lessonReport.homework as { title: string; source?: string }[] | null) ?? null,
          parentTip: b.lessonReport.parentTip,
          createdAt: b.lessonReport.createdAt.toISOString(),
          studentName: b.student.name,
        }
      : null,
    assessment: b.assessment
      ? { id: b.assessment.id, status: b.assessment.status, responseCount: b.assessment.responses.length }
      : null,
    createdAt: b.createdAt.toISOString(),
  }));

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-headline-xl text-on-background">Rezervasyonlar</h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">Size yapılan tüm ders talepleri</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-12 text-center soft-card-static">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="font-display text-headline-md text-on-background mb-2">Henüz rezervasyon yok</h3>
          <p className="text-body-md text-on-surface-variant">Uygunluk takviminizi doldurduktan sonra veliler sizi seçebilecek.</p>
        </div>
      </div>
    );
  }

  return <EducatorBookingsView bookings={items} />;
}
