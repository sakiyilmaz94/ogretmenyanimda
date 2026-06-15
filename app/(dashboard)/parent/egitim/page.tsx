import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentEducationHub, { type StudentCard } from "@/components/dashboard/StudentEducationHub";

export const dynamic = "force-dynamic";

export default async function ParentEgitimPage() {
  const session = await auth();

  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: {
      students: {
        include: {
          bookings: {
            include: { slot: true, payment: true, assessment: true },
          },
        },
      },
    },
  });

  if (!parent) return null;

  const now = Date.now();

  const students: StudentCard[] = parent.students.map((s) => {
    const lessons = s.bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED");
    const tests = s.bookings.map((b) => b.assessment).filter((a): a is NonNullable<typeof a> => !!a);
    // lessons zaten CONFIRMED||COMPLETED (onaylı/ödenmiş); gelecekteki en yakını "sonraki ders"
    const upcoming = lessons
      .map((b) => b.slot.date.getTime())
      .filter((t) => t >= now)
      .sort((a, b) => a - b);
    const pendingPayment = s.bookings.some(
      (b) => b.status === "CONFIRMED" && (b.payment?.status ?? "PENDING") !== "PAID"
    );
    return {
      id: s.id,
      name: s.name,
      gradeLevel: s.gradeLevel,
      testCount: tests.length,
      completedTestCount: tests.filter((a) => a.status === "COMPLETED").length,
      lessonCount: lessons.length,
      nextLessonDate: upcoming.length > 0 ? new Date(upcoming[0]).toISOString() : null,
      pendingPayment,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Eğitim</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">Çocuklarınızın seviye testleri, ders geçmişi ve randevuları</p>
      </div>
      <StudentEducationHub
        students={students}
        basePath="/parent/egitim"
        emptyHint="Çocuk eklediğinizde ve ders aldıkça eğitim verileri burada toplanır."
      />
    </div>
  );
}
