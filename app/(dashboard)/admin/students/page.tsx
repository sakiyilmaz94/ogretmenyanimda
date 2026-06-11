import { db } from "@/lib/db";
import AdminStudentsView, { type AdminStudentItem } from "@/components/dashboard/AdminStudentsView";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const students = await db.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      parent: { include: { user: true } },
      bookings: { include: { educator: { include: { user: true } } } },
    },
  });

  const items: AdminStudentItem[] = students.map((s) => ({
    id: s.id,
    name: s.name,
    gradeLevel: s.gradeLevel,
    parentName: s.parent.user.name ?? "—",
    lessonCount: s.bookings.length,
    teachers: Array.from(new Set(s.bookings.map((b) => b.educator.user.name).filter((n): n is string => !!n))),
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-md text-on-background">Öğrenci Yönetimi</h1>
        <p className="text-label-md text-on-surface-variant mt-0.5">Öğrencileri sınıf, öğretmen, kayıt dönemi ve isme göre filtreleyin.</p>
      </div>
      <AdminStudentsView students={items} />
    </div>
  );
}
