import { auth } from "@/auth";
import { db } from "@/lib/db";
import EducatorSchedule from "@/components/dashboard/EducatorSchedule";
import type { BookingItem } from "@/components/dashboard/EducatorBookingsView";

export const dynamic = "force-dynamic";

export default async function EducatorSchedulePage() {
  const session = await auth();
  const educator = await db.educator.findUnique({ where: { userId: session!.user.id } });
  if (!educator) return null;

  const bookings = await db.booking.findMany({
    where: { educatorId: educator.id, status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] } },
    include: { student: true, slot: true },
  });

  const items: BookingItem[] = bookings.map((b) => ({
    id: b.id,
    status: b.status,
    studentName: b.student.name,
    parentName: "",
    gradeLevel: b.gradeLevel ?? null,
    subject: b.subject,
    date: b.slot.date.toISOString(),
    startTime: b.slot.startTime,
    endTime: b.slot.endTime,
    notes: null,
    totalPrice: 0,
    meetingUrl: null,
    report: null,
    assessment: null,
    createdAt: b.createdAt.toISOString(),
  }));

  return <EducatorSchedule bookings={items} />;
}
