import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentManager from "@/components/dashboard/StudentManager";

export const dynamic = "force-dynamic";

export default async function ParentStudentsPage() {
  const session = await auth();
  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: {
      students: {
        orderBy: { createdAt: "asc" },
        include: {
          bookings: {
            where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
            include: { educator: { include: { user: true } } },
          },
        },
      },
    },
  });

  if (!parent) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-on-background">Çocuklarım</h1>
        <p className="text-body-md text-on-surface-variant">Çocuklarınızın bilgilerini yönetin</p>
      </div>
      <StudentManager
        parentId={parent.id}
        students={parent.students.map((s) => ({
          id: s.id,
          name: s.name,
          gradeLevel: s.gradeLevel,
          birthDate: s.birthDate?.toISOString() ?? null,
          notes: s.notes,
          lessonCount: s.bookings.length,
          teachers: Array.from(new Set(s.bookings.map((b) => b.educator.user.name).filter((n): n is string => !!n))),
        }))}
      />
    </div>
  );
}
