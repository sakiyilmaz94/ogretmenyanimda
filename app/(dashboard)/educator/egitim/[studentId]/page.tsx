import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentEducationDetail, {
  type AppointmentRecord,
  type TestRecord,
  type HistoryRecord,
} from "@/components/dashboard/StudentEducationDetail";
import type { LessonReportData } from "@/components/dashboard/LessonReportViewer";

export const dynamic = "force-dynamic";

export default async function EducatorStudentEgitimPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") redirect("/login");
  const { studentId } = await params;

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      parent: { include: { user: true } },
      bookings: {
        where: { educatorId: educator.id },
        include: { slot: true, payment: true, assessment: true, lessonReport: true },
      },
    },
  });

  const hasApproved = student?.bookings.some((b) => b.status === "CONFIRMED" || b.status === "COMPLETED");
  if (!student || !hasApproved) notFound();

  const parentName = student.parent.user.name ?? "Veli";

  const appointments: AppointmentRecord[] = student.bookings
    .filter((b) => b.status !== "PENDING")
    .map((b) => ({
      id: b.id,
      date: b.slot.date.toISOString(),
      startTime: b.slot.startTime,
      endTime: b.slot.endTime,
      subject: b.subject,
      status: b.status,
      paymentStatus: b.payment?.status ?? null,
      meetingUrl: b.meetingUrl,
      counterpartName: parentName,
    }));

  const tests: TestRecord[] = student.bookings
    .map((b) => b.assessment)
    .filter((a): a is NonNullable<typeof a> => !!a)
    .map((a) => ({
      id: a.id,
      date: (a.completedAt ?? a.sentAt).toISOString(),
      subject: a.subject,
      status: a.status,
    }));

  const history: HistoryRecord[] = student.bookings
    .filter((b) => b.status === "COMPLETED")
    .map((b) => ({
      bookingId: b.id,
      date: b.slot.date.toISOString(),
      subject: b.subject,
      counterpartName: parentName,
      report: b.lessonReport
        ? ({
            topics: b.lessonReport.topics,
            participation: b.lessonReport.participation,
            comprehension: b.lessonReport.comprehension,
            confidence: b.lessonReport.confidence,
            mastery: b.lessonReport.mastery,
            highlight: b.lessonReport.highlight,
            homework: (b.lessonReport.homework as { title: string; source?: string }[] | null) ?? null,
            parentTip: b.lessonReport.parentTip,
            createdAt: b.lessonReport.createdAt.toISOString(),
            studentName: student.name,
          } as LessonReportData)
        : null,
    }));

  return (
    <StudentEducationDetail
      studentName={student.name}
      gradeLevel={student.gradeLevel}
      appointments={appointments}
      tests={tests}
      history={history}
      canViewTestResults={true}
    />
  );
}
