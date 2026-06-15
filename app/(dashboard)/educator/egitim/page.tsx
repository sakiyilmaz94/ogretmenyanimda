import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentEducationHub, { type StudentCard } from "@/components/dashboard/StudentEducationHub";

export const dynamic = "force-dynamic";

export default async function EducatorEgitimPage() {
  const session = await auth();
  const educator = await db.educator.findUnique({ where: { userId: session!.user.id } });
  if (!educator) return null;

  const bookings = await db.booking.findMany({
    where: { educatorId: educator.id, status: { in: ["CONFIRMED", "COMPLETED"] } },
    include: { slot: true, payment: true, assessment: true, student: true },
  });

  const now = Date.now();
  const byStudent = new Map<string, typeof bookings>();
  for (const b of bookings) {
    const list = byStudent.get(b.studentId) ?? [];
    list.push(b);
    byStudent.set(b.studentId, list);
  }

  const students: StudentCard[] = Array.from(byStudent.values()).map((list) => {
    const s = list[0].student;
    const tests = list.map((b) => b.assessment).filter((a): a is NonNullable<typeof a> => !!a);
    // list zaten CONFIRMED||COMPLETED (onaylı/ödenmiş); gelecekteki en yakını "sonraki ders"
    const upcoming = list
      .map((b) => b.slot.date.getTime())
      .filter((t) => t >= now)
      .sort((a, b) => a - b);
    return {
      id: s.id,
      name: s.name,
      gradeLevel: s.gradeLevel,
      testCount: tests.length,
      completedTestCount: tests.filter((a) => a.status === "COMPLETED").length,
      lessonCount: list.length,
      nextLessonDate: upcoming.length > 0 ? new Date(upcoming[0]).toISOString() : null,
      pendingPayment: false,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Eğitim</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">Öğrencilerinizin seviye testleri, ders geçmişi ve randevuları</p>
      </div>
      <StudentEducationHub
        students={students}
        basePath="/educator/egitim"
        emptyHint="Onaylanmış randevusu olan öğrenciler burada görünür."
      />
    </div>
  );
}
